import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { Transition } from "~/components";
import { IFloor } from "~/types";
import { floorSchema } from "../schema/floorSchema";

type FormDialogAddFloorProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: IFloor, resetForm: () => void) => void;
  initialValues: IFloor;
};

const FormDialogAddFloor: FC<FormDialogAddFloorProps> = ({
  onSubmit,
  open,
  onClose,
  initialValues,
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
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        TransitionComponent={Transition}
        onClose={onClose}
      >
        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
          <DialogTitle>Thêm vị trí phòng</DialogTitle>

          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="error">
              Hủy bỏ
            </Button>
            <LoadingButton type="submit" variant="contained">
              Thêm mới
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </FormikProvider>
  );
};

export default FormDialogAddFloor;
