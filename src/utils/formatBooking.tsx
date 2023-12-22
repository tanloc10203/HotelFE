import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { ButtonActions } from "~/components";
import { BookingFor, BookingPayment, BookingStatus } from "~/types";

export const fBookingStatus = (type: BookingStatus): string => {
  const status: Record<BookingStatus, string> = {
    pending_payment: "Đang chờ thanh toán",
    confirmed: "Đã xác nhận",
    pending_confirmation: "Đang chờ xác nhận",
    canceled: "Đã hủy",
    checked_out: "Đã trả phòng",
    in_progress: "Đang lưu trú",
    completed: "Hoàn thành",
  };

  return status[type];
};

export const fBookingStatusColor = (type: BookingStatus, mode: "dark" | "light"): string => {
  const pending_confirmation = mode === "light" ? "#F4CE14" : "yellow";
  const pending_payment = mode === "light" ? "#E86A33" : "#FC7300";

  const status: Record<BookingStatus, string> = {
    pending_payment: pending_payment,
    confirmed: mode === "light" ? "green" : "#A2FF86",
    pending_confirmation: pending_confirmation,
    canceled: mode === "light" ? "#FF1E00" : "#FF1E00",
    checked_out: mode === "light" ? "#5BB318" : "#7DCE13",
    in_progress: mode === "light" ? "#2192FF" : "#2192FF",
    completed: mode === "light" ? "green" : "#A2FF86",
  };

  return status[type];
};

export const fBookingPayment = (type: BookingPayment) => {
  const status: Record<BookingPayment, string> = {
    online: "Online",
    offline: "Tại kì nghỉ",
  };

  return status[type];
};

export const fBookingFor = (type: BookingFor) => {
  const status: Record<BookingFor, string> = {
    me: "Chính họ",
    you: "Người khác",
  };

  return status[type];
};

export const fActionConfirmBooking = (type: BookingStatus, onClick?: () => void) => {
  const Components: Record<BookingStatus, JSX.Element | null> = {
    pending_payment: (
      <ButtonActions color="success" onClick={onClick} startIcon={<ConfirmationNumberIcon />}>
        Xác nhận đã thanh toán
      </ButtonActions>
    ),
    confirmed: null,
    pending_confirmation: (
      <ButtonActions onClick={onClick} startIcon={<ConfirmationNumberIcon />}>
        Xác nhận
      </ButtonActions>
    ),
    canceled: null,
    checked_out: (
      <ButtonActions onClick={onClick} startIcon={<ConfirmationNumberIcon />}>
        Xác nhận kết thúc kì nghỉ
      </ButtonActions>
    ),
    in_progress: (
      <ButtonActions onClick={onClick} startIcon={<ConfirmationNumberIcon />}>
        Xác nhận kết thúc kì nghỉ
      </ButtonActions>
    ),
    completed: null,
  };

  return Components[type];
};
