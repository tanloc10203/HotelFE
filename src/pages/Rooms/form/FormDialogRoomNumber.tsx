import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import { SelectInput } from "~/components";
import { IRoomNumber, StatusRoom } from "~/types";
import { roomNumberSchema } from "../schema/roomNumberSchema";
import { LoadingButton } from "@mui/lab";

type FormDialogRoomNumberProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (...args: any[]) => void;
  initialValues: IRoomNumber & { lastId: string };
};

const FormDialogRoomNumber: FC<FormDialogRoomNumberProps> = ({
  onSubmit,
  open,
  onClose,
  initialValues,
}) => {
  const options = useMemo(
    (): Record<"value" | "label", StatusRoom | string>[] => [
      { value: "available", label: "Có sẵn" },
      { value: "maintenance", label: "Bảo trì" },
      { value: "unavailable", label: "Không có sẵn" },
      { value: "cleanup", label: "Dọn dẹp" },
    ],
    []
  );

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: roomNumberSchema,
    onSubmit: (values, { resetForm, setErrors }) => {
      if (!onSubmit) return;
      onSubmit?.(values, resetForm, setErrors);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
          <DialogTitle>Thay đổi thông tin số phòng</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Số phòng"
              fullWidth
              {...getFieldProps("id")}
              error={touched.id && Boolean(errors.id)}
              helperText={touched.id && errors.id}
            />

            <TextField
              multiline
              rows={3}
              margin="normal"
              label="Ghi chú"
              fullWidth
              {...getFieldProps("note")}
              error={touched.note && Boolean(errors.note)}
              helperText={touched.note && errors.note}
            />

            <SelectInput
              label="Trạng thái"
              {...getFieldProps("status")}
              placeholder="Chọn trạng thái"
              error={touched.status && Boolean(errors.status)}
              helperText={touched.status && errors.status}
              options={options}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="error">
              Hủy bỏ
            </Button>
            <LoadingButton type="submit" variant="contained">
              Thay đổi
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </FormikProvider>
  );
};

export default FormDialogRoomNumber;
