import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ColumnState, SelectInput, TabOptions } from "~/components";
import { ForPage, ResultFilterOptions } from "~/layouts";
import { DashboardPaths } from "~/types";
import { useLoadDataDepartment } from "../Departments/helpers/loadDataDepartment";
import { useLoadDataPosition } from "../Positions/helpers/loadDataPosition";
import TableRoleEmployee from "../RoleEmployee/components/TableRoleEmployee";
import useLoadDataEmployee from "../RoleEmployee/helpers/loadData";
import ActionEmployee from "./components/ActionEmployee";

const { HeadSeo, Container, Title, Card, StackCategory, Tab, ResultFilter, Breadcrumbs } = ForPage;

const columnMax = 12;
const percent = 100;
const percentMin = percent / columnMax;

const columnPercentGrid = (column: number) => column * percentMin;

const EmployeePage: FC = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tab, setTab] = useState(0);

  const [filterOperation, setFilterOperation] = useState<{
    position: number;
    department: number;
  }>({ position: -1, department: -1 });

  const { data, error, isLoading, isValidating } = useLoadDataEmployee({
    status: tab,
    ...filterOperation,
    page,
    limit: rowsPerPage,
  });
  const { data: dataPosition } = useLoadDataPosition();
  const { data: dataDepartment } = useLoadDataDepartment();

  const theme = useTheme();

  const [snackBar, setSnackBar] = useState<{ type: "error" | "success" | null; text: string }>({
    type: null,
    text: "",
  });

  const onChangePage = useCallback((newPage: number) => setPage(newPage), []);
  const onRowsPerPageChange = useCallback((number: number) => {
    setRowsPerPage(number);
    onChangePage(0);
  }, []);

  const columns: ColumnState[] = [
    // {
    //   id: "select",
    //   label: <Checkbox disabled />,
    //   maxWidth: 40,
    //   align: "center",
    //   styles: { padding: 0 },
    // },
    { id: "id", label: "", maxWidth: 30, minWidth: 30, align: "center" },
    { id: "display_name", label: "Tên nhân viên", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 170 },
    { id: "roles", label: "Vai trò", minWidth: 170 },
    { id: "position", label: "Chức vụ", minWidth: 170 },
    { id: "department", label: "Bộ phận", minWidth: 170 },
    { id: "gender", label: "Giới tính", minWidth: 40, align: "center" },
    { id: "status", label: "Trạng thái", maxWidth: 100, align: "center" },
    { id: "action", label: "Hành động", maxWidth: 80, align: "center" },
  ];

  const handleCloseSnackbar = useCallback(() => setSnackBar({ type: null, text: "" }), []);

  const tabsData = useMemo(
    (): TabOptions[] => [
      {
        id: 0,
        label: "Tất cả",
        bg: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
        bgActive:
          theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
        color:
          theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
        colorActive:
          theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
      },
      {
        id: 1,
        label: "Không hoạt động",
        bg: "rgba(255, 86, 48, 0.16)",
        bgActive: "rgb(255, 86, 48)",
        color: "rgb(255, 172, 130)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 2,
        label: "Xác thực",
        bg: "rgba(34, 197, 94, 0.16)",
        bgActive: "rgb(34, 197, 94)",
        color: "rgb(17, 141, 87)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 3,
        label: "Bị cấm",
        bg: "rgba(255, 171, 0, 0.16)",
        bgActive: "rgb(255, 171, 0)",
        color: "rgb(183, 110, 0)",
        colorActive: "rgb(255, 255, 255)",
      },
      {
        id: 4,
        label: "Nghỉ hưu",
        bg: "rgba(145, 158, 171, 0.16)",
        bgActive: "rgb(145, 158, 171)",
        color: "rgb(99, 115, 129)",
        colorActive: "rgb(255, 255, 255)",
      },
    ],
    [theme]
  );

  const visible = useMemo(() => {
    return tab !== 0 || filterOperation.department !== -1 || filterOperation.position !== -1;
  }, [tab, filterOperation]);

  const filtersResults = useMemo((): ResultFilterOptions[] => {
    let results: ResultFilterOptions[] = [];

    if (tab !== 0) {
      results = [...results, { label: "Trạng thái", data: tabsData[tab].label as string }];
    }

    if (filterOperation.department !== -1) {
      const find = dataDepartment?.metadata?.find((t) => t.id! === +filterOperation.department!);
      results = [...results, { label: "Bộ phận", data: find?.name as string }];
    }

    if (filterOperation.position !== -1) {
      const find = dataPosition?.metadata?.find((t) => t.id! === +filterOperation.position!);
      results = [...results, { label: "Chức vụ", data: find?.name as string }];
    }

    return results;
  }, [tab, filterOperation]);

  const handleChangeOperation = useCallback((type: "department" | "position", value: number) => {
    setFilterOperation((prev) => ({ ...prev, [type]: value }));
  }, []);

  const handleCleanFilter = useCallback(() => {
    setTab(0);
    setFilterOperation({ position: -1, department: -1 });
  }, []);

  const handleChangeTab = useCallback((value: number) => {
    if (value === 0) {
      handleCleanFilter();
      return;
    }

    setTab(value);
  }, []);

  return (
    <ForPage>
      <HeadSeo title="Quản lý nhân viên" />

      <Container maxWidth="xl">
        <Title title="Quản lý nhân viên" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách nhân viên" }]} mb={3} />

        <Snackbar
          open={Boolean(snackBar.type && snackBar.text) || Boolean(error?.response?.data?.message)}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackBar.type ? "info" : error?.response?.data?.message ? "warning" : "info"}
            sx={{ width: "100%" }}
          >
            {(snackBar.text ? snackBar.text : "") || error?.response?.data?.message}
          </Alert>
        </Snackbar>

        <Card
          action={
            <Button
              component={Link}
              to={DashboardPaths.AddEmployee}
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
            >
              Thêm nhân viên
            </Button>
          }
          title=""
          sx={{ position: "relative", mt: 5 }}
        >
          <Tab value={tab} tabsData={tabsData} onChange={handleChangeTab} />

          <StackCategory my={3}>
            <Box width={`${columnPercentGrid(1.725)}%`}>
              <SelectInput
                value={filterOperation.department}
                onChange={(event) =>
                  handleChangeOperation("department", event.target.value as number)
                }
                options={
                  dataDepartment?.metadata?.map((item) => ({
                    label: item.name,
                    value: item.id! + "",
                  })) ?? []
                }
                label="Bộ phận"
              />
            </Box>

            <Box width={`${columnPercentGrid(1.725)}%`}>
              <SelectInput
                value={filterOperation.position}
                onChange={(event) =>
                  handleChangeOperation("position", event.target.value as number)
                }
                options={
                  dataPosition?.metadata?.map((item) => ({
                    label: item.name,
                    value: item.id! + "",
                  })) ?? []
                }
                label="Chức vụ"
              />
            </Box>

            <Box width={`${columnPercentGrid(12 - 1.725 * 2 - 0.3)}%`}>
              <TextField
                id="outlined-basic"
                label="Tìm kiếm"
                placeholder="Nhập tên nhân viên muốn tìm"
                variant="outlined"
                fullWidth
              />
            </Box>

            <Box width={`${columnPercentGrid(0.3)}%`}>
              <ActionEmployee />
            </Box>
          </StackCategory>

          <ResultFilter
            visible={visible}
            filters={filtersResults}
            numberResult={data?.options?.totalRows as number}
            onReset={handleCleanFilter}
          />

          {isLoading || isValidating ? (
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
          ) : error ? (
            <Typography>Đã xảy ra lỗi khi tải dữ liệu</Typography>
          ) : null}

          <TableRoleEmployee
            totalRow={data?.options?.totalPage}
            checkedEmployee={null}
            columns={columns}
            data={data?.metadata!}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Card>
      </Container>
    </ForPage>
  );
};

export default EmployeePage;
