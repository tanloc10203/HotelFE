import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IFloor } from "~/types";
import { floorSchema } from "../schema/floorSchema";

interface FormAddEditFloorProps {
  initialValues: IFloor;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
}

const FormAddEditFloor: FC<FormAddEditFloorProps> = ({
  onSubmit,
  initialValues,
  textButton,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: floorSchema,
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
          label="Tên tầng"
          placeholder="VD: Tầng 1"
          fullWidth
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          margin="normal"
        />

        <TextField
          type="number"
          fullWidth
          label="Kí tự"
          placeholder="VD: 1"
          {...getFieldProps("character")}
          error={touched.character && Boolean(errors.character)}
          helperText={(touched.character && errors.character) || "Kí tự là số"}
          margin="normal"
        />

        <TextField
          multiline
          rows={2}
          fullWidth
          label="Mô tả tầng"
          placeholder="VD: Tầng 1 dành cho những phòng bình thường"
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

export default FormAddEditFloor;
