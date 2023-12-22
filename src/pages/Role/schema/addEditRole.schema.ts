import * as yup from "yup";

export const addEditRoleSchema = yup.object({
  name: yup.string().min(5, "Quá ngắn!").required("Tên vai trò là trường bắt buộc"),
  desc: yup.string().min(5, "Quá ngắn!").required("Mô tả vai trò là trường bắt buộc"),
});
