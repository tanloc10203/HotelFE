import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Alert, Box, Button, Checkbox, LinearProgress, Snackbar, Typography } from "@mui/material";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { ColumnState } from "~/components";
import { ForPage } from "~/layouts";
import { RolePayload, TypeEmployeeResponse } from "~/types";
import { useLoadRole } from "../Role/helpers/loadData";
import DialogChangeRole from "./components/DialogChangeRole";
import TableRoleEmployee from "./components/TableRoleEmployee";
import useLoadDataEmployee, {
  addRoleEmployeeMutate,
  addRoleEmployeeOptions,
} from "./helpers/loadData";

const { HeadSeo, Container, Title, Card, Breadcrumbs } = ForPage;

type RoleEmployeePageProps = {};

const RoleEmployeePage: FC<RoleEmployeePageProps> = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading, isValidating, mutate } = useLoadDataEmployee();
  const { data: dataRole, error: errorRole, isLoading: loadingRole } = useLoadRole();
  const [selectedEmployee, setSelectedEmployee] = useState<TypeEmployeeResponse | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [values, setValues] = useState<RolePayload[]>([]);
  const [snackBar, setSnackBar] = useState<{ type: "error" | "success" | null; text: string }>({
    type: null,
    text: "",
  });

  const onCloseDialog = useCallback(() => setOpenDialog(false), []);
  const onOpenDialog = useCallback(() => setOpenDialog(true), []);
  const onChangePage = useCallback((newPage: number) => setPage(newPage), []);
  const onRowsPerPageChange = useCallback((number: number) => {
    setRowsPerPage(number);
    onChangePage(0);
  }, []);

  const handleChangeSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const { name } = event.target;
      if (!data?.metadata.length || !name) return;

      const employeeId = +name;
      const employee = data.metadata.find((t) => t.id === employeeId);

      setSelectedEmployee(checked ? employee! : null);
    },
    [data]
  );

  const columns: ColumnState[] = [
    {
      id: "select",
      label: <Checkbox disabled />,
      maxWidth: 40,
      align: "center",
      styles: { padding: 0 },
    },
    { id: "id", label: "Mã nhân viên", minWidth: 80, align: "center" },
    { id: "display_name", label: "Tên nhân viên", minWidth: 170 },
    { id: "roles", label: "Vai trò", minWidth: 170 },
    { id: "status", label: "Trạng thái", maxWidth: 50, align: "center" },
    // { id: "action", label: "Hành động", maxWidth: 50, align: "center" },
  ];

  const handleOpenChangeRole = useCallback(() => {
    if (!selectedEmployee || !dataRole?.metadata?.length) return;
    onOpenDialog();
    const { roles } = selectedEmployee;
    if (!roles?.length) return;
    setValues(roles);
  }, [selectedEmployee, dataRole]);

  const handleChangeValues = useCallback((values: RolePayload[]) => {
    setValues(values);
  }, []);

  const handleSubmitChangeRole = useCallback(async () => {
    if (!selectedEmployee || !data) return;

    if (!values.length) {
      setSnackBar({
        type: "error",
        text: "Vui lòng chọn vai trò",
      });
      return;
    }

    try {
      await mutate(
        addRoleEmployeeMutate(selectedEmployee.id!, values, data),
        addRoleEmployeeOptions(selectedEmployee.id!, values, data) as any
      );

      setSnackBar({
        type: "success",
        text: `Cập nhật quyền cho nhân viên ${selectedEmployee.display_name} thành công`,
      });

      setSelectedEmployee(null);

      onCloseDialog();

      setValues([]);
    } catch (error: any) {
      const { response } = error;

      let message = "Cập nhật quyền không thành công";

      if (response && response.data) {
        message = response.data.message;
      }

      setSnackBar({ type: "error", text: message });
    }
  }, [values, selectedEmployee, data]);

  const emptySelectedEmployee = useMemo(() => !selectedEmployee, [selectedEmployee]);

  const handleCloseSnackbar = useCallback(() => setSnackBar({ type: null, text: "" }), []);

  return (
    <ForPage>
      <HeadSeo title="Quản lý phân quyền nhân viên" />

      <Container maxWidth="xl">
        <Title title="Quản lý phân quyền nhân viên" mb={2} />

        <Breadcrumbs data={[{ label: "Quản lý vai trò" }]} mb={3} />

        <Snackbar
          open={Boolean(snackBar.type && snackBar.text)}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackBar.type ?? "info"}
            sx={{ width: "100%" }}
          >
            {snackBar.text ? snackBar.text : ""}
          </Alert>
        </Snackbar>

        {/* <StackCategory>
          <TextField
            id="outlined-basic"
            label="Tìm kiếm"
            placeholder="Nhập tên nhân viên muốn tìm"
            variant="outlined"
            sx={{
              minWidth: {
                lg: "40%",
                md: "50%",
                xs: "100%",
              },
            }}
          />
        </StackCategory> */}

        <Card
          title="Danh sách nhân viên"
          sx={{ position: "relative", mt: 5 }}
          action={
            !emptySelectedEmployee ? (
              <Button
                variant="contained"
                startIcon={<VerifiedUserIcon />}
                onClick={handleOpenChangeRole}
              >
                Cập nhật vai trò
              </Button>
            ) : null
          }
        >
          {isLoading || isValidating || loadingRole ? (
            <Box
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <LinearProgress />
            </Box>
          ) : error || errorRole ? (
            <Typography>Đã xảy ra lỗi khi tải dữ liệu</Typography>
          ) : data?.metadata && data.metadata.length > 0 ? (
            <>
              <TableRoleEmployee
                checkedEmployee={selectedEmployee}
                columns={columns}
                data={data?.metadata!}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onRowsPerPageChange}
                onCheckedEmployee={handleChangeSelect}
              />

              {dataRole?.metadata && dataRole.metadata.length ? (
                <DialogChangeRole
                  displayName={selectedEmployee?.display_name!}
                  onAgree={handleSubmitChangeRole}
                  options={dataRole.metadata}
                  open={openDialog}
                  value={values}
                  onClose={onCloseDialog}
                  onChangeSelected={handleChangeValues}
                />
              ) : null}
            </>
          ) : (
            <Typography>Chưa có dữ liệu</Typography>
          )}
        </Card>
      </Container>
    </ForPage>
  );
};

export default RoleEmployeePage;
