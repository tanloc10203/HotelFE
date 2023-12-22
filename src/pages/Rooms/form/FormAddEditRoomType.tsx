import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useState } from "react";
import { SelectInputAutoComplete, UploadMultipleImage } from "~/components";
import { useAmenity } from "~/features/amenity";
import { useEquipment } from "~/features/equipment";
import { useRoomTypes } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { IAmenityResponse, IEquipmentResponse, IRoomTypePayload } from "~/types";
import { roomTypeSchema } from "../schema/roomTypeSchema";

const { Grid, Card } = ForPage;

export type ChangeValuePayload =
  | { type: "equipments"; data: IEquipmentResponse[] }
  | { type: "amenities"; data: IAmenityResponse[] };

export type ValuesProperty = {
  equipments: IEquipmentResponse[];
  amenities: IAmenityResponse[];
};

interface FormAddEditRoomTypeProps {
  initialValues: IRoomTypePayload;
  defaultValuesImages?: string[];
  onSubmit?: (...args: any[]) => void;
  onChangeValues?: (payload: ChangeValuePayload) => void;
  textButton: string;
  loading?: boolean;
  values: ValuesProperty;
}

const FormAddEditRoomType: FC<FormAddEditRoomTypeProps> = ({
  onSubmit,
  onChangeValues,
  defaultValuesImages,
  initialValues,
  textButton,
  values,
}) => {
  const [arrayRemove, setArrayRemove] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: roomTypeSchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.({ ...values, removeImages: arrayRemove }, resetForm);
    },
  });

  const { isLoading } = useRoomTypes();

  const {
    errors,
    touched,
    values: valuesForm,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;
  const { data: optionAmenity } = useAmenity();
  const { data: OptionEquipment } = useEquipment();

  const handleChangeValue = useCallback(
    async ({ data, type }: ChangeValuePayload) => {
      if (!onChangeValues) return;
      onChangeValues({ data, type } as ChangeValuePayload);
      if (!data.length) return await setFieldValue(type, null);
      const value = data.map((d) => ({ id: d.id! }));
      await setFieldValue(type, value);
    },
    [onChangeValues]
  );

  const handleChangeImages = useCallback(
    async (files: FileList) => {
      let data: any[] = [];

      if (!valuesForm.images) {
        data = [...Array.from(files)];
      } else {
        data = [...valuesForm.images, ...Array.from(files)];
      }

      await setFieldValue("images", data);
    },
    [valuesForm]
  );

  const handleOnRemove = useCallback(
    async (file: any) => {
      if (!valuesForm.images) return;

      if (file instanceof File) {
        const newValues = valuesForm.images.filter((v) => v.name !== file.name);
        await setFieldValue("images", newValues.length ? newValues : null);
      }

      if (Array.isArray(file)) {
        const resultRemoveAll = file.filter((value) => typeof value === "string");
        setArrayRemove((prev) => [...prev, ...resultRemoveAll]);
        await setFieldValue("images", null);
      }

      if (typeof file === "string") {
        const newValues = valuesForm.images.filter((v) => v !== file);
        setArrayRemove((prev) => [...prev, file]);
        await setFieldValue("images", newValues.length ? newValues : null);
      }
    },
    [valuesForm]
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <Typography variant="h6">Chi tiết</Typography>
                <Typography variant="body2" color={"text.secondary"}>
                  Tên loại phòng, kí tự loại phòng, mô tả loại phòng, ảnh...
                </Typography>
              </Grid>
              <Grid item md={8}>
                <Card
                  title=""
                  sx={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <TextField
                    label="Tên loại phòng"
                    placeholder="VD: Bình thường"
                    fullWidth
                    {...getFieldProps("name")}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Kí tự loại phòng"
                    placeholder="VD: BT"
                    {...getFieldProps("character")}
                    error={touched.character && Boolean(errors.character)}
                    helperText={touched.character && errors.character}
                    margin="normal"
                  />

                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    label="Mô tả loại phòng"
                    placeholder="VD: Loại phòng bình thường"
                    {...getFieldProps("desc")}
                    error={touched.desc && Boolean(errors.desc)}
                    helperText={touched.desc && errors.desc}
                    margin="normal"
                  />

                  <UploadMultipleImage
                    label="Ảnh"
                    defaultValues={defaultValuesImages}
                    values={valuesForm.images}
                    onChange={handleChangeImages}
                    onRemove={handleOnRemove}
                    error={touched.images && Boolean(errors.images)}
                    helperText={touched.images && errors.images}
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} xs={12}>
            <Grid container spacing={2} justifyContent="flex-end" direction="row">
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Tiện nghi, thiết bị</Typography>
                <Typography variant="body2" color={"text.secondary"}>
                  Tiện nghi và thiết bị trang bị cho loại phòng...
                </Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <Card
                  title=""
                  sx={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <SelectInputAutoComplete
                    label="Thiết bị"
                    placeholder="..."
                    value={values.equipments}
                    options={OptionEquipment}
                    keyOption="name"
                    key="equipments"
                    error={touched.equipments && Boolean(errors.equipments)}
                    helperText={touched.equipments && errors.equipments}
                    onChange={(data) =>
                      handleChangeValue({ type: "equipments", data: data as IEquipmentResponse[] })
                    }
                  />

                  <SelectInputAutoComplete
                    label="Tiện nghi"
                    placeholder="..."
                    value={values.amenities}
                    options={optionAmenity}
                    keyOption="name"
                    key="amenities"
                    error={touched.amenities && Boolean(errors.amenities)}
                    helperText={touched.amenities && errors.amenities}
                    onChange={(data) =>
                      handleChangeValue({ type: "amenities", data: data as IAmenityResponse[] })
                    }
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} xs={12}>
            <Grid container spacing={2} justifyContent="flex-end" direction="row">
              <Grid item md={4} xs={12}>
                <></>
              </Grid>
              <Grid item md={8} xs={12}>
                <></>
              </Grid>

              <Grid item md={12}>
                <Stack justifyContent={"flex-end"} alignItems={"flex-end"}>
                  <Box>
                    <LoadingButton
                      type="submit"
                      size="large"
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={isLoading === "pending"}
                      loading={isLoading === "pending"}
                    >
                      <span>{textButton}</span>
                    </LoadingButton>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditRoomType;
