import { Duration, format, formatDistanceToNow, getTime, intervalToDuration } from "date-fns";
import { vi } from "date-fns/locale";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";

// ----------------------------------------------------------------------

export function fDate(date: string | Date, newFormat = "") {
  const fm = newFormat || "dd MMM yyyy";

  return date ? format(new Date(date), fm, { locale: vi }) : "";
}

export function fDateTime(date: string | Date, newFormat = "") {
  const fm = newFormat || "dd MMM yyyy p";

  return date ? format(new Date(date), fm, { locale: vi }) : "";
}

export function fTimestamp(date: string | Date) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: string | Date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}

export function getFirstDayOfYear(year: number) {
  return new Date(year, 0, 1);
}

export function getLastDayOfYear(year: number) {
  return new Date(year, 11, 31);
}

export function fCapitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function fDateDayjs(date: Dayjs, format = "dddd, DD/MM/YYYY HH:mm") {
  return date.locale("vi").format(format);
}

export function calcUsedInRoom(date: string | Date) {
  const dateNow = dayjs().toDate();
  const start = dayjs(new Date(date)).toDate();
  return intervalToDuration({ end: dateNow, start });
}

export function calcUsedDuration(dateStart: string | Date, dateEnd: string | Date) {
  const end = dayjs(new Date(dateEnd)).toDate();
  const start = dayjs(new Date(dateStart)).toDate();
  return intervalToDuration({ end, start });
}

export function fDurationUsedInRoom(duration: Duration, oneCharacter = false) {
  const { days, hours, minutes, months, weeks, years } = duration;

  let results = "";

  if (duration?.years && duration.years > 0) {
    results += `${years}${oneCharacter ? "y" : " năm"}`;
  }

  if (duration?.months && duration.months > 0) {
    results += ` ${months}${oneCharacter ? "m" : " tháng"}`;
  }

  if (duration?.weeks && duration.weeks > 0) {
    results += ` ${weeks}${oneCharacter ? "w" : " tuần"}`;
  }

  if (duration?.days && duration.days > 0) {
    results += ` ${days}${oneCharacter ? "d" : " ngày"}`;
  }

  if (duration?.hours && duration.hours > 0) {
    results += ` ${hours}${oneCharacter ? "h" : " giờ"}`;
  }

  if (duration?.minutes && duration.minutes > 0) {
    results += ` ${minutes}${oneCharacter ? "m" : " phút"}`;
  }

  return results.trim();
}
