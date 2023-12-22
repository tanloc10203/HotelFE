import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

interface Values {
  email: string;
  password: string;
}

interface FormAddEditCustomerTypeProps {
  initialValues: Values;
  onSubmit?: (values: any) => void;
}

const FormAddEditCustomerType = ({ onSubmit, initialValues }: FormAddEditCustomerTypeProps) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit?.(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          {...getFieldProps("email")}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          margin="normal"
        />
        <TextField
          fullWidth
          {...getFieldProps("password")}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
          margin="normal"
        />

        <LoadingButton
          type="submit"
          size="large"
          loading={false}
          variant="contained"
          sx={{ mt: 2 }}
          fullWidth
        >
          <span>Lưu</span>
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditCustomerType;
