import * as yup from "yup";
import { fCurrency } from "~/utils";

export const changePriceSchema = (maxPrice: number) => {
  return yup.object({
    num_discount: yup.number().required("Đây là trường bắt buộc").max(255, "Nhiều nhất 255 kí tự"),
    price_discount: yup
      .number()
      .positive("Không được nhỏ hơn 0")
      .min(10000, "Nhỏ nhât 10.000 VNĐ")
      .max(maxPrice, `Giảm giá phải nhỏ hơn giá gốc \`${fCurrency(maxPrice)}\``),
    percent_discount: yup
      .number()
      .positive("Không được nhỏ hơn 0")
      .min(0, "Nhỏ nhât 0%")
      .max(100, "Lớn nhất 100%"),
    time_start: yup.string().required("Thời gian bắt đầu là trường bắt buộc."),
    time_end: yup.string().required("Thời gian bắt đầu là trường bắt buộc."),
    type: yup.string().required("Loại giảm giá là trường bắt buộc."),
    is_public: yup.boolean().required("Thời gian kết thúc là trường bắt buộc."),
  });
};
