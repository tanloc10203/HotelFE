import * as yup from "yup";

export const PHONE_REGEX = /((0[1|2|3|4|5|6|7|8|9])+([0-9]{8})\b)/g;

export const customerSchema = yup.object({
  first_name: yup.string().required("Tên khách hàng là trường bắt buộc"),
  last_name: yup.string().required("Họ và chữ lót là trường bắt buộc"),
  phone_number: yup
    .string()
    .matches(PHONE_REGEX, "Số điện thoại không hợp lệ.")
    .required("Số điện thoại là trường bắt buộc"),
  email: yup.string().email("Nhập địa chỉ email hợp lệ").notRequired(),
  gender: yup.string().notRequired(),
  birthday: yup.string().notRequired(),
  address: yup.string().notRequired(),
  desc: yup.string().notRequired(),
});
