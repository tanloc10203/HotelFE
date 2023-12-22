import { Box, Button, LinearProgress, TextField, Typography } from "@mui/material";
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "~/features/app";
import { equipmentTypeActions, useEquipmentType } from "~/features/equipmentType";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IEquipmentType } from "~/types";
import TableEquipmentType from "./components/TableEquipmentType";
import FormAddEditEquipmentType from "./form/FormAddEditEquipmentType";

const { HeadSeo, Container, Title, Grid, Card, StackCategory, Dialog, Breadcrumbs } = ForPage;

const EquipmentTypePage: FC = () => {
  const dispatch = useAppDispatch();
  const {
    errors: { addEdit },
    filters,
    isLoading,
  } = useEquipmentType();

  const { severity } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{
    mode: "edit" | "delete" | null;
    data: IEquipmentType | null;
  }>({
    mode: null,
    data: null,
  });

  const isEditMode = useMemo(() => Boolean(selected.data && selected.mode === "edit"), [selected]);

  const initialValues = useMemo(() => {
    if (isEditMode) return selected.data!;
    return { desc: "", name: "" };
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
    dispatch(equipmentTypeActions.getDataStart(filters));
  }, [filters]);

  useEffect(() => {
    if (severity === "success") {
      setSelected({ mode: null, data: null });
      if (open) {
        setOpen(false);
      }
    }
  }, [severity, open]);

  const handleSubmit = useCallback(
    (values: IEquipmentType, resetForm: () => void) => {
      if (isEditMode) {
        dispatch(equipmentTypeActions.editDataStart({ ...values, resetForm }));
        return;
      }

      dispatch(equipmentTypeActions.addDataStart({ ...values, resetForm }));
    },
    [isLoading, isEditMode]
  );

  const handleOnEdit = (floor: IEquipmentType) => {
    setSelected({ mode: "edit", data: floor });
  };

  const handleCloseModeEdit = useCallback(() => setSelected({ mode: null, data: null }), []);

  const handleOnDelete = useCallback((floor: IEquipmentType) => {
    setSelected({ mode: "delete", data: floor });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleAgreeDelete = useCallback(() => {
    if (selected.mode === "delete" && selected.data) {
      dispatch(equipmentTypeActions.deleteDataStart(selected.data));
    }
  }, [selected]);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(equipmentTypeActions.setDebounceSearch({ ...filters, page: 0, name_like: value }));
    },
    [filters]
  );

  return (
    <ForPage>
      <HeadSeo title="Danh sách loại thiết bị" />

      <Container maxWidth="xl">
        <Title title="Danh sách loại thiết bị" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách  loại thiết bị" }]} mb={3} />

        <Dialog
          onAgree={handleAgreeDelete}
          onClose={handleClose}
          maxWidth="xs"
          open={open}
          textContent="Bạn có chắc chắn muốn xóa"
          title={`Xóa \`${selected.data?.name}\``}
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

              <StackCategory my={3}>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    onChange={handleChangeSearch}
                    value={search}
                    id="outlined-basic"
                    label="Tìm kiếm"
                    placeholder="Nhập tên  muốn tìm"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                {selected.mode === "edit" ? (
                  <Box sx={{ width: "20%" }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleCloseModeEdit}
                    >
                      Thêm mới
                    </Button>
                  </Box>
                ) : null}
              </StackCategory>

              <TableEquipmentType onEdit={handleOnEdit} onDelete={handleOnDelete} />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card title={text.title}>
              {addEdit ? (
                <Typography color="error" fontStyle={"italic"}>
                  {addEdit}
                </Typography>
              ) : null}

              <FormAddEditEquipmentType
                initialValues={initialValues}
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

export default EquipmentTypePage;
