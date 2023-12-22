import * as yup from "yup";

export const changePasswordSchema = yup.object({
  password: yup
    .string()
    .min(5, "Mật khẩu ít nhất 5 kí tự")
    .max(32, "Mật khẩu nhiều nhất 32 kí tự")
    .required("Mật khẩu là trường bắt buộc"),
  newPassword: yup
    .string()
    .min(5, "Mật khẩu ít nhất 5 kí tự")
    .max(32, "Mật khẩu nhiều nhất 32 kí tự")
    .required("Mật khẩu là trường bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "Mật khẩu nhập lại không giống.")
    .required("Vui lòng nhập lại mật khẩu"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(5, "Mật khẩu ít nhất 5 kí tự")
    .max(32, "Mật khẩu nhiều nhất 32 kí tự")
    .required("Mật khẩu là trường bắt buộc"),
});
