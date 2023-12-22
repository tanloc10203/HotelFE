import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IEquipmentType } from "~/types";
import { equipmentTypeSchema } from "../schema/equipmentTypeSchema";

interface FormAddEditEquipmentTypeProps {
  initialValues: IEquipmentType;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
}

const FormAddEditEquipmentType: FC<FormAddEditEquipmentTypeProps> = ({
  onSubmit,
  initialValues,
  textButton,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: equipmentTypeSchema,
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
          label="Tên loại thiết bị"
          placeholder="VD: Dụng cụ bàn ghế"
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
          label="Mô tả loại thiết bị"
          placeholder="VD: Những thiết bị dành cho phòng"
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

export default FormAddEditEquipmentType;
