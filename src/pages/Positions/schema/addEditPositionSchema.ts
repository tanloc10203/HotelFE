import * as yup from "yup";

export const addEditPositionSchema = yup.object({
  name: yup.string().required("Tên chức vụ là trường bắt buộc").min(3, "Ít nhất 3 kí tự. VD: CEO"),
  desc: yup.string().required("Mô tả chức vụ là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
});
