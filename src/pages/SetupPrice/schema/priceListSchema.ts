import * as yup from "yup";

export const priceListSchema = yup.object({
  name: yup.string().required("Đây là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  description: yup.string().notRequired(),
  start_time: yup.string().required("Đây là trường bắt buộc"),
  end_time: yup.string().required("Thời gian bắt đầu là trường bắt buộc."),
  is_public: yup.boolean().notRequired(),
  is_default: yup.boolean().notRequired(),
  roomTypes: yup.mixed().required(),
});
