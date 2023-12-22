import { Link } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import * as React from "react";
import { toast } from "react-toastify";
import { appActions } from "~/features/app";
import { AuthAPI, forgotPasswordEmployee, forgotPasswordOwner } from "~/services/apis/auth";
import { useAppDispatch } from "~/stores";
import { ForgotPasswordPayload } from "~/types";
import { forgotPasswordSchema } from "../../schema/forgotPasswordSchema";

type DialogFormForgotPasswordProps = {
  isOwner: boolean;
  isResend?: boolean;
};

const DialogFormForgotPassword: React.FC<DialogFormForgotPasswordProps> = ({
  isOwner,
  isResend,
}) => {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleClickOpen = React.useCallback(() => setOpen(true), []);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    return () => {
      setError("");
      setSuccess("");
    };
  }, []);

  const handleClose = React.useCallback(() => setOpen(false), []);

  const onSubmit = React.useCallback(
    async (values: ForgotPasswordPayload, resetForm: () => void) => {
      try {
        setError("");
        setSuccess("");
        const url = !isOwner ? forgotPasswordEmployee : forgotPasswordOwner;
        handleClose();
        dispatch(appActions.openOverplay());
        await AuthAPI.forgotPassword(url, values);

        toast.success("Thực hiện thành công");
        setSuccess(
          `Đã gửi về địa chỉ email ${values.email}. Vui lòng kiểm tra để thay đổi mật khẩu`
        );
        resetForm();
      } catch (error: any) {
        let msg = "";

        if (error instanceof AxiosError) {
          msg = error?.response?.data?.message ?? error.message;
        } else {
          msg = error.message;
        }

        setError(msg);
        toast.error(msg);
      } finally {
        handleClickOpen();
        dispatch(appActions.closeOverplay());
      }
    },
    [isOwner]
  );

  const formik = useFormik({
    initialValues: { email: "", username: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { resetForm }) => onSubmit(values, resetForm),
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <div>
      <Link variant="subtitle2" underline="hover" onClick={handleClickOpen}>
        {isResend ? "Gửi lại" : "Bạn đã quên mật khẩu"}
      </Link>
      <FormikProvider value={formik}>
        <Dialog open={open} onClose={handleClose}>
          <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{isResend ? "Gửi lại mã giao dịch" : `Quên mật khẩu`}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Để {isResend ? `gửi lại mã` : `thay đổi mật khẩu`}. Vui lòng nhập địa chỉ email và
                tài khoản của bạn vào đây. Chúng tôi sẽ gửi thông tin thay đổi mật khẩu
              </DialogContentText>

              {error ? (
                <DialogContentText color={"error"} mt={2} fontStyle={"italic"}>
                  {error}
                </DialogContentText>
              ) : null}

              {success ? (
                <DialogContentText color={"green"} mt={2} fontStyle={"italic"}>
                  {success}
                </DialogContentText>
              ) : null}

              <TextField
                autoFocus
                margin="dense"
                label="Tài khoản"
                fullWidth
                variant="standard"
                tabIndex={0}
                {...getFieldProps("username")}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

              <TextField
                tabIndex={1}
                margin="dense"
                label="Địa chỉ email"
                fullWidth
                variant="standard"
                {...getFieldProps("email")}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={handleClose}>
                Hủy bỏ
              </Button>
              <Button type="submit">Xác nhận</Button>
            </DialogActions>
          </Form>
        </Dialog>
      </FormikProvider>
    </div>
  );
};

export default DialogFormForgotPassword;
