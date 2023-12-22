import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import "dayjs/locale/vi";
import { SelectWeekState } from "~/types/timeline";
import { BookingStatus } from "~/types";
import { Colors } from "~/constants";

dayjs.extend(isToday);

export function selectWeek(date: Date): SelectWeekState[] {
  return Array(7)
    .fill(new Date(date))
    .map((el, idx) => {
      const date = dayjs(new Date(el.setDate(el.getDate() - el.getDay() + idx)), { locale: "vi" });
      return {
        date: date.format("YYYY-MM-DD"),
        dayjs: date,
        day: date.day(),
        active: Boolean(date.isToday()),
        disabled: Boolean(date.day() === 0),
      };
    });
}

export const fBookingStatusTimelineColor = (
  type: BookingStatus,
  mode: "dark" | "light"
): string => {
  const pending_confirmation = mode === "light" ? Colors.Orange : Colors.OrangeDark;
  const confirmed = mode === "light" ? Colors.Black : Colors.White;
  const pending_payment = mode === "light" ? "#E86A33" : "#FC7300";

  const status: Record<BookingStatus, string> = {
    pending_payment: pending_payment,
    confirmed: confirmed,
    pending_confirmation: pending_confirmation,
    canceled: mode === "light" ? Colors.Red : Colors.Red,
    checked_out: mode === "light" ? Colors.pinkLight : Colors.purpleDark,
    in_progress: mode === "light" ? Colors.GreenLight : Colors.GreenDark,
    completed: mode === "light" ? Colors.PrimaryLight : Colors.PrimaryDark,
  };

  return status[type];
};

export const fBookingStatusColorText = (type: BookingStatus, mode: "dark" | "light"): string => {
  const pending_confirmation = mode === "light" ? Colors.Black : Colors.White;
  const pending_payment = mode === "light" ? Colors.White : Colors.White;
  const confirmed = mode === "light" ? Colors.White : Colors.Black;

  const status: Record<BookingStatus, string> = {
    pending_payment: pending_payment,
    confirmed: confirmed,
    pending_confirmation: pending_confirmation,
    canceled: mode === "light" ? Colors.White : Colors.White,
    checked_out: mode === "light" ? Colors.White : Colors.White,
    in_progress: mode === "light" ? Colors.Black : Colors.White,
    completed: mode === "light" ? Colors.White : Colors.Black,
  };

  return status[type];
};
