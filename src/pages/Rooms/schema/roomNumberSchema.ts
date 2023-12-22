import * as yup from "yup";

export const roomNumberSchema = yup.object({
  id: yup.string().required("Mã phòng là trường bắt buộc"),
  note: yup.string().notRequired(),
  status: yup.string().required("Đây là trường bắt buộc"),
});
