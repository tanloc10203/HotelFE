import { ACCESS_DENIED, NOT_ROLES } from "~/constants";

export const ForbiddenCodes = {
  [ACCESS_DENIED]: "Xin lỗi, bạn không có quyền truy cập trang được yêu cầu",
  [NOT_ROLES]: "Xin lỗi, bạn chưa được cấp vai trò trong hệ thống",
};

export const isCodeForbidden = (code: string): code is keyof typeof ForbiddenCodes =>
  code in ForbiddenCodes;
