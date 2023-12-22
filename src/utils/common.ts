import { intervalToDuration } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import _, { Dictionary } from "lodash";
import { LocalStorage } from "~/constants";
import { getLocalStorage, setLocalStorage } from "~/helpers/localStorage";
import { AcceptSession } from "~/routes/loaderProtect";
import { BillStatus, IDiscount, IRoomPrice, ModeBookingType } from "~/types";
import moment from "moment";
import { SelectWeekState } from "~/types/timeline";
import { selectWeek } from ".";
import { calcPriceHourWithDiscount } from "./convert";

export const sleep = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

export const removeNullObj = <T>(obj: Dictionary<T>) =>
  _.omitBy(obj, ((v) => v === "") || _.isNil || _.isUndefined);

export const removeNullObjV2 = <T>(obj: Record<keyof T, any>) => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key as keyof T]) delete obj[key as keyof T];
  });

  return obj;
};

export const convertQueryParams = (obj: Record<string, any>) => {
  let query = "";

  Object.keys(obj).forEach((key, index) => {
    if (index > 0) {
      query += `&${key}=${obj[key]}`;
    } else {
      query += `?${key}=${obj[key]}`;
    }
  });

  return query;
};

export const getInfoData = <T>(object: T, filed: Array<keyof T>) => _.pick(object, filed);

export const getBlobImg = (file: File): Promise<{ url: string; id: number }> =>
  new Promise((resolve, reject) => {
    try {
      if (!file) return;

      const reader = new FileReader();

      const objURL = URL.createObjectURL(file);

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve({
          url: objURL,
          id: file.lastModified,
        });
      };
    } catch (error) {
      reject(error);
    }
  });

export const isOwnerRoute = (route: string) =>
  route.toLowerCase().includes("login") && route.toLowerCase().includes("owner");

export const generateSession = () => dayjs().format("DDMMYYYYHHmmss");

export const handleTwoToken = (path: string) => {
  const session = generateSession();
  console.log(`set LocalStorage.ACCEPTS_SESSION fc: handleTwoToken,  ${path}`);

  let acceptsSession: string | null | AcceptSession[] = getLocalStorage(
    LocalStorage.ACCEPTS_SESSION
  );

  if (!acceptsSession) {
    const acceptsSession: AcceptSession[] = [{ path: path, session: session }];
    setLocalStorage(LocalStorage.ACCEPTS_SESSION, JSON.stringify(acceptsSession));

    return session;
  }

  acceptsSession = JSON.parse(acceptsSession) as AcceptSession[];

  const index = acceptsSession.findIndex((t) => t.path === path);

  if (index === -1) {
    acceptsSession.push({
      path: path,
      session: session,
    });
  } else {
    acceptsSession[index] = {
      ...acceptsSession[index],
      session: session,
    };
  }

  setLocalStorage(LocalStorage.ACCEPTS_SESSION, JSON.stringify(acceptsSession));

  return session;
};

export const pushSessionToLocalStorage = (data: AcceptSession) => {
  let acceptsSession: string | null | AcceptSession[] = getLocalStorage(
    LocalStorage.ACCEPTS_SESSION
  );

  if (!acceptsSession) {
    acceptsSession = [data];
  } else {
    acceptsSession = JSON.parse(acceptsSession) as AcceptSession[];
    acceptsSession.push(data);
  }

  setLocalStorage(LocalStorage.ACCEPTS_SESSION, JSON.stringify(acceptsSession));
  return true;
};

export const updateTask = <Data extends Record<string, any>>(
  taskEdit: Data,
  tasks: Data[],
  key: keyof Data
) => {
  const index = tasks.findIndex((position) => position[key] === taskEdit[key]);

  if (index === -1) return tasks;

  tasks[index] = taskEdit;

  return tasks;
};

export const filterTask = <Data extends Record<string, any>>(
  taskFilter: Data,
  tasks: Data[],
  key: keyof Data
) => {
  return tasks.filter((task) => task[key] !== taskFilter[key]);
};

