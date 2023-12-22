import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { AppbarDialog, BootstrapDialog, Transition } from "~/components";
import { InformationHotelState } from "~/types";
import { informationHotelSchema } from "../../schemas/customerSchema";
import { DialogActions, DialogContent, Grid, TextField } from "@mui/material";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { LoadingButton } from "@mui/lab";

type AddEditInformationHotelProps = {
  initialValues: InformationHotelState;
  open: boolean;
  loading?: boolean;
  onClose?: () => void;
  onSubmit?: (values: InformationHotelState, resetForm: () => void) => void;
};

const AddEditInformationHotel: FC<AddEditInformationHotelProps> = ({
  initialValues,
  open,
  loading,
  onClose,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit(values, formikHelpers) {
      if (!onSubmit) return;
      onSubmit(values, formikHelpers.resetForm);
    },
    validationSchema: informationHotelSchema,
    enableReinitialize: true,
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <BootstrapDialog
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        open={open}
        onClose={onClose}
      >
        <AppbarDialog title="Thông tin khách sạn" onClose={onClose} />

        <DialogContent dividers sx={SCROLLBAR_CUSTOM}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item lg={6}>
                <TextField
                  label="Tên khách sạn"
                  size="medium"
                  fullWidth
                  {...getFieldProps("name")}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              <Grid item lg={6}>
                <TextField
                  label="Số điện thoại"
                  size="medium"
                  fullWidth
                  {...getFieldProps("phone_number")}
                  error={touched.phone_number && Boolean(errors.phone_number)}
                  helperText={touched.phone_number && errors.phone_number}
                />
              </Grid>

              <Grid item lg={6}>
                <TextField
                  label="Email"
                  size="medium"
                  fullWidth
                  {...getFieldProps("email")}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>

              <Grid item lg={6}>
                <TextField
                  label="Địa chỉ"
                  size="medium"
                  fullWidth
                  {...getFieldProps("address")}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  multiline
                  rows={2}
                  label="Giới thiệu"
                  size="medium"
                  fullWidth
                  {...getFieldProps("description")}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>
            </Grid>
          </Form>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            autoFocus
            color="success"
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ px: 10, py: 1 }}
            onClick={handleSubmit as () => void}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </FormikProvider>
  );
};

export default AddEditInformationHotel;
