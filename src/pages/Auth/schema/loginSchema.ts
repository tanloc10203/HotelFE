import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup.string().required("Tài khoản là trường bắt buộc"),
  password: yup
    .string()
    .min(5, "Mật khẩu ít nhất 5 kí tự")
    .max(32, "Mật khẩu nhiều nhất 32 kí tự")
    .required("Mật khẩu là trường bắt buộc"),
});
