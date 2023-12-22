import * as yup from "yup";

export const addEditDepartmentSchema = yup.object({
  name: yup.string().required("Tên chức vụ là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup.string().required("Mô tả chức vụ là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
});