const columnMax = 12;
const percent = 100;
const percentMin = percent / columnMax;

export const columnPercentGrid = (column: number) => column * percentMin;

export const convertToZero = (countZero: number) => {
  let zeros: string = "";

  for (let index = 0; index < countZero; index++) {
    zeros += `0`;
  }

  return zeros;
};
export const convertRoomNumber = (index: number, countZero = 1) => {
  if (index < 10) return `${convertToZero(countZero)}${index}`;

  if (index > 100) return `${convertToZero(countZero - 2)}${index}`;

  if (index > 1000) return `${convertToZero(countZero - 3)}${index}`;

  return `${convertToZero(countZero - 1)}${index}`;
};

export const currentDate = () => dayjs(new Date());

export const startDate = () => {
  const FORMAT = "YYYY-MM-DD 12:00:00";
  const date = dayjs().format(FORMAT);
  return dayjs(date);
};

export const endDate = (startDate: Dayjs) => {
  const nextDate = startDate.add(1, "day");
  return nextDate;
};

export const getElementByLength = <Array>(array: Array[], length: number) => {
  const lengthArray = array.length;
  const results = [];

  for (let index = 0; index < lengthArray; index++) {
    if (index > length) break;
    results.push(array[index]);
  }

  return results;
};

export const calDateTimeBooking = (
  checkIn: string,
  checkOut: string,
  modeBooking: ModeBookingType
) => {
  const _checkIn = dayjs(new Date(checkIn));
  const _checkOut = dayjs(new Date(checkOut));
  const modeDiff = modeBooking === "time" ? "hours" : "days";
  const durations = intervalToDuration({ start: _checkOut.toDate(), end: _checkIn.toDate() });

  let diff = _checkOut.diff(_checkIn, modeDiff as any);
  diff = diff < 0 ? 0 : diff;

  if (modeBooking === "day") {
    const { hours } = durations;

    let night = 1;

    if (hours! >= 12) {
      ++diff;
      night = diff - night;
    }

    return {
      text: `${diff} ngày`,
      diff,
    };
  }

  return {
    text: `${diff} giờ`,
    diff,
  };
};

export function getDates(startDate: Date, stopDate: Date) {
  const dateArray = [];

  let currentDate = moment(startDate);
  const endDate = moment(stopDate);

  while (currentDate <= endDate) {
    dateArray.push(moment(currentDate).format("DD/MM/YYYY"));
    currentDate = moment(currentDate).add(1, "days");
  }

  return dateArray;
}

export const convertStatusBill = (status: BillStatus) => {
  const statuses: Record<BillStatus, string> = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    partially_paid: "Thanh toán 1 phần",
    others: "Không xác định",
  };

  return statuses[status];
};

export const datesOfWeek = (): SelectWeekState[] => {
  return selectWeek(dayjs().toDate());
};

export const checkInLate = (checkInInput: string, checkedInInput = "") => {
  const checkIn = dayjs(new Date(checkInInput));
  const checkedIn = dayjs(checkedInInput ? new Date(checkedInInput) : new Date());

  const diff = checkIn.diff(checkedIn, "minutes");

  const durationCheckIn = intervalToDuration({
    end: checkedIn.toDate(),
    start: checkIn.toDate(),
  });

  return { ...durationCheckIn, late: diff > 0 };
};

export const calcPriceCheckInLate = (
  duration: Duration,
  discount: IDiscount | null,
  prices: IRoomPrice
) => {
  const { days, hours } = duration;

  const hourByDays = days && days > 0 ? days * 24 : 0;
  const totalHours = Number(hours || 0) + hourByDays;

  // console.log("====================================");
  console.log(`total Hours`, { hourByDays, totalHours, days, hours });

  const price = calcPriceHourWithDiscount({
    priceDiscount: discount?.price || 0,
    priceHours: prices?.price_hours || [],
    totalPrice: 0,
    totalTime: totalHours,
  });

  // console.log(`price`, price);
  // console.log("====================================");

  return price;
};
