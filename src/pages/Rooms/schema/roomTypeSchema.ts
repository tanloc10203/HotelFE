import * as yup from "yup";

export const roomTypeSchema = yup.object({
  name: yup.string().required("Tên loại phòng là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup
    .string()
    .required("Mô tả loại phòng là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
  character: yup
    .string()
    .required("Kí tự loại phòng là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
  equipments: yup
    .array()
    .required("Thiết bị là trường bắt buộc")
    .of(
      yup.object({
        id: yup.number().required("id là trường bắt buộc"),
      })
    ),
  amenities: yup
    .array()
    .required("Tiện nghi là trường bắt buộc")
    .of(
      yup.object({
        id: yup.number().required("id là trường bắt buộc"),
      })
    ),
  images: yup.mixed().required("Ảnh là trường bắt buộc"),
});
