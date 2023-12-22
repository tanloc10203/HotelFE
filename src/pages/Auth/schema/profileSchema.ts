import * as yup from "yup";

export const profileSchema = yup.object({
  first_name: yup
    .string()
    .min(2, "It nhất 2 kí tự")
    .max(50, "Nhiều nhất 50 kí tự")
    .required("Tên là trường bắt buộc"),
  last_name: yup
    .string()
    .min(2, "It nhất 2 kí tự")
    .max(50, "Nhiều nhất 50 kí tự")
    .required("Họ và chữ lót là trường bắt buộc"),
  address: yup.string().min(5, "It nhất 6 kí tự"),
  birth_date: yup.string(),
  gender: yup.string(),
  phone_number: yup.string(),
});
