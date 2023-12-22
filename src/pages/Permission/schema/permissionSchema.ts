import * as yup from "yup";

const ALIAS_REGEX = /^[^A-Z0-9]+\w+\.(add|edit|view|delete)$/;

export const permissionAddSchema = yup.object({
  name: yup.string().min(5, "Ít nhất 5 kí tự").required("Tên quyền là trường bắt buộc"),
  alias: yup
    .string()
    .matches(
      ALIAS_REGEX,
      "Không đúng định dạng. Định danh có dạng chữ viết thường nối liền với dấu chấm cuối cùng là add hoặc view hoặc delete hoặc edit. VD: product.add"
    )
    .min(3, "Ít nhất 3 kí tự")
    .required("Định danh quyền không được để trống."),
  desc: yup.string().required("Không được bỏ trống mô tả quyền"),
});
