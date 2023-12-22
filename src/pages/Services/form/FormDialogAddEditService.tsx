import { LoadingButton, TabContext, TabList } from "@mui/lab";
import {
  Box,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  Tab,
  TextField,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { NumericFormatCustom, SelectInput, UploadMultipleImage } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { useUnits } from "~/contexts/UnitContext";
import { useOverplay } from "~/features/app";
import { useServiceSelector } from "~/features/service";
import { useServiceTypesOptions } from "~/features/serviceTypes";
import { IServicePayload, ServicesUnitType, UnitPayloadAddProduct } from "~/types";
import AttributesProduct, { RenderItemUnit } from "../components/AttributesProduct";
import { serviceSchema } from "../schema/serviceTypesSchema";
import FormDialogAddUnit from "./FormDialogAddUnit";
import { toast } from "react-toastify";

interface FormDialogAddEditServiceProps {
  initialValues: IServicePayload;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
  onClose?: () => void;
}

const FormDialogAddEditService: FC<FormDialogAddEditServiceProps> = ({
  onClose,
  onSubmit,
  initialValues,
  textButton,
}) => {
  const lastUnits = useRef<UnitPayloadAddProduct[]>([]);
  const { openAddEdit } = useServiceSelector();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: serviceSchema,
    onSubmit: (values, { resetForm }) => {
      if (!values.units?.every((t) => t.unit_id)) {
        toast.error("Chưa chọn  đơn vị  tính");
        return;
      }

      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    lastUnits.current = values.units!;
  }, [values]);

  const { unitOptions } = useUnits();
  const { open: OpenOverplay } = useOverplay();

  const [tab, setTab] = useState("1");
  const [openAddUnit, setOpenAddUnit] = useState(false);

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

  const handleChangeValueUnits = useCallback(
    (key: keyof ServicesUnitType, value: string | number | boolean, index: number) => {
      const last = [...lastUnits.current!];
      // @ts-ignore
      last[index][key] = value;

      setFieldValue("units", [...last]);
    },
    [lastUnits]
  );

  return (
    <FormikProvider value={formik}>
      <FormDialogAddUnit
        initialValues={{ name: "" }}
        open={openAddUnit}
        onClose={handleCloseAddUnit}
      />

      <Dialog maxWidth="md" fullWidth open={openAddEdit} onClose={onClose}>
        <DialogTitle>{textButton}</DialogTitle>

        <DialogContent sx={SCROLLBAR_CUSTOM}>
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
                      label="Mã dịch vụ"
                      placeholder="VD: dịch vụ 1"
                      fullWidth
                      value={`${initialValues?.id ?? ""}`}
                      margin="normal"
                      disabled
                    />

                    <TextField
                      label="Tên dịch vụ"
                      placeholder="VD: dịch vụ 1"
                      fullWidth
                      {...getFieldProps("name")}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      margin="normal"
                    />

                    <SelectInput
                      options={options}
                      type="number"
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
                      type="number"
                      fullWidth
                      label="Thời lượng"
                      placeholder="VD: dịch vụ 1"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">Phút</InputAdornment>,
                      }}
                      {...getFieldProps("timer")}
                      error={touched.timer && Boolean(errors.timer)}
                      helperText={touched.timer && errors.timer}
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
                    <Stack mt={2}>
                      <AttributesProduct
                        toggle
                        data={values?.units as any[]}
                        label="Đơn vị tính"
                        key={"unit"}
                        maxAddValue={1}
                      >
                        {values?.units?.map((item, index) => (
                          <Collapse key={index}>
                            <RenderItemUnit
                              onOnChecked={(value, index) => {
                                handleChangeValueUnits("is_sell", value, index);
                              }}
                              onSelectUnit={(id, index) => {
                                handleChangeValueUnits("unit_id", id, index);
                              }}
                              {...item}
                              unitOptions={unitOptions}
                              index={index}
                            />
                          </Collapse>
                        ))}
                      </AttributesProduct>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Box>
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

export default FormDialogAddEditService;
