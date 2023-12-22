import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IServiceType } from "~/types";
import { serviceTypesSchema } from "../schema/serviceTypesSchema";

interface FormAddEditServiceTypesProps {
  initialValues: IServiceType;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
}

const FormAddEditServiceTypes: FC<FormAddEditServiceTypesProps> = ({
  onSubmit,
  initialValues,
  textButton,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: serviceTypesSchema,
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
          label="Tên loại dịch vụ"
          placeholder="VD: loại dịch vụ 1"
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
          label="Mô tả loại dịch vụ"
          placeholder="VD: loại dịch vụ 1"
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

export default FormAddEditServiceTypes;
