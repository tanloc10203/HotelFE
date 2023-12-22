import * as yup from "yup";

export const floorSchema = yup.object({
  name: yup.string().required("Tên tầng là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup.string().required("Mô tả tầng là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  character: yup.string().required("Kí tự tầng là trường bắt buộc"),
});
