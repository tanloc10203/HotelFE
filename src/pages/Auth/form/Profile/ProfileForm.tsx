import { LoadingButton } from "@mui/lab";
import { Box, Grid, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback } from "react";
import { BasicDatePicker, RadioInput } from "~/components";
import { useApp } from "~/contexts/AppContext";
import { UserState } from "~/types";
import { profileSchema } from "../../schema";

type ProfileFormProps = {
  initialValues: UserState;
  onSubmit?: (values: UserState, ...args: any) => void;
};

const dataRadio = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHERS" },
];

const ProfileForm: FC<ProfileFormProps> = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const { openOverlay: loading } = useApp();

  const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Stack mt={5} px={{ xs: 2, md: 5 }} justifyContent={"flex-start"} alignItems={"end"}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Họ và chữ lót"
                placeholder="Nhập họ và chữ lót của bạn..."
                {...getFieldProps("last_name")}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Tên"
                placeholder="Nhập tên của bạn..."
                {...getFieldProps("first_name")}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                placeholder="Nhập số điện thoại của bạn..."
                {...getFieldProps("phone_number")}
                error={touched.phone_number && Boolean(errors.phone_number)}
                helperText={touched.phone_number && errors.phone_number}
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                placeholder="Nhập địa chỉ của bạn..."
                {...getFieldProps("address")}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <RadioInput
                label="Giới tính"
                {...getFieldProps("gender")}
                data={dataRadio}
                error={touched.gender && Boolean(errors.gender)}
                helperText={touched.gender && errors.gender}
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <BasicDatePicker
                label="Ngày sinh"
                value={values.birth_date as any}
                onChange={useCallback(async (newValue: any) => {
                  const date = dayjs(newValue).format("YYYY-MM-DD");
                  await setFieldValue("birth_date", date);
                }, [])}
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả ngắn về bản thân"
                placeholder="Bạn có thể giới thiệu về bản thân..."
                {...getFieldProps("desc")}
                error={touched.desc && Boolean(errors.desc)}
                helperText={touched.desc && errors.desc}
              />
            </Grid>
          </Grid>
          <Box>
            <LoadingButton
              loading={loading}
              disabled={loading}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mt: 5 }}
            >
              Lưu thay đổi
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default ProfileForm;
