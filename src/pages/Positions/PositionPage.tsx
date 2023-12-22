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
import { FC, useCallback, useMemo, useState, ChangeEvent } from "react";
import { ColumnState } from "~/components";
import { ForPage } from "~/layouts";
import { IPosition } from "~/types";
import FormAddEditPosition from "./form/FormAddEditPosition";
import {
  addPositionMutate,
  addPositionOption,
  deletePositionMutate,
  deletePositionOption,
  editPositionMutate,
  editPositionOption,
  useLoadDataPosition,
} from "./helpers/loadDataPosition";
import { useDebounce } from "@uidotdev/usehooks";

const { HeadSeo, Container, Title, Table, Card, StackCategory, Grid, Dialog, Breadcrumbs } =
  ForPage;

const CustomerPage: FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    type: "edit" | "delete" | null;
    data: IPosition | null;
  }>({ type: null, data: null });
  const [errorAddEdit, setErrorAddEdit] = useState<{
    type: AlertColor | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const filter = useDebounce(search, 300);

  const { data, error, isLoading, isValidating, mutate } = useLoadDataPosition({ name: filter });

  const columns: ColumnState[] = [
    { id: "name", label: "Tên chức vụ", minWidth: 180 },
    { id: "desc", label: "Mô tả chức vụ", minWidth: 180 },
    { id: "actions", label: "Hành động", minWidth: 90, align: "center" },
  ];

  const resetSelected = () => setSelected({ type: null, data: null });

  const handleSubmit = async (values: IPosition, resetForm: () => void) => {
    try {
      setLoading(true);
      let text = "";

      if (selected.type === "edit") {
        text = "Cập nhật chức vụ thành công";
        await mutate(editPositionMutate(values, data!), editPositionOption());
        handleCloseModeEdit();
      } else {
        text = "Thêm chức vụ mới thành công";
        await mutate(addPositionMutate(values, data!), addPositionOption(values, data!));
      }
      setErrorAddEdit({ type: "success", text: text });
      resetForm();
    } catch (error: any) {
      const { response } = error;

      let message = "Thêm chức vụ không thành công";

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
    (row: IPosition) => setSelected({ type: "edit", data: row }),
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
        ? { title: "Cập nhật chức vụ", text: "Lưu thay đổi" }
        : { title: "Thêm mới chức vụ", text: "tạo mới chức vụ" },
    [selected]
  );

  const handleClickDelete = useCallback((row: IPosition) => {
    setSelected({ type: "delete", data: row });
    setOpen(true);
  }, []);

  const handleAgreeDelete = useCallback(async () => {
    if (selected.type !== "delete" || !selected.data) return;

    try {
      await mutate(deletePositionMutate(selected.data, data!), deletePositionOption());
    } catch (error: any) {
      const { response } = error;

      let message = `Xóa vai trò \`${selected.data.name}\` không thành công`;

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
      text: `Xóa chức vụ \`${selected.data.name}\` thành công`,
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
      <HeadSeo title="Quản lý chức vụ" />

      <Container maxWidth="xl">
        <Title title="Danh sách chức vụ" mb={2} />

        <Breadcrumbs data={[{ label: "Danh sách chức vụ" }]} mb={3} />

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
          title={`Xóa chức vụ \`${selected.data?.name}\``}
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
                    placeholder="Nhập tên chức vụ muốn tìm"
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
                      Thêm chức vụ
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
                          const value = row[column.id as keyof IPosition];

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

export default CustomerPage;
