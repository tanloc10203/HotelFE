import { Box, Button, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { amenityTypeActions } from "~/features/amenityType";
import { useSnackbar } from "~/features/app";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IAmenityResponse } from "~/types";
import FormAddEditAmenity from "./form/FormAddEditAmenity";
import { amenityActions, useAmenity } from "~/features/amenity";
import TableAmenity from "./components/TableAmenity";
import { Link, useParams } from "react-router-dom";

const { HeadSeo, Container, Title, Grid, Card, StackCategory, Dialog, Breadcrumbs } = ForPage;

type Mode = "edit" | "delete" | "restore" | "delete_trash" | null;

const AmenityPage = () => {
  const dispatch = useAppDispatch();
  const {
    errors: { addEdit },
    filters,
    isLoading,
  } = useAmenity();

  const params = useParams();
  const isTrashMode = Boolean(params?.type === "trash");

  const { severity } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{
    mode: Mode;
    data: IAmenityResponse | null;
  }>({
    mode: null,
    data: null,
  });

  const isEditMode = useMemo(() => Boolean(selected.data && selected.mode === "edit"), [selected]);

  const initialValues = useMemo(() => {
    if (isEditMode) return selected.data!;
    return { desc: "", name: "", type_id: "" };
  }, [isEditMode]);

  const text = useMemo(() => {
    if (Boolean(isEditMode)) {
      return {
        text: "Lưu thay đổi",
        title: `Cập nhật \`${selected.data?.name}\``,
      };
    }

    return {
      text: "Tạo mới",
      title: `Thêm mới`,
    };
  }, [isEditMode]);

  useEffect(() => {
    dispatch(
      amenityActions.getDataStart({
        ...filters,
        ...(isTrashMode ? { delete_not_null: true, limit: 9999 } : {}),
      })
    );
  }, [filters, isTrashMode]);

  useEffect(() => {
    dispatch(amenityTypeActions.getDataStart({ page: 1, limit: 9999 }));
  }, []);

  useEffect(() => {
    if (severity === "success") {
      setSelected({ mode: null, data: null });
      if (open) {
        setOpen(false);
      }
    }
  }, [severity, open]);

  const handleSubmit = useCallback(
    (values: IAmenityResponse, resetForm: () => void) => {
      if (isEditMode) {
        dispatch(amenityActions.editDataStart({ ...values, resetForm }));
        return;
      }

      dispatch(amenityActions.addDataStart({ ...values, resetForm }));
    },
    [isLoading, isEditMode]
  );

  const handleOnEdit = (floor: IAmenityResponse) => {
    setSelected({ mode: "edit", data: floor });
  };

  const handleCloseModeEdit = useCallback(() => setSelected({ mode: null, data: null }), []);

  const handleOnDelete = useCallback((floor: IAmenityResponse) => {
    setSelected({ mode: "delete", data: floor });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleAgreeDelete = useCallback(() => {
    if (selected.mode === "delete" && selected.data) {
      dispatch(amenityActions.deleteDataStart(selected.data));
    }
  }, [selected]);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(amenityActions.setDebounceSearch({ ...filters, page: 0, name_like: value }));
    },
    [filters]
  );

  const title = useMemo(() => (isTrashMode ? "Thùng rác" : "Danh sách tiện nghi"), [isTrashMode]);

  const openRestore = useMemo(
    () => Boolean(selected?.mode === "restore" && selected?.data),
    [selected]
  );

  const openDeleteTrash = useMemo(
    () => Boolean(selected?.mode === "delete_trash" && selected?.data),
    [selected]
  );

  const handleOnRestore = useCallback((amenity: IAmenityResponse) => {
    setSelected({ mode: "restore", data: amenity });
  }, []);

  const handleOnDeleteTrash = useCallback((amenity: IAmenityResponse) => {
    setSelected({ mode: "delete_trash", data: amenity });
  }, []);

  const handleAgreeRestore = useCallback(() => {
    if (selected.mode === "restore" && selected.data) {
      dispatch(amenityActions.restoreDataStart(selected.data));
    }
  }, [selected]);

  const handleAgreeDeleteInTrash = useCallback(() => {
    if (selected.mode === "delete_trash" && selected.data) {
      dispatch(amenityActions.deleteInTrashStart(selected.data));
    }
  }, [selected]);

  return (
    <ForPage>
      <HeadSeo title={title} />

      <Container maxWidth="xl">
        <Title title={title} mb={2} />

        <Breadcrumbs
          data={
            isTrashMode
              ? [
                  { label: "Dang sách tiện nghi", to: DashboardPaths.Amenity },
                  { label: "Thùng rác" },
                ]
              : [{ label: "Dang sách tiện nghi" }]
          }
          mb={3}
        />

        <Dialog
          onAgree={handleAgreeDelete}
          onClose={handleClose}
          maxWidth="xs"
          open={open}
          textContent={`Bạn có chắc chắn muốn xóa \`${selected.data?.name}\`. Dữ liệu sẽ được chuyển vào thùng rác`}
          title={`Xác nhận xóa \`${selected.data?.name}\``}
        />

        <Dialog
          onAgree={handleAgreeRestore}
          onClose={handleCloseModeEdit}
          maxWidth="xs"
          open={openRestore}
          textContent={`Bạn có chắc chắn muốn khôi phục \`${selected.data?.name}\`.`}
          title={`Xác nhận \`${selected.data?.name}\``}
        />

        <Dialog
          onAgree={handleAgreeDeleteInTrash}
          onClose={handleCloseModeEdit}
          maxWidth="xs"
          open={openDeleteTrash}
          textContent={`Bạn có chắc chắn muốn xóa vinh viễn \`${selected.data?.name}\`.`}
          title={`Xác nhận \`${selected.data?.name}\``}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <Card title="" sx={{ position: "relative" }}>
              {isLoading === "pending" ? (
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

              <StackCategory my={3} justifyContent={"space-between"}>
                <Box sx={{ width: "40%" }}>
                  <TextField
                    onChange={handleChangeSearch}
                    value={search}
                    id="outlined-basic"
                    label="Tìm kiếm"
                    placeholder="Nhập tên  muốn tìm"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </Box>

                <Stack flexDirection={"row"} gap={1}>
                  {selected.mode === "edit" ? (
                    <Button variant="contained" fullWidth onClick={handleCloseModeEdit}>
                      Thêm mới
                    </Button>
                  ) : null}

                  <Button
                    variant="contained"
                    color={isTrashMode ? "primary" : "error"}
                    fullWidth
                    component={Link}
                    to={
                      isTrashMode
                        ? `${DashboardPaths.Amenity}`
                        : `${DashboardPaths.AmenityTrash}/trash`
                    }
                  >
                    {isTrashMode ? `Quay về Danh sách` : `Thùng rác`}
                  </Button>
                </Stack>
              </StackCategory>

              <TableAmenity
                isTrashMode={isTrashMode}
                onEdit={handleOnEdit}
                onDelete={handleOnDelete}
                onRestore={handleOnRestore}
                onDeleteTrash={handleOnDeleteTrash}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card title={text.title}>
              {addEdit ? (
                <Typography color="error" fontStyle={"italic"}>
                  {addEdit}
                </Typography>
              ) : null}

              <FormAddEditAmenity
                initialValues={initialValues as IAmenityResponse}
                textButton={text.text}
                onSubmit={handleSubmit}
                loading={isLoading === "pending"}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ForPage>
  );
};

export default AmenityPage;
