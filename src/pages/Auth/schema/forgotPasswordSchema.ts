import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Vui lòng nhập địa chỉ email hợp lệ")
    .required("Địa chỉ email là trường bắt buộc"),
  username: yup.string().required("Tài khoản là trường bắt buộc"),
});
