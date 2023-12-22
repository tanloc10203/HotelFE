import * as yup from "yup";

export const equipmentSchema = yup.object({
  name: yup.string().required("Tên thiết bị là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup.string().required("Mô tả thiết bị là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  group: yup.string().required("Nhóm thiết bị là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  equipment_type_id: yup.string().required("Loại thiết bị là trường bắt buộc"),
});
