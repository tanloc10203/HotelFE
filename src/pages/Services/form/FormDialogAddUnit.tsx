import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { useUnits } from "~/contexts/UnitContext";
import { appActions } from "~/features/app";
import { messageErrorAxios } from "~/helpers";
import { useAppDispatch } from "~/stores";
import { IUnit } from "~/types";
import { unitAddSchema } from "../schema/serviceTypesSchema";

type FormDialogAddUnitProps = {
  initialValues: IUnit;
  open: boolean;
  onClose?: () => void;
};

const FormDialogAddUnit: FC<FormDialogAddUnitProps> = ({ onClose, open, initialValues }) => {
  const { addUnit, error, loading } = useUnits();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: unitAddSchema,
    async onSubmit(values, formikHelpers) {
      try {
        await addUnit(values);
        formikHelpers.resetForm();

        dispatch(
          appActions.setSnackbar({
            open: true,
            severity: "success",
            text: "Thêm đơn vị thành công",
          })
        );
        onClose?.();
      } catch (error) {
        formikHelpers.setErrors({ name: messageErrorAxios(error) });
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
          <DialogTitle>Thêm đơn vị mới</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Tên đơn vị tính"
              fullWidth
              variant="standard"
              {...getFieldProps("name")}
              error={(touched.name && Boolean(errors.name)) || Boolean(error)}
              helperText={(touched.name && errors.name) || error}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Hủy bỏ
            </Button>
            <LoadingButton
              disabled={loading === "pending"}
              loading={loading === "pending"}
              type="submit"
              variant="contained"
            >
              Thêm mới
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </FormikProvider>
  );
};

export default FormDialogAddUnit;
