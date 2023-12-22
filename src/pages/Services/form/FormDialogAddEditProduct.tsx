import { LoadingButton, TabContext, TabList } from "@mui/lab";
import {
  Alert,
  Box,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  TextField,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NumericFormatCustom, SelectInput, UploadMultipleImage } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { useUnits } from "~/contexts/UnitContext";
import { appActions, useOverplay } from "~/features/app";
import { serviceActions, useServiceSelector } from "~/features/service";
import { useServiceTypesOptions } from "~/features/serviceTypes";
import { useAppDispatch } from "~/stores";
import {
  AttributesAddProduct,
  ProductPayload,
  ServicesAttributeType,
  ServicesUnitType,
  UnitPayloadAddProduct,
} from "~/types";
import AttributesProduct, {
  RenderItemAttribute,
  RenderItemUnit,
} from "../components/AttributesProduct";
import { serviceProductSchema } from "../schema/serviceTypesSchema";
import FormDialogAddUnit from "./FormDialogAddUnit";
import FormDialogAddAttribute from "./FormDialogAddAttribute";
import { useAttributes } from "~/contexts/AttributeContext";

interface FormDialogAddEditProductProps {
  initialValues: ProductPayload;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
  onClose?: () => void;
}

const FormDialogAddEditProduct: FC<FormDialogAddEditProductProps> = ({
  onClose,
  onSubmit,
  initialValues,
  textButton,
}) => {
  const dispatch = useAppDispatch();
  const { openAddEditProduct, openAddAttribute } = useServiceSelector();
  const { unitOptions } = useUnits();
  const { attributeOptions } = useAttributes();
  const { open: OpenOverplay } = useOverplay();

  const [tab, setTab] = useState("1");
  const [openAddUnit, setOpenAddUnit] = useState(false);

  const lastUnits = useRef<UnitPayloadAddProduct[]>([]);
  const lastAttributes = useRef<AttributesAddProduct[]>([]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: serviceProductSchema,
    onSubmit: (values, { resetForm }) => {
      if (values.units) {
        const { units } = values;

        if (!units.every((u) => u.unit_id !== 0)) {
          dispatch(
            appActions.setSnackbar({
              open: true,
              severity: "error",
              text: `Vui lòng chọn đơn vị tính`,
            })
          );
          return;
        }
      }

      if (values.attributes) {
        const { attributes } = values;

        if (!attributes.every((u) => u.attribute_id) || !attributes.every((u) => u.value)) {
          dispatch(
            appActions.setSnackbar({
              open: true,
              severity: "error",
              text: `Vui lòng chọn thuộc tính hoặc nhập giá trị`,
            })
          );
          return;
        }
      }

      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    lastUnits.current = values.units!;
    lastAttributes.current = values.attributes!;
  }, [values]);

  const handleClickOpen = useCallback(() => {
    setOpenAddUnit(true);
  }, []);

  const handleCloseAddUnit = useCallback(() => {
    setOpenAddUnit(false);
  }, []);

  const options = useServiceTypesOptions();

  const handleChange = useCallback((_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  }, []);

  const handleChangeImages = useCallback(async (files: FileList) => {
    setFieldValue("photo_public", files[0]);
  }, []);

  const handleOnRemove = useCallback(async () => {
    setFieldValue("photo_public", undefined);
  }, []);

  const handleRemoveUnit = useCallback(
    (index: number) => {
      setFieldValue("units", [...values?.units!.filter((_, i) => i !== index)]);
    },
    [values]
  );

  const handleAddUnit = useCallback(() => {
    if (values.units?.length && !values.units.every((e) => e.unit_id !== 0)) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "warning",
          text: "Vui lòng chọn đơn vị trước khi thêm mới.",
        })
      );
      return;
    }

    setFieldValue("units", [
      ...values.units!,
      { is_sell: true, quantity: 1, price: values.price_original!, is_default: false, unit_id: 0 },
    ]);
  }, [values]);

  const handleAddAttribute = useCallback(() => {
    const attributeData = [...values?.attributes!];
    if (attributeData.length && !attributeData.every((e) => e.attribute_id)) {
      dispatch(
        appActions.setSnackbar({
          open: true,
          severity: "warning",
          text: "Vui lòng chọn thuộc tính trước khi thêm mới.",
        })
      );
      return;
    }

    setFieldValue("attributes", [...attributeData, { attribute_id: "", quantity: 20, value: "" }]);
  }, [values]);

  const handleChangeValueAttributes = useCallback(
    (key: keyof ServicesAttributeType, value: string | boolean, index: number) => {
      const attributeData = [...lastAttributes.current];

      if (key === "attribute_id") {
        if (attributeData.map((r) => r.attribute_id).includes(value as string)) {
          dispatch(
            appActions.setSnackbar({
              open: true,
              severity: "error",
              text: "Thuộc tính đã tồn tại. Vui lòng chọn thuộc tính khác",
            })
          );
          return;
        }
      }

      //@ts-ignore
      attributeData[index][key] = value;

      setFieldValue("attributes", attributeData);
    },
    [lastAttributes]
  );

  const handleChangeValueUnits = useCallback(
    (key: keyof ServicesUnitType, value: string | number | boolean, index: number) => {
      if (key === "price" || key === "quantity") {
        value = Math.max(0, +value);
      }

      const last = [...lastUnits.current!];

      if (key === "unit_id") {
        if (last.map((r) => r.unit_id).includes(value as number)) {
          dispatch(
            appActions.setSnackbar({
              open: true,
              severity: "error",
              text: "Tên đơn vị đã bị trùng",
            })
          );

          last[index][key] = 0;

          setFieldValue("units", last);
          return;
        }
      }

      // @ts-ignore
      last[index][key] = value;

      setFieldValue("units", [...last]);
    },
    [lastUnits]
  );

  const handleCloseAddAttribute = useCallback(() => {
    dispatch(serviceActions.setToggleAddAttribute(false));
  }, []);

  const handleOpenAddAttribute = useCallback(() => {
    dispatch(serviceActions.setToggleAddAttribute(true));
  }, []);

  const labelUnit = useMemo(() => {
    const defaultValues = values.units?.find((u) => u.is_default)!;
    return unitOptions.find((u) => u.value === defaultValues.unit_id)?.label;
  }, [values, unitOptions]);

  return (
    <FormikProvider value={formik}>
      <FormDialogAddUnit
        initialValues={{ name: "" }}
        open={openAddUnit}
        onClose={handleCloseAddUnit}
      />

      <FormDialogAddAttribute
        initialValues={{ name: "" }}
        open={openAddAttribute}
        onClose={handleCloseAddAttribute}
      />

      <Dialog maxWidth="lg" fullWidth open={openAddEditProduct} onClose={onClose}>
        <DialogTitle>{textButton}</DialogTitle>

        <DialogContent dividers sx={SCROLLBAR_CUSTOM}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <TabContext value={tab}>
              <TabList onChange={handleChange}>
                <Tab label="Thông tin" value="1" />
                <Tab label="Mô tả chi tiết" value="2" />
              </TabList>

              {tab === "1" ? (
                <Grid container spacing={1}>
                  <Grid item md={8}>
                    <TextField
                      label="Mã hàng hóa"
                      placeholder="VD: Mã tự động"
                      fullWidth
                      value={`${initialValues?.id ?? ""}`}
                      margin="normal"
                      disabled
                    />

                    <TextField
                      label="Tên hàng hóa"
                      placeholder="VD: Nước giải khát coca"
                      fullWidth
                      {...getFieldProps("name")}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      margin="normal"
                    />

                    <SelectInput
                      options={options}
                      fullWidth
                      label="Loại dịch vụ"
                      {...getFieldProps("service_type_id")}
                      error={touched.service_type_id && Boolean(errors.service_type_id)}
                      helperText={touched.service_type_id && errors.service_type_id}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <TextField
                      fullWidth
                      label="Giá vốn"
                      placeholder="VD: 35.000"
                      {...getFieldProps("price_original")}
                      error={touched.price_original && Boolean(errors.price_original)}
                      helperText={touched.price_original && errors.price_original}
                      margin="normal"
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Giá bán"
                      placeholder="VD: 50.000"
                      {...getFieldProps("price_sell")}
                      error={touched.price_sell && Boolean(errors.price_sell)}
                      helperText={touched.price_sell && errors.price_sell}
                      margin="normal"
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label="Tồn kho"
                      placeholder="VD: 50.000"
                      {...getFieldProps("quantity")}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item lg={12}>
                    <Box>
                      <UploadMultipleImage
                        values={values.photo_public}
                        multiple={false}
                        label={""}
                        defaultValues={
                          initialValues.photo_public ? [initialValues.photo_public] : []
                        }
                        onChange={handleChangeImages}
                        onRemove={handleOnRemove}
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                        gap={2}
                        mt={0}
                      />
                    </Box>
                  </Grid>

                  <Grid item lg={12}>
                    <AttributesProduct
                      toggle={false}
                      textButton={"Thêm thuộc tính"}
                      data={attributeOptions}
                      label="Thuộc tính (Màu sắc, kích  thước, ...)"
                      key={"attribute"}
                      onAdd={handleAddAttribute}
                    >
                      <Stack mx={2} mb={2}>
                        <Alert severity="info">
                          Nếu bạn muốn thêm nhiều thuộc tính giống nhau nhưng giá trị khác nhau. Vui
                          lòng tạo 1 hàng hóa mới.
                        </Alert>
                      </Stack>
                      {values?.attributes?.map((item, index) => (
                        <Collapse key={index}>
                          <RenderItemAttribute
                            {...item}
                            attributeOptions={attributeOptions}
                            index={index}
                            onClickOpenAddAttribute={handleOpenAddAttribute}
                            onSelectAttribute={(id, index) => {
                              handleChangeValueAttributes("attribute_id", id, index);
                            }}
                            onChangeValue={(key, value, index) => {
                              handleChangeValueAttributes(key, value, index);
                            }}
                          />
                        </Collapse>
                      ))}
                    </AttributesProduct>

                    <Stack mt={2}>
                      <AttributesProduct
                        toggle
                        textButton={"Thêm đơn vị"}
                        data={values?.units as any[]}
                        label="Đơn vị tính"
                        key={"unit"}
                        onAdd={handleAddUnit}
                        maxAddValue={5}
                      >
                        <Stack mb={2}>
                          <Alert color="info">Đơn vị tính sẽ có giá theo giá vốn bạn đã nhập</Alert>
                        </Stack>

                        {values?.units?.map((item, index) => (
                          <Collapse key={index}>
                            <RenderItemUnit
                              {...item}
                              unitOptions={unitOptions}
                              index={index}
                              onRemoveUnit={handleRemoveUnit}
                              onChangeValue={(key, value, index) =>
                                handleChangeValueUnits(key, value, index)
                              }
                              onClickOpen={handleClickOpen}
                              onOnChecked={(value, index) => {
                                handleChangeValueUnits("is_sell", value, index);
                              }}
                              onSelectUnit={(id, index) => {
                                handleChangeValueUnits("unit_id", id, index);
                              }}
                              label={labelUnit ?? ""}
                            />
                          </Collapse>
                        ))}
                      </AttributesProduct>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Box mt={1}>
                  <Alert severity="info">
                    Hệ thống sẽ nhắc nhở bạn khi số lượng hàng hóa đến mức tối thiểu
                  </Alert>

                  <TextField
                    fullWidth
                    label="Số lượng tối thiểu"
                    placeholder="VD: 5"
                    {...getFieldProps("min_quantity_product")}
                    error={touched.min_quantity_product && Boolean(errors.min_quantity_product)}
                    helperText={touched.min_quantity_product && errors.min_quantity_product}
                    margin="normal"
                  />

                  <TextField
                    multiline
                    rows={2}
                    fullWidth
                    label="Mô tả dịch vụ"
                    placeholder="VD: dịch vụ 1"
                    {...getFieldProps("desc")}
                    error={touched.desc && Boolean(errors.desc)}
                    helperText={touched.desc && errors.desc}
                    margin="normal"
                  />

                  <TextField
                    multiline
                    rows={2}
                    fullWidth
                    label="Ghi chú dịch vụ"
                    placeholder="VD: dịch vụ 1"
                    {...getFieldProps("note")}
                    error={touched.note && Boolean(errors.note)}
                    helperText={touched.note && errors.note}
                    margin="normal"
                  />
                </Box>
              )}
            </TabContext>
          </Form>
        </DialogContent>

        <DialogActions>
          <LoadingButton onClick={onClose}>Cancel</LoadingButton>
          <LoadingButton
            onClick={handleSubmit as () => void}
            type="submit"
            variant="contained"
            disabled={OpenOverplay}
            loading={OpenOverplay}
          >
            <span>{textButton}</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
};

export default FormDialogAddEditProduct;
