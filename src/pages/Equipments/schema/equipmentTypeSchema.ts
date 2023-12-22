import * as yup from "yup";

export const equipmentTypeSchema = yup.object({
  name: yup
    .string()
    .required("Tên loại thiết bị là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
  desc: yup
    .string()
    .required("Mô tả loại thiết bị là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
});
