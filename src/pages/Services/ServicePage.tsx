import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Fade,
  IconButton,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { ActionsRefsProps, SelectInput } from "~/components";
import { appActions, useOverplay } from "~/features/app";
import { serviceActions, useServiceSelector } from "~/features/service";
import { serviceTypesActions, useServiceTypesSelector } from "~/features/serviceTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IService, ProductPayload } from "~/types";
import TableServiceTypes from "./components/TableServiceTypes";
import FormDialogAddEditProduct from "./form/FormDialogAddEditProduct";
import FormDialogAddEditService from "./form/FormDialogAddEditService";
import { useColumnServices } from "./helpers/useColumnService";
import useServiceHelpers from "./helpers/useServiceHelpers";

const { HeadSeo, Container, Title, Card, Breadcrumbs, StackCategory } = ForPage;

const ServicePage = () => {
  const {
    isEditMode,
    data,
    isLoading,
    initialValues,
    pagination,
    textsByMode,
    anchorEl,
    textsByModeProduct,
    initialValuesProduct,
    open,
    type,
    search,
    handleChangeSearch,
    handleClickMenuItem,
    handleCloseMenuItem,
    handleOnCloseDialog,
    handleOnCloseDialogAddEditProduct,
    handleOpenFormDialog,
    handleOnSubmit,
    handleOnClick,
    handleCloseModeEdit,
    handleChangePage,
    handleOpenFormDialogAddEditProduct,
    onChangeType,
  } = useServiceHelpers();

  const dispatch = useAppDispatch();

  const columns = useColumnServices();
  const { open: loading } = useOverplay();
  const { openAddEditProduct, openAddEdit } = useServiceSelector();
  const { data: serviceOptions } = useServiceTypesSelector();

  const ref = useRef<ActionsRefsProps | null>(null);

  useEffect(() => {
    dispatch(appActions.openOverplay());
    dispatch(serviceTypesActions.getDataStart({ limit: 9999, page: 1 }));
  }, []);

  const handleEdit = useCallback(
    (row: IService, isProduct: boolean) => {
      handleOnClick("edit", row, isProduct);
      if (!ref.current) return;
      ref.current.onClose();
    },
    [ref]
  );

  const renderActions = useCallback(
    (row: IService) => {
      return (
        <Tooltip title="Chỉnh sửa">
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => handleEdit(row, row.is_product!)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      );
    },
    [handleEdit, ref]
  );

  const handleOnSubmitProduct = useCallback(
    (values: ProductPayload, resetForm: () => void) => {
      dispatch(appActions.openOverplay(`Đang ${isEditMode ? "Cập nhật" : "Thêm"} dữ liệu...`));

      if (isEditMode) {
        const {
          id,
          service_type_id,
          name,
          desc,
          note,
          price_original,
          price_sell,
          units,
          photo_public,
          priceData,
          min_quantity_product,
          quantity,
          attributes,
        } = values;

        dispatch(
          serviceActions.editProductStart({
            ...{
              id,
              service_type_id,
              name,
              price_id: priceData?.id,
              price_original,
              price_sell,
              min_quantity_product,
              desc,
              note,
              quantity,
              units,
              photo_public,
              attributes,
            },
            resetForm,
          })
        );
        return;
      }

      dispatch(serviceActions.addDataProductStart({ ...values, resetForm }));
    },
    [isEditMode]
  );

  return (
    <ForPage>
      <HeadSeo title="Danh sách dịch vụ" />

      {openAddEdit ? (
        <FormDialogAddEditService
          initialValues={initialValues}
          textButton={textsByMode.textButton}
          onClose={handleOnCloseDialog}
          onSubmit={handleOnSubmit}
        />
      ) : null}

      {openAddEditProduct ? (
        <FormDialogAddEditProduct
          textButton={textsByModeProduct.textButton}
          onClose={handleOnCloseDialogAddEditProduct}
          onSubmit={handleOnSubmitProduct}
          loading={loading}
          initialValues={initialValuesProduct}
        />
      ) : null}

      <Container maxWidth="xl">
        <Title title="Danh sách dịch vụ" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách dịch vụ" }]} mb={3} />

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
            <Box sx={{ width: "60%" }}>
              <Stack flexDirection={"row"} gap={2}>
                <Box sx={{ width: "40%" }}>
                  <TextField
                    onChange={handleChangeSearch}
                    value={search}
                    id="outlined-basic"
                    fullWidth
                    label="Tìm kiếm"
                    placeholder="Nhập tên  muốn tìm"
                    variant="outlined"
                    size="small"
                    margin="none"
                  />
                </Box>

                <Box sx={{ width: "40%" }}>
                  <SelectInput
                    onChange={({ target: { value } }) => onChangeType(value as string)}
                    value={type}
                    margin="none"
                    size="small"
                    options={[
                      { label: "Tất cả", value: "-1" },
                      ...serviceOptions.map((t) => ({ label: t.name, value: t.id! })),
                    ]}
                    label="Loại dịch vụ"
                  />
                </Box>
              </Stack>
            </Box>

            <Stack flexDirection={"row"} gap={2}>
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  endIcon={<ExpandMoreIcon />}
                  variant="contained"
                  onClick={handleClickMenuItem}
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  Thêm mới
                </Button>
                <Menu
                  slotProps={{ paper: { sx: { minWidth: 146 } } }}
                  sx={{ width: "100%" }}
                  id="fade-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenuItem}
                  TransitionComponent={Fade}
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                >
                  <MenuItem onClick={handleOpenFormDialog}>
                    <ListItemIcon>
                      <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" fontSize={12}>
                      Thêm dịch vụ
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleOpenFormDialogAddEditProduct}>
                    <ListItemIcon>
                      <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" fontSize={12}>
                      Thêm hàng hóa
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>

              <Button
                startIcon={<ExitToAppIcon />}
                variant="contained"
                onClick={handleCloseModeEdit}
              >
                Xuất file
              </Button>
            </Stack>
          </StackCategory>

          <TableServiceTypes
            columns={columns}
            data={data}
            page={pagination.page}
            totalPage={pagination.totalPage}
            actions={renderActions}
            onChangePage={handleChangePage}
          />
        </Card>
      </Container>
    </ForPage>
  );
};

export default ServicePage;
