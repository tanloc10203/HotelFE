import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { ForPage } from "~/layouts";
import { Customer } from "~/types";
import { addEditCustomerSchema } from "../schema";

const { Grid, Card } = ForPage;

interface FormAddEditCustomerProps {
  initialValues: Customer;
  onSubmit?: (values: Customer) => void;
}

const FormAddEditCustomer = ({ onSubmit, initialValues }: FormAddEditCustomerProps) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: addEditCustomerSchema,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit?.(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item lg={7}>
            <Card title="Thông tin khách hàng">
              <Grid container spacing={2}>
                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Họ của khách hàng"
                    placeholder="Nhập họ của khách hàng"
                    {...getFieldProps("last_name")}
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Tên của khách hàng"
                    placeholder="Nhập tên của khách hàng"
                    {...getFieldProps("first_name")}
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại khách hàng"
                    placeholder="Nhập Số điện thoại của khách hàng"
                    {...getFieldProps("phone_number")}
                    error={touched.phone_number && Boolean(errors.phone_number)}
                    helperText={touched.phone_number && errors.phone_number}
                  />
                </Grid>

                <Grid item lg={6}>
                  <TextField
                    fullWidth
                    label="CCCD của khách hàng"
                    placeholder="Nhập CCCD của khách hàng"
                    {...getFieldProps("phone_number")}
                    error={touched.phone_number && Boolean(errors.phone_number)}
                    helperText={touched.phone_number && errors.phone_number}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item lg={5}>
            <Card title="Thông tin đăng nhập">
              <TextField
                fullWidth
                autoComplete="none"
                aria-autocomplete="none"
                label="Email khách hàng"
                placeholder="Nhập email khách hàng"
                {...getFieldProps("email")}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Mật khẩu khách hàng"
                placeholder="Nhập mật khẩu khách hàng"
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
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditCustomer;
