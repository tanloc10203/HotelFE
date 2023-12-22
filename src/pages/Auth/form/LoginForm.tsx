import { LoadingButton } from "@mui/lab";
import { Checkbox, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useState } from "react";
import { Iconify } from "~/components/ui/iconify";
import { useApp } from "~/contexts/AppContext";
import { LoginPayload } from "~/types";
import { loginSchema } from "../schema";
import DialogFormForgotPassword from "./DialogFormForgotPassword/DialogFormForgotPassword";

type LoginFormProps = {
  initialValues: LoginPayload;
  onSubmit?: (values: LoginPayload) => void;
  isOwner: boolean;
};

const LoginForm: FC<LoginFormProps> = ({ initialValues, onSubmit, isOwner }) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit?.(values);
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
            label="Tài khoản"
            placeholder="Nhập chính xác tài khoản của bạn..."
            {...getFieldProps("username")}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập chính xác mật khẩu của bạn..."
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
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Checkbox name="remember" placeholder="Remember me" color="secondary" />
          <DialogFormForgotPassword isOwner={isOwner} />
        </Stack>

        <LoadingButton
          loading={loading}
          disabled={loading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Đăng nhập
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default LoginForm;
