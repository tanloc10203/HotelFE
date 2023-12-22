import { LoadingButton } from "@mui/lab";
import { Box, Grid, Stack, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { useApp } from "~/contexts/AppContext";
import { UserState } from "~/types";
import { profileSchema } from "../../schema";

type GeneraFormProps = {
  initialValues: UserState;
  onSubmit?: (values: UserState, ...args: any) => void;
};

const GeneraForm: FC<GeneraFormProps> = ({ initialValues, onSubmit }) => {
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

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Stack mt={5} px={{ xs: 2, md: 5 }} justifyContent={"flex-start"} alignItems={"end"}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Nhập chính xác tài khoản của bạn..."
                {...getFieldProps("email")}
                disabled
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Tài khoản"
                disabled
                placeholder="Nhập chính xác tài khoản của bạn..."
                {...getFieldProps("username")}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                margin="normal"
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

export default GeneraForm;
