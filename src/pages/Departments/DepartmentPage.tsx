import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Snackbar,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { ColumnState } from "~/components";
import { ForPage } from "~/layouts";
import { IDepartment } from "~/types";
import FormAddEditPosition from "./form/FormAddEditDepartment";
import {
  addDepartmentMutate,
  addDepartmentOption,
  deleteDepartmentMutate,
  deleteDepartmentOption,
  editDepartmentMutate,
  editDepartmentOption,
  useLoadDataDepartment,
} from "./helpers/loadDataDepartment";

const { HeadSeo, Container, Title, Table, Card, StackCategory, Grid, Dialog, Breadcrumbs } =
  ForPage;

const DepartmentPage: FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    type: "edit" | "delete" | null;
    data: IDepartment | null;
  }>({ type: null, data: null });
  const [errorAddEdit, setErrorAddEdit] = useState<{
    type: AlertColor | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const filter = useDebounce(search, 300);

  const { data, error, isLoading, isValidating, mutate } = useLoadDataDepartment({ name: filter });

  const columns: ColumnState[] = [
    { id: "name", label: "Tên bộ phận", minWidth: 180 },
    { id: "desc", label: "Mô tả bộ phận", minWidth: 180 },
    { id: "actions", label: "Hành động", minWidth: 90, align: "center" },
  ];

  const resetSelected = () => setSelected({ type: null, data: null });

  const handleSubmit = async (values: IDepartment, resetForm: () => void) => {
    try {
      setLoading(true);
      let text = "";

      if (selected.type === "edit") {
        text = "Cập nhật bộ phận thành công";
        await mutate(editDepartmentMutate(values, data!), editDepartmentOption());
        handleCloseModeEdit();
      } else {
        text = "Thêm bộ phận mới thành công";
        await mutate(addDepartmentMutate(values, data!), addDepartmentOption(values, data!));
      }
      setErrorAddEdit({ type: "success", text: text });
      resetForm();
    } catch (error: any) {
      const { response } = error;

      let message = "Thêm bộ phận không thành công";

      if (response && response.data) {
        message = response.data.message;
      }

      setErrorAddEdit({ text: message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSetErrorDeleteEmpty = useCallback(
    () => setErrorAddEdit({ text: "", type: null }),
    []
  );

  const handleClickEdit = useCallback(
    (row: IDepartment) => setSelected({ type: "edit", data: row }),
    []
  );
  const handleCloseModeEdit = useCallback(() => resetSelected(), []);

  const initialValues = useMemo(() => {
    if (selected.type !== "edit") return { desc: "", name: "" };
    return selected.data!;
  }, [selected]);

  const textButton = useMemo(
    () =>
      selected.type === "edit"
        ? { title: "Cập nhật bộ phận", text: "Lưu thay đổi" }
        : { title: "Thêm mới bộ phận", text: "tạo mới bộ phận" },
    [selected]
  );

  const handleClickDelete = useCallback((row: IDepartment) => {
    setSelected({ type: "delete", data: row });
    setOpen(true);
  }, []);

  const handleAgreeDelete = useCallback(async () => {
    if (selected.type !== "delete" || !selected.data) return;

    try {
      await mutate(deleteDepartmentMutate(selected.data, data!), deleteDepartmentOption());
    } catch (error: any) {
      const { response } = error;

      let message = `Xóa bộ phận \`${selected.data.name}\` không thành công`;

      if (response && response.data) {
        message = response.data.message;
      }

      setErrorAddEdit({
        type: "error",
        text: message,
      });
    }

    handleClose();
    setErrorAddEdit({
      type: "success",
      text: `Xóa bộ phận \`${selected.data.name}\` thành công`,
    });
    resetSelected();
  }, [selected]);

  const handleClose = useCallback(() => {
    setOpen(false);
    resetSelected();
  }, []);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    []
  );

  return (
    <ForPage>
      <HeadSeo title="Quản lý bộ phận" />

      <Container maxWidth="xl">
        <Title title="Danh sách bộ phận" mb={2} />

        <Breadcrumbs data={[{ label: "Danh sách bộ phận" }]} mb={3} />

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(errorAddEdit.type && errorAddEdit.text)}
          autoHideDuration={1500}
          onClose={handleSetErrorDeleteEmpty}
        >
          <Alert
            variant="filled"
            onClose={handleSetErrorDeleteEmpty}
            severity={errorAddEdit.type ? errorAddEdit.type : "info"}
            sx={{ width: "100%" }}
          >
            {errorAddEdit.text}
          </Alert>
        </Snackbar>

        <Dialog
          onAgree={handleAgreeDelete}
          onClose={handleClose}
          maxWidth="xs"
          open={open}
          textContent="Bạn có chắc chắn muốn xóa"
          title={`Xóa bộ phận \`${selected.data?.name}\``}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Card title="" sx={{ position: "relative" }}>
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
              ) : null}

              {error ? (
                <Typography color="error" fontStyle={"italic"}>
                  Đã xảy ra lỗi khi tải dữ liệu. Thử lại sau
                </Typography>
              ) : null}

              <StackCategory my={3}>
                <Box sx={{ width: selected.type === "edit" ? "80%" : "100%" }}>
                  <TextField
                    onChange={handleChangeSearch}
                    value={search}
                    id="outlined-basic"
                    label="Tìm kiếm"
                    placeholder="Nhập tên bộ phận muốn tìm"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                {selected.type === "edit" ? (
                  <Box sx={{ width: "20%" }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleCloseModeEdit}
                    >
                      Thêm bộ phận
                    </Button>
                  </Box>
                ) : null}
              </StackCategory>

              <Table
                onPageChange={(newPage: number) => setPage(newPage)}
                onRowsPerPageChange={(number: number) => {
                  setRowsPerPage(number);
                  setPage(0);
                }}
                columns={columns}
                totalRow={data?.metadata?.length}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 15, 25, 30]}
                sxHeadCell={{
                  background:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[800]
                      : theme.palette.grey[200],
                }}
              >
                {data?.metadata?.length ? (
                  data.metadata.map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id as keyof IDepartment];

                          if (column.id === "actions") {
                            return (
                              <TableCell
                                key={column.id}
                                style={{ minWidth: column.minWidth }}
                                align={column.align}
                              >
                                <IconButton
                                  onClick={() => handleClickDelete(row)}
                                  aria-label="delete"
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="edit"
                                  color="primary"
                                  onClick={() => handleClickEdit(row)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : search ? (
                  <TableRow hover tabIndex={-1}>
                    <TableCell colSpan={3}>
                      <Typography color="error" fontStyle={"italic"}>
                        Không tìm thấy dữ liệu
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow hover tabIndex={-1}>
                    <TableCell colSpan={3}>
                      <Typography color="error" fontStyle={"italic"}>
                        Chưa có dữ liệu. Vui lòng thêm mới
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </Table>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card title={textButton.title}>
              {errorAddEdit.type === "error" && errorAddEdit.text ? (
                <Typography color="error" fontStyle={"italic"}>
                  {errorAddEdit.text}
                </Typography>
              ) : null}
              <FormAddEditPosition
                loading={loading}
                textButton={textButton.text}
                initialValues={initialValues}
                onSubmit={handleSubmit}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ForPage>
  );
};

export default DepartmentPage;
