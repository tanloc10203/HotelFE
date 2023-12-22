import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Snackbar,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ColumnState } from "~/components";
import { ForPage } from "~/layouts";
import { IPermission } from "~/types";
import FormAddEditPermission from "./form/FormAddEditPermission";
import useLoaderPermission, {
  addMutationPermission as addPermission,
  addPermissionOptions,
  deleteMutationPermission,
  deletePermissionOptions,
  updateMutationPermission as updatePermission,
  updatePermissionOptions,
} from "./useLoaderPermission";

const { HeadSeo, Container, Title, Grid, Card, StackCategory, Table, Dialog } = ForPage;

const PermissionPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 500);
  const {
    data,
    error: errorGet,
    isLoading,
    isValidating,
    mutate,
  } = useLoaderPermission({ name: debounceValue });
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUpdate, setSelectedUpdate] = useState<IPermission | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<IPermission | null>(null);
  const [errorDelete, setErrorDelete] = useState("");

  const handleClickOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleSelectedDelete = useCallback((selected: IPermission) => {
    handleClickOpen();
    setSelected(selected);
  }, []);

  const handleAgreeDelete = useCallback(async () => {
    if (!selected) return;
    try {
      await mutate(
        deleteMutationPermission(selected, data!),
        deletePermissionOptions(selected as IPermission, data!)
      );
      toast.success("Xóa thành công.");
    } catch (error: any) {
      const { response } = error;

      let message = "Xóa quyền không thành công";

      if (response && response.data) {
        message = response.data.message;
      }

      setErrorDelete(message);
    }

    handleClose();
    setSelected(null);
  }, [selected]);

  const handleSubmit = useCallback(
    async (values: Partial<IPermission>, resetForm: () => void) => {
      try {
        setError("");

        if (selectedUpdate) {
          setSelectedUpdate(values as IPermission);
          await mutate(updatePermission(values, data!), updatePermissionOptions());
        } else {
          await mutate(
            addPermission(values, data!),
            addPermissionOptions(values as IPermission, data!)
          );
        }

        toast.success("Thêm quyền thành công");
        resetForm();
        setError("");
      } catch (error: any) {
        const { response } = error;

        let message = "Thêm quyền không thành công";

        if (response && response.data) {
          message = response.data.message;
        }

        setError(message);
        toast.error(message);
      }
    },
    [data, selectedUpdate]
  );

  const columns: ColumnState[] = [
    { id: "name", label: "Tên quyền", minWidth: 170 },
    { id: "alias", label: "Định danh quyền", minWidth: 170 },
    { id: "desc", label: "Mô tả quyền", minWidth: 170 },
    { id: "action", label: "Hành động", minWidth: 80, align: "center" },
  ];

  const handleSetErrorDeleteEmpty = useCallback(() => setErrorDelete(""), []);

  const handleChoseUpdate = useCallback((permission: IPermission) => {
    setSelectedUpdate(permission);
  }, []);

  const initialValues = useMemo(() => {
    if (!selectedUpdate) return { alias: "", name: "", desc: "" };
    return selectedUpdate;
  }, [selectedUpdate]);

  const handleCloseModeEdit = useCallback(() => setSelectedUpdate(null), []);

  return (
    <ForPage>
      <HeadSeo title="Quản lý quyền" />

      <Container maxWidth="xl">
        <Title title="Quản lý quyền" />

        <Snackbar
          open={Boolean(errorDelete)}
          autoHideDuration={6000}
          onClose={handleSetErrorDeleteEmpty}
        >
          <Alert onClose={handleSetErrorDeleteEmpty} severity="error" sx={{ width: "100%" }}>
            {errorDelete}
          </Alert>
        </Snackbar>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Card title="Danh sách quyền">
              <StackCategory justifyContent={"space-between"}>
                <TextField
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  id="outlined-basic"
                  label="Tìm kiếm"
                  placeholder="Nhập tên quyền bạn muốn tìm"
                  variant="outlined"
                  sx={{
                    minWidth: {
                      lg: "40%",
                      md: "50%",
                      xs: "100%",
                    },
                  }}
                />

                {selectedUpdate ? (
                  <Button variant="contained" onClick={handleCloseModeEdit}>
                    Thêm quyền
                  </Button>
                ) : null}
              </StackCategory>

              {open && selected ? (
                <Dialog
                  onAgree={handleAgreeDelete}
                  onClose={handleClose}
                  maxWidth="xs"
                  open={open}
                  textContent="Bạn có chắc chắn muốn xóa"
                  title={`Xóa quyền ${selected.name}`}
                />
              ) : null}

              <Box sx={{ position: "relative", width: "100%", height: "100%", mt: 3 }}>
                {isLoading || isValidating ? (
                  <Box
                    sx={{
                      width: "100%",
                      position: "absolute",
                      top: -5,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <LinearProgress />
                  </Box>
                ) : errorGet ? (
                  <Typography>Đã xảy ra lỗi khi tải dữ liệu</Typography>
                ) : (
                  <Table
                    onPageChange={(newPage: number) => setPage(newPage)}
                    onRowsPerPageChange={(number: number) => {
                      setRowsPerPage(number);
                      setPage(0);
                    }}
                    columns={columns}
                    totalRow={data?.metadata.length!}
                    page={page}
                    rowsPerPage={rowsPerPage}
                  >
                    {data?.metadata && data.metadata.length > 0 ? (
                      data.metadata.map((row) => (
                        <TableRow key={row.name}>
                          {columns.map((column) => {
                            const value = row[column.id as keyof IPermission];

                            if (column.id === "action") {
                              return (
                                <TableCell
                                  key={column.id}
                                  component="th"
                                  scope="row"
                                  align={column.align}
                                >
                                  <Button onClick={() => handleChoseUpdate(row)}>Cập nhật</Button>
                                  <Button onClick={() => handleSelectedDelete(row)} color="error">
                                    Xóa
                                  </Button>
                                </TableCell>
                              );
                            }

                            return (
                              <TableCell
                                key={column.id}
                                component="th"
                                scope="row"
                                align={column.align}
                              >
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          Chưa có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </Table>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card title={selectedUpdate ? "Cập nhật" : "Thêm quyền"}>
              {error ? (
                <Typography
                  mb={1}
                  variant="body2"
                  color={"error"}
                  fontStyle={"italic"}
                  fontWeight={700}
                >
                  {error}
                </Typography>
              ) : null}

              <FormAddEditPermission initialValues={initialValues} onSubmit={handleSubmit} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ForPage>
  );
};

export default PermissionPage;
