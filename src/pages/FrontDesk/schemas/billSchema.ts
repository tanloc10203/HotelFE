import * as yup from "yup";

export const billSchema = (isPaid: boolean) =>
  yup.object({
    customerPay: isPaid
      ? yup.number()
      : yup.number().min(1, "Vui lòng nhập số tiền thanh toán").required("Bắt buộc"),
    totalQuantityOrdered: yup.number().notRequired(),
    customerRequirePay: yup.number().required("Bắt buộc"),
    discount: yup.number().notRequired(),
    totalCostRoom: yup.number().required("Bắt buộc"),
    totalCostService: yup.number().required("Bắt buộc"),
    deposit: yup.number().notRequired(),
    costLastCheckedIn: yup.number().notRequired(),
    costLastCheckedOut: yup.number().notRequired(),
    note: yup.string().notRequired(),
  });
