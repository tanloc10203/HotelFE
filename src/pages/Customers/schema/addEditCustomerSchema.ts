import * as yup from "yup";

export const addEditCustomerSchema = yup.object({
  first_name: yup.string().required("Tên khách hàng là trường bắt buộc"),
  last_name: yup.string().required("Họ khách hàng là trường bắt buộc"),
  phone_number: yup.string().required("Số điện thoại là trường bắt buộc"),
  email: yup
    .string()
    .email("Nhập địa chỉ email hợp lệ")
    .required("Email khách hàng là trường bắt buộc"),
  password: yup
    .string()
    .min(8, "Mật khẩu ít nhất 8 kí tự")
    .required("Mật khẩu khách hàng là trường bắt buộc"),
});
