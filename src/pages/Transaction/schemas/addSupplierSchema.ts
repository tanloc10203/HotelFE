import * as yup from "yup";
import { PHONE_REGEX } from "~/pages/Employees/schema";

export const addSupplierSchema = yup.object({
  name: yup
    .string()
    .max(255, "Nhiều nhất 255 kí tự")
    .required("Tên nhà cung cấp là trường bắt buộc"),
  phone_number: yup
    .string()
    .matches(PHONE_REGEX, "Số điện thoại không hợp lệ.")
    .required("Số điện thoại là trường bắt buộc"),
  note: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
  address: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
  email: yup
    .string()
    .email("Vui lòng nhập email hợp lệ")
    .max(255, "Nhiều nhất 255 kí tự")
    .notRequired(),
  company_name: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
  code_tax: yup.string().max(255, "Nhiều nhất 255 kí tự").notRequired(),
});
