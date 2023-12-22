import { Box, Button, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "~/features/app";
import { equipmentActions, useEquipment } from "~/features/equipment";
import { equipmentTypeActions } from "~/features/equipmentType";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IEquipmentResponse } from "~/types";
import TableEquipment from "./components/TableEquipment";
import FormAddEditEquipment from "./form/FormAddEditEquipment";
import { Link, useParams } from "react-router-dom";

const { HeadSeo, Container, Title, Grid, Card, StackCategory, Dialog, Breadcrumbs } = ForPage;

type Mode = "edit" | "delete" | "restore" | "delete_trash" | null;

const EquipmentPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const isTrashMode = Boolean(params?.type === "trash");

  const {
    errors: { addEdit },
    filters,
    isLoading,
  } = useEquipment();

  const { severity } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{
    mode: Mode;
    data: IEquipmentResponse | null;
  }>({
    mode: null,
    data: null,
  });

  const isEditMode = useMemo(() => Boolean(selected.data && selected.mode === "edit"), [selected]);

  const initialValues = useMemo(() => {
    if (isEditMode) return selected.data!;
    return { desc: "", name: "", equipment_type_id: "", group: "" as any };
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
      equipmentActions.getDataStart({
        ...filters,
        ...(isTrashMode ? { delete_not_null: true, limit: 9999 } : {}),
      })
    );
  }, [filters, isTrashMode]);

  useEffect(() => {
    dispatch(equipmentTypeActions.getDataStart({ page: 1, limit: 100 }));
    dispatch(equipmentActions.getDataGroupsStart());
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
    (values: IEquipmentResponse, resetForm: () => void) => {
      console.log(`data`, values);

      if (isEditMode) {
        dispatch(equipmentActions.editDataStart({ ...values, resetForm }));
        return;
      }
      dispatch(equipmentActions.addDataStart({ ...values, resetForm }));
    },
    [isLoading, isEditMode]
  );

  const handleOnEdit = (floor: IEquipmentResponse) => {
    setSelected({ mode: "edit", data: floor });
  };

  const handleCloseModeEdit = useCallback(() => setSelected({ mode: null, data: null }), []);

  const handleOnDelete = useCallback((floor: IEquipmentResponse) => {
    setSelected({ mode: "delete", data: floor });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleAgreeDelete = useCallback(() => {
    if (selected.mode === "delete" && selected.data) {
      dispatch(equipmentActions.deleteDataStart(selected.data));
    }
  }, [selected]);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(equipmentActions.setDebounceSearch({ ...filters, page: 0, name_like: value }));
    },
    [filters]
  );

  const title = useMemo(() => (isTrashMode ? "Thùng rác" : "Danh sách thiết bị"), [isTrashMode]);

  const openRestore = useMemo(
    () => Boolean(selected?.mode === "restore" && selected?.data),
    [selected]
  );

  const openDeleteTrash = useMemo(
    () => Boolean(selected?.mode === "delete_trash" && selected?.data),
    [selected]
  );

  const handleOnRestore = useCallback((equipment: IEquipmentResponse) => {
    setSelected({ mode: "restore", data: equipment });
  }, []);

  const handleOnDeleteTrash = useCallback((equipment: IEquipmentResponse) => {
    setSelected({ mode: "delete_trash", data: equipment });
  }, []);

  const handleAgreeRestore = useCallback(() => {
    if (selected.mode === "restore" && selected.data) {
      dispatch(equipmentActions.restoreDataStart(selected.data));
    }
  }, [selected]);

  const handleAgreeDeleteInTrash = useCallback(() => {
    if (selected.mode === "delete_trash" && selected.data) {
      dispatch(equipmentActions.deleteInTrashStart(selected.data));
    }
  }, [selected]);

  return (
    <ForPage>
      <HeadSeo title={title} />

      <Container maxWidth="xl">
        <Title title={title} mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách thiết bị" }]} mb={3} />

        <Dialog
          onAgree={handleAgreeDelete}
          onClose={handleClose}
          maxWidth="xs"
          open={open}
          textContent={`Bạn có chắc chắn muốn xóa \`${selected.data?.name}\`. Dữ liệu sẽ được chuyển vào thùng rác`}
          title={`Xóa \`${selected.data?.name}\``}
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
                    <Button variant="contained" onClick={handleCloseModeEdit}>
                      Thêm mới
                    </Button>
                  ) : null}

                  <Button
                    variant="contained"
                    color={isTrashMode ? "primary" : "error"}
                    component={Link}
                    to={
                      isTrashMode
                        ? `${DashboardPaths.Equipment}`
                        : `${DashboardPaths.EquipmentTrash}/trash`
                    }
                  >
                    {isTrashMode ? `Quay về Danh sách` : `Thùng rác`}
                  </Button>
                </Stack>
              </StackCategory>

              <TableEquipment
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

              <FormAddEditEquipment
                initialValues={initialValues as IEquipmentResponse}
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

export default EquipmentPage;
