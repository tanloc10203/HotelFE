import { DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { FC } from "react";
import { BootstrapDialog, Transition } from "~/components";
import CloseIcon from "@mui/icons-material/Close";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { LoadingButton } from "@mui/lab";
import { SupplierType } from "~/types";
import { Form, FormikProvider, useFormik } from "formik";
import { addSupplierSchema } from "../schemas/addSupplierSchema";

type DialogAddSupplierProps = {
  initialValues: SupplierType;
  open: boolean;
  loading?: boolean;
  onClose?: () => void;
  onSubmit?: (values: SupplierType, resetForm?: () => void) => void;
};

const DialogAddSupplier: FC<DialogAddSupplierProps> = ({
  open,
  loading,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit(values, formikHelpers) {
      if (!onSubmit) return;
      onSubmit(values, formikHelpers.resetForm);
    },
    validationSchema: addSupplierSchema,
    enableReinitialize: true,
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

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
          Thông tin nhà cung cấp
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
              disabled
              label="ID NCC"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("id")}
              error={touched.id && Boolean(errors.id)}
              helperText={touched.id && errors.id}
            />

            <TextField
              label="Tên NCC"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("name")}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              label="SĐT"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("phone_number")}
              error={touched.phone_number && Boolean(errors.phone_number)}
              helperText={touched.phone_number && errors.phone_number}
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

            <TextField
              label="Tên Công ty"
              size="small"
              fullWidth
              margin="dense"
              {...getFieldProps("company_name")}
              error={touched.company_name && Boolean(errors.company_name)}
              helperText={touched.company_name && errors.company_name}
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
              label="Ghi chú"
              size="small"
              fullWidth
              margin="dense"
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
            loading={loading}
            disabled={loading}
            onClick={handleSubmit as () => void}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </FormikProvider>
  );
};

export default DialogAddSupplier;
