import * as yup from "yup";

export const roomSchema = (isAddMode: boolean) => {
  if (isAddMode)
    return yup.object({
      floor_id: yup.number().required("Vui lòng  chọn vị trí phòng."),
      room_type_id: yup.number().required("Vui lòng  chọn loại phòng."),
      room_quantity: yup
        .number()
        .positive("Không được phép nhỏ hơn 0")
        .required("Đây là trường bắt buộc"),
      is_public: yup.bool(),
      is_smoking: yup.bool(),
      is_parking: yup.bool(),
      is_breakfast: yup.bool(),
      is_pets: yup.bool(),
      is_extra_beds: yup.bool(),
      adults: yup.number().required("Đây là trường bắt buộc"),
      children: yup.number().notRequired(),
      area: yup.number().notRequired(),
      beds: yup.array().required("Đây là trường bắt buộc."),
      check_in_from: yup.string().required("Đây là trường bắt buôc."),
      check_in_to: yup.string().required("Đây là trường bắt buôc."),
      check_out_from: yup.string().notRequired(),
      check_out_to: yup.string().required("Đây là trường bắt buôc."),
      photo_publish: yup.mixed().required("Ảnh là trường bắt buộc"),
    });

  return yup.object({
    floor_id: yup.number().required("Vui lòng  chọn vị trí phòng."),
    room_type_id: yup.number().required("Vui lòng  chọn loại phòng."),
    room_quantity: yup
      .number()
      .positive("Không được phép nhỏ hơn 0")
      .required("Đây là trường bắt buộc"),
    is_public: yup.bool(),
    is_smoking: yup.bool(),
    is_parking: yup.bool(),
    is_breakfast: yup.bool(),
    is_pets: yup.bool(),
    is_extra_beds: yup.bool(),
    adults: yup.number().required("Đây là trường bắt buộc"),
    children: yup.number().notRequired(),
    area: yup.number().notRequired(),
    beds: yup.array().required("Đây là trường bắt buộc."),
    check_in_from: yup.string().required("Đây là trường bắt buôc."),
    check_in_to: yup.string().required("Đây là trường bắt buôc."),
    check_out_from: yup.string().notRequired(),
    check_out_to: yup.string().required("Đây là trường bắt buôc."),
    photo_publish: yup.mixed().notRequired(),
  });
};
