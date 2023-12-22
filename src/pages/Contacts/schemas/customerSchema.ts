import * as yup from "yup";

export const PHONE_REGEX = /((0[1|2|3|4|5|6|7|8|9])+([0-9]{8})\b)/g;

export const informationHotelSchema = yup.object({
  name: yup.string().required("Tên khách sạn là trường bắt buộc"),
  email: yup.string().email("Vui lòng nhập email hợp lệ").required("Email là trường bắt buộc"),
  phone_number: yup
    .string()
    .matches(PHONE_REGEX, "Số điện thoại không hợp lệ.")
    .required("Số điện thoại là trường bắt buộc"),
  address: yup.string().required("Địa chỉ khách sạn là trường bắt buộc"),
  description: yup.string().notRequired(),
  long: yup.string().notRequired(),
  lat: yup.string().notRequired(),
});
