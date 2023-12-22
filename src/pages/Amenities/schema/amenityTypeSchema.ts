import * as yup from "yup";

export const amenityTypeSchema = yup.object({
  name: yup.string().required("Tên tiện nghi là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup
    .string()
    .required("Mô tả tiện nghi là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
});
