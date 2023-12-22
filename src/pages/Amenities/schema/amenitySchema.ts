import * as yup from "yup";

export const amenitySchema = yup.object({
  name: yup.string().required("Tên tiện nghi là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup
    .string()
    .required("Mô tả tiện nghi là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
  type_id: yup.string().required("Loại tiện nghi là trường bắt buộc"),
});
