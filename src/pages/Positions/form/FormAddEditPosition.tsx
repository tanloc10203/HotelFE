import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IPosition } from "~/types";
import { addEditPositionSchema } from "../schema";

interface FormAddEditPositionProps {
  initialValues: IPosition;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
}

const FormAddEditPosition: FC<FormAddEditPositionProps> = ({
  onSubmit,
  initialValues,
  textButton,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: addEditPositionSchema,
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
          label="Tên chức vụ"
          placeholder="VD: Trưởng phòng lễ tân"
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
          label="Mô tả chức vụ"
          placeholder="VD: Quản lý nhân viên lễ tân"
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

export default FormAddEditPosition;
