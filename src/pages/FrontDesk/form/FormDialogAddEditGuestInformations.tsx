import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useLayoutEffect, useState } from "react";
import { countries } from "~/_mock/country";
import { BootstrapDialog, SelectInput, Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { CountryType, IGuestStayInformation } from "~/types";
import { guestInformationsSchema } from "../schemas/GuestInformationSchema";
import CountrySelect from "./CountrySelect";

type FormDialogAddEditGuestInformationsProps = {
  open: boolean;
  initialValues: IGuestStayInformation;
  onClose?: () => void;
  onSubmit?: (values: IGuestStayInformation, resetForm?: () => void) => void;
  disabled?: boolean;
};

const FormDialogAddEditGuestInformations: FC<FormDialogAddEditGuestInformationsProps> = ({
  open,
  initialValues,
  disabled,
  onClose,
  onSubmit,
}) => {
  const [country, setCountry] = useState<CountryType | null>({
    code: "VN",
    label: "Vietnam",
    phone: "84",
  });
  const [birthday, setBirthday] = useState<Dayjs | null>(null);

  useLayoutEffect(() => {
    if (!initialValues.nationality) return;
    const _country = countries.find((c) => c.label === initialValues.nationality);
    if (!_country) return;
    setCountry(_country);
  }, [initialValues, countries]);

  useLayoutEffect(() => {
    if (!initialValues.birthday) return;
    setBirthday(dayjs(new Date(initialValues.birthday)));
  }, [initialValues]);

  const formik = useFormik({
    initialValues,
    onSubmit(values, formikHelpers) {
      if (!onSubmit) return;
      onSubmit(
        {
          ...values,
          birthday: !values.birthday || !birthday ? null : birthday.format("YYYY-MM-DD"),
        },
        formikHelpers.resetForm
      );
    },
    validationSchema: guestInformationsSchema,
    enableReinitialize: true,
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleChangeIdentificationType = useCallback(async (event: SelectChangeEvent<unknown>) => {
    await setFieldValue("identification_type", event.target.value);
  }, []);

  const handleChangeCountry = useCallback(async (_: any, value: CountryType | null) => {
    setCountry(value);
    await setFieldValue("nationality", value ? value.label : "");
  }, []);

  const handleChangeGender = useCallback(async (event: SelectChangeEvent<unknown>) => {
    await setFieldValue("gender", event.target.value);
  }, []);

  const handleChangeBirthDate = useCallback(async (date: Dayjs | null) => {
    setBirthday(date);
    await setFieldValue("birthday", date ? date.format("YYYY-MM-DD") : "");
  }, []);

  return (
    <FormikProvider value={formik}>
      <BootstrapDialog
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        open={open}
        onClose={onClose}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Thông tin khách lưu trú
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers sx={SCROLLBAR_CUSTOM}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <TextField
              label="Phòng"
              size="small"
              fullWidth
              margin="dense"
              disabled
              {...getFieldProps("room_number")}
            />

            <TextField
              label="Họ và tên"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("full_name")}
              error={touched.full_name && Boolean(errors.full_name)}
              helperText={touched.full_name && errors.full_name}
            />

            <SelectInput
              options={[
                { label: "Nam", value: "MALE" },
                { label: "Nữ", value: "FEMALE" },
                { label: "Khác", value: "OTHERS" },
              ]}
              label="Giới tính"
              margin="dense"
              size="small"
              {...getFieldProps("gender")}
              onChange={handleChangeGender}
              value={values.gender}
              error={touched.gender && Boolean(errors.gender)}
              helperText={touched.gender && errors.gender}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateField"]}>
                <DateField
                  value={birthday}
                  onChange={handleChangeBirthDate}
                  label="Ngày sinh"
                  size="small"
                  fullWidth
                  format="DD/MM/YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>

            <CountrySelect value={country} onChange={handleChangeCountry} />

            <SelectInput
              options={[
                { label: "Căn cước công dân", value: "cccd" },
                { label: "Hộ chiếu", value: "passport" },
                { label: "Chức minh nhân dân", value: "cmnd" },
                { label: "Cavet xe", value: "cavet_xe" },
                { label: "Khác", value: "others" },
              ]}
              label="Loại giấy tờ"
              margin="dense"
              size="small"
              {...getFieldProps("identification_type")}
              onChange={handleChangeIdentificationType}
              value={values.identification_type}
              error={touched.identification_type && Boolean(errors.identification_type)}
              helperText={touched.identification_type && errors.identification_type}
            />

            <TextField
              label="Số giấy tờ"
              margin="dense"
              size="small"
              fullWidth
              {...getFieldProps("identification_value")}
              error={touched.identification_value && Boolean(errors.identification_value)}
              helperText={touched.identification_value && errors.identification_value}
            />

            <TextField
              multiline
              rows={2}
              label="Ghi chú"
              margin="dense"
              size="small"
              fullWidth
              {...getFieldProps("note")}
              error={touched.note && Boolean(errors.note)}
              helperText={touched.note && errors.note}
            />
          </Form>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            autoFocus
            color="success"
            variant="contained"
            type="submit"
            disabled={disabled}
            onClick={handleSubmit as () => void}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </FormikProvider>
  );
};

export default FormDialogAddEditGuestInformations;
