import { LoadingButton } from "@mui/lab";
import { Box, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useState } from "react";
import { Iconify } from "~/components/ui/iconify";
import { useApp } from "~/contexts/AppContext";
import { ChangePasswordPayload } from "~/types";
import { resetPasswordSchema } from "../../schema";

type FormResetPasswordProps = {
  initialValues: Pick<ChangePasswordPayload, "password">;
  onSubmit?: (values: Pick<ChangePasswordPayload, "password">, ...args: any) => void;
};

const FormResetPassword: FC<FormResetPasswordProps> = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });

  const { openOverlay: loading } = useApp();

  const [showPassword, setShowPassword] = useState(false);

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu của bạn..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...getFieldProps("password")}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />

          <Box sx={{ my: 2 }} />

          <LoadingButton
            loading={loading}
            disabled={loading}
            // fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Thay đổi
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default FormResetPassword;
