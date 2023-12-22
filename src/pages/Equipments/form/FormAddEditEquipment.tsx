import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  FormControl,
  TextField,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useSnackbar } from "~/features/app";
import { useEquipmentType } from "~/features/equipmentType";
import { IAmenityType, IEquipmentResponse } from "~/types";
import { equipmentSchema } from "../schema/equipmentSchema";
import { useEquipment } from "~/features/equipment";
import { SelectInput } from "~/components";

interface FormAddEditEquipmentProps {
  initialValues: IEquipmentResponse;
  onSubmit?: (...args: any[]) => void;
  textButton: string;
  loading?: boolean;
}

const FormAddEditEquipment: FC<FormAddEditEquipmentProps> = ({
  onSubmit,
  initialValues,
  textButton,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: equipmentSchema,
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      const { typeData, ...others } = values;
      onSubmit?.(others, resetForm);
    },
  });
  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
  const { data } = useEquipmentType();
  const [selected, setSelected] = useState<IAmenityType | null>(null);
  const { severity } = useSnackbar();
  const { groups } = useEquipment();

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
      await setFieldValue("equipment_type_id", value ? value.id : null);
    },
    []
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
        <TextField
          label="Tên thiết bị"
          placeholder="VD: Bàn trang điểm"
          fullWidth
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          margin="normal"
        />

        <FormControl
          fullWidth
          error={touched.equipment_type_id && Boolean(errors.equipment_type_id)}
          margin="normal"
        >
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
                helperText={touched.equipment_type_id && errors.equipment_type_id}
                error={touched.equipment_type_id && Boolean(errors.equipment_type_id)}
                fullWidth
                label="Loại thiết bị"
                placeholder="..."
              />
            )}
          />
        </FormControl>

        <SelectInput
          label="Mô tả thiết bị"
          placeholder="VD: Những thiết bị dành cho phòng"
          {...getFieldProps("group")}
          error={touched.group && Boolean(errors.group)}
          helperText={touched.group && errors.group}
          options={groups}
        />

        <TextField
          multiline
          rows={2}
          fullWidth
          label="Mô tả thiết bị"
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

export default FormAddEditEquipment;
