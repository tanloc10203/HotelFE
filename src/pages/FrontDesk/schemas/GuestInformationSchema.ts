import * as yup from "yup";
import { IdentificationLengthCodes } from "~/constants/common";

const { CCCD, CMND, PASSPORT, CAVET_XE, OTHERS } = IdentificationLengthCodes;

export const guestInformationsSchema = yup.object({
  full_name: yup.string().required("Họ và tên là trường bắt buộc"),
  nationality: yup.string().required("Quốc tịch là trường bắt buộc"),
  identification_type: yup.string().required("Loại giấy tờ là trường bắt buộc"),
  identification_value: yup
    .string()
    .when("identification_type", {
      is: "cccd",
      then: (schema) =>
        schema.min(CCCD, `Bắt buộc phải ${CCCD} kí tự`).max(CCCD, `Bắt buộc phải ${CCCD} kí tự`),
    })
    .when("identification_type", {
      is: "passport",
      then: (schema) =>
        schema
          .min(PASSPORT, `Bắt buộc phải ${PASSPORT} kí tự`)
          .max(PASSPORT, `Bắt buộc phải ${PASSPORT} kí tự`),
    })
    .when("identification_type", {
      is: "cmnd",
      then: (schema) =>
        schema.min(CMND, `Bắt buộc phải ${CMND} kí tự`).max(CMND, `Bắt buộc phải ${CMND} kí tự`),
    })
    .when("identification_type", {
      is: "cavet_xe",
      then: (schema) =>
        schema
          .min(CAVET_XE, `Bắt buộc phải ${CAVET_XE} kí tự`)
          .max(CAVET_XE, `Bắt buộc phải ${CAVET_XE} kí tự`),
    })
    .when("identification_type", {
      is: "others",
      then: (schema) =>
        schema
          .min(OTHERS, `Bắt buộc phải ${OTHERS} kí tự`)
          .max(OTHERS, `Bắt buộc phải ${OTHERS} kí tự`),
    })
    .required("Số giấy tờ là trường bắt buộc"),
  gender: yup.string().notRequired(),
  birthday: yup.string().notRequired(),
  note: yup.string().notRequired(),
});
