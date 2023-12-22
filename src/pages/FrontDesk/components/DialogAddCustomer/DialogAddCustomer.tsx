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
import { BootstrapDialog, SelectInput, Transition } from "~/components";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { CustomerPayload } from "~/types";
import { customerSchema } from "../../schemas/customerSchema";

type DialogAddCustomerProps = {
  open: boolean;
  initialValues: CustomerPayload;
  onClose?: () => void;
  onSubmit?: (values: CustomerPayload, resetForm?: () => void) => void;
};

const DialogAddCustomer: FC<DialogAddCustomerProps> = ({
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [birthday, setBirthday] = useState<Dayjs | null>(null);

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
    validationSchema: customerSchema,
    enableReinitialize: true,
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

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
          Thêm khách hàng
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
              label="Họ và chữ lót"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("last_name")}
              error={touched.last_name && Boolean(errors.last_name)}
              helperText={touched.last_name && errors.last_name}
            />

            <TextField
              label="Tên khách hàng"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("first_name")}
              error={touched.first_name && Boolean(errors.first_name)}
              helperText={touched.first_name && errors.first_name}
            />

            <TextField
              label="Số điện thoại"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("phone_number")}
              error={touched.phone_number && Boolean(errors.phone_number)}
              helperText={touched.phone_number && errors.phone_number}
            />

            <TextField
              label="Địa chỉ"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("address")}
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
            />

            <TextField
              label="Email"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("email")}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
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

            <TextField
              multiline
              rows={2}
              label="Ghi chú"
              margin="dense"
              size="small"
              fullWidth
              {...getFieldProps("desc")}
              error={touched.desc && Boolean(errors.desc)}
              helperText={touched.desc && errors.desc}
            />
          </Form>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            autoFocus
            color="success"
            variant="contained"
            type="submit"
            onClick={handleSubmit as () => void}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </FormikProvider>
  );
};

export default DialogAddCustomer;
