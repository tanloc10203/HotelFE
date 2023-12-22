import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IPermission } from "~/types";
import { permissionAddSchema } from "../schema/permissionSchema";

interface FormAddEditPermissionProps {
  initialValues: Partial<IPermission>;
  onSubmit?: (...args: any[]) => void;
}

const FormAddEditPermission: FC<FormAddEditPermissionProps> = ({ onSubmit, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: permissionAddSchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm);
    },
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <TextField
          label="Tên quyền"
          placeholder="VD: ProductAdd"
          fullWidth
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Định danh tên quyền"
          placeholder="VD: product.add"
          {...getFieldProps("alias")}
          error={touched.alias && Boolean(errors.alias)}
          helperText={
            (touched.alias && errors.alias) ||
            "Định danh có dạng chữ viết thường nối liền với dấu chấm cuối cùng là add hoặc view hoặc delete hoặc edit. VD: product.add"
          }
          margin="normal"
        />

        <TextField
          fullWidth
          label="Mô tả tên quyền"
          placeholder="VD: Thêm sản phẩm"
          {...getFieldProps("desc")}
          error={touched.desc && Boolean(errors.desc)}
          helperText={touched.desc && errors.desc}
          margin="normal"
        />

        <LoadingButton type="submit" size="large" variant="contained" sx={{ mt: 2 }} fullWidth>
          <span>Lưu</span>
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditPermission;
