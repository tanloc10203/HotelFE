import * as yup from "yup";

export const serviceTypesSchema = yup.object({
  name: yup
    .string()
    .required("Tên loại dịch vụ là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
  desc: yup.string().notRequired().max(255, "Nhiều nhất 255 kí tự"),
});

export const serviceSchema = yup.object({
  name: yup.string().required("Tên dịch vụ là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup.string().notRequired().max(255, "Nhiều nhất 255 kí tự"),
  note: yup.string().notRequired().max(255, "Nhiều nhất 255 kí tự"),
  service_type_id: yup.string().required("Vui lòng chọn loại dịch vụ"),
  timer: yup.number().min(0, "Không được nhỏ hơn 0").notRequired(),
  price_original: yup.number().min(0, "Không được nhỏ hơn 0").notRequired(),
  price_sell: yup.number().min(0, "Không được nhỏ hơn 0").required("Vui lòng nhật giá bán"),
  units: yup.array().required("Đây là trường bắt buộc"),
  photo_public: yup.mixed().notRequired(),
});

export const unitAddSchema = yup.object({
  name: yup
    .string()
    .required("Tên đơn vị tính là trường bắt buộc")
    .max(255, "Nhiều nhất 255 kí tự"),
});

export const serviceProductSchema = yup.object().shape({
  name: yup.string().required("Tên hàng hóa là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
  desc: yup.string().notRequired().max(255, "Nhiều nhất 255 kí tự"),
  note: yup.string().notRequired().max(255, "Nhiều nhất 255 kí tự"),
  service_type_id: yup.string().required("Vui lòng chọn loại dịch vụ"),
  price_original: yup.number().min(0, "Không được nhỏ hơn 0").required("Vui lòng nhập giá vốn"),
  price_sell: yup.number().min(0, "Không được nhỏ hơn 0").required("Vui lòng nhật giá bán"),
  quantity: yup.number().min(0, "Không được nhỏ hơn 0").notRequired(),
  min_quantity_product: yup.number().min(5, "Số lượng tối thiểu nhỏ nhất là 5").notRequired(),
  photo_public: yup.mixed().notRequired(),
  attributes: yup.array().notRequired(),
  units: yup.array().required("Đây là trường bắt buộc"),
});
