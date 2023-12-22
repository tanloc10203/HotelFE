import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  FormControl,
  TextField,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, SyntheticEvent, useCallback, useState, useEffect } from "react";
import { useAmenityType } from "~/features/amenityType";
import { IAmenityResponse, IAmenityType } from "~/types";
import { amenitySchema } from "../schema/amenitySchema";
import { useSnackbar } from "~/features/app";

interface FormAddEditAmenityProps {
  initialValues: IAmenityResponse;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
}

const FormAddEditAmenity: FC<FormAddEditAmenityProps> = ({
  onSubmit,
  initialValues,
  textButton,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: amenitySchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      const { typeData, ...others } = values;
      onSubmit?.(others, resetForm);
    },
  });
  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
  const { data } = useAmenityType();
  const [selected, setSelected] = useState<IAmenityType | null>(null);
  const { severity } = useSnackbar();

  useEffect(() => {
    if (!initialValues.id) return;
    setSelected(initialValues.typeData);
  }, [initialValues]);

  useEffect(() => {
    if (severity === "success") {
      setSelected(null);
    }
  }, [severity]);

  const handleChange = useCallback(
    async (
      _: SyntheticEvent,
      value: IAmenityType | null,
      _reason: AutocompleteChangeReason,
      _details?: AutocompleteChangeDetails<IAmenityType>
    ) => {
      setSelected(value);
      await setFieldValue("type_id", value ? value.id : null);
    },
    []
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <TextField
          label="Tên tiện nghi"
          placeholder="VD: Tiện nghi phòng"
          fullWidth
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          margin="normal"
        />

        <FormControl fullWidth error={touched.type_id && Boolean(errors.type_id)} margin="normal">
          <Autocomplete
            disablePortal
            options={data}
            fullWidth
            value={selected}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            size={"medium"}
            onChange={handleChange}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={touched.type_id && errors.type_id}
                error={touched.type_id && Boolean(errors.type_id)}
                fullWidth
                label="Loại tiện nghi"
                placeholder="..."
              />
            )}
          />
        </FormControl>

        <TextField
          multiline
          rows={2}
          fullWidth
          label="Mô tả tiện nghi"
          placeholder="VD: Những tiện nghi dành cho phòng"
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

export default FormAddEditAmenity;
