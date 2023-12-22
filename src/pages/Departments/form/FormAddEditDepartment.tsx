import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IDepartment } from "~/types";
import { addEditDepartmentSchema } from "../schema";

interface FormAddEditDepartmentProps {
  initialValues: IDepartment;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
}

const FormAddEditDepartment: FC<FormAddEditDepartmentProps> = ({
  onSubmit,
  initialValues,
  textButton,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: addEditDepartmentSchema,
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
          label="Tên bộ phận"
          placeholder="VD: Bộ phận lễ tân"
          fullWidth
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          margin="normal"
        />

        <TextField
          multiline
          rows={2}
          fullWidth
          label="Mô tả bộ phận"
          placeholder="VD: Giao tiếp và giải đáp thắc mắc của khách hàng"
          {...getFieldProps("desc")}
          error={touched.desc && Boolean(errors.desc)}
          helperText={touched.desc && errors.desc}
          margin="normal"
        />

        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          sx={{ mt: 2 }}
          fullWidth
          disabled={loading}
          loading={loading}
        >
          <span>{textButton}</span>
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
};

export default FormAddEditDepartment;
