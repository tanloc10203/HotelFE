import { isNumber } from "lodash";
import { Colors } from "~/constants";
import { IDiscount, IPriceByHour, ModeBookingType } from "~/types";

export const convertRate = (start: number, mode: "light" | "dark") => {
  const background: Record<number, string> = {
    0: mode === "light" ? Colors.redLight : Colors.Red,
    1: mode === "light" ? Colors.redLight : Colors.Red,
    2: mode === "light" ? Colors.Orange : Colors.OrangeDark,
    3: mode === "light" ? Colors.PrimaryLight : Colors.PrimaryDark,
    4: mode === "light" ? Colors.Blue : Colors.Blue,
    5: mode === "light" ? Colors.GreenLight : Colors.GreenDark,
  };

  const colors: Record<number, string> = {
    0: mode === "light" ? Colors.White : Colors.White,
    1: mode === "light" ? Colors.White : Colors.White,
    2: mode === "light" ? Colors.White : Colors.White,
    3: mode === "light" ? Colors.White : Colors.White,
    4: mode === "light" ? Colors.White : Colors.White,
    5: mode === "light" ? Colors.Black : Colors.White,
  };

  return { bg: background[start], text: colors[start] };
};

export const convertIsDefaultPriceList = (isDefaults: 0 | 1 | boolean) =>
  (isNumber(isDefaults) ? Boolean(+isDefaults === 1) : isDefaults)
    ? "Đang sử dụng"
    : "Không được sử dụng";

export const calcWithDiscount = (totalPrice: number, priceDiscount: number) =>
  priceDiscount > 100
    ? totalPrice - priceDiscount
    : totalPrice - (totalPrice * priceDiscount) / 100;

export const calcPriceHourWithDiscount = ({
  priceHours,
  totalPrice,
  totalTime,
  priceDiscount,
}: {
  totalPrice: number;
  priceHours: IPriceByHour[];
  totalTime: number;
  priceDiscount: number;
}) => {
  let results = calcWithDiscount(totalPrice, priceDiscount);
  // const priceHoursLength = priceHours.length;

  // console.log("========================================================================");

  const timeUsed: number[] = [];

  for (let j = 0; j < totalTime; j++) {
    const time = j + 1;

    const priceHour = priceHours.find((t) => t.start_hour === time);

    if (priceHour) {
      const priceDiscountCalc = calcWithDiscount(priceHour.price, priceDiscount);
      timeUsed.push(time);
      results += priceDiscountCalc;

      // console.log(`${time} results = `, { results, price: priceHour?.price });
    } else {
      // console.log(`Không tìm thấy time = `, time);
      // If time is max in timeUsed => get last timeUsed else first time;

      const timeUsedLast = timeUsed[timeUsed.length - 1];

      if (time > timeUsedLast) {
        const priceHour = priceHours.find((t) => t.start_hour === timeUsedLast);

        if (priceHour) {
          const priceDiscountCalc = calcWithDiscount(priceHour.price, priceDiscount);
          results += priceDiscountCalc;
        }

        // console.log(`${time} results = `, { results, price: priceHour?.price });
      } else {
        // console.log(`${time} results else = `, results);
      }
    }
  }

  // console.log(timeUsed);

  // console.log("========================================================================");

  return results;
};

export type CalcPriceWithTaxOutPayload = {
  modeBooking: ModeBookingType;
  priceHour: IPriceByHour[];
  priceDay: number;
  totalDateTimeCheckInOut: number;
  discount: IDiscount | null;
};

export const calcPriceWithOutTax = ({
  modeBooking,
  priceDay,
  priceHour,
  totalDateTimeCheckInOut,
  discount,
}: CalcPriceWithTaxOutPayload) => {
  let price = calcWithDiscount(priceDay * totalDateTimeCheckInOut, discount?.price || 0);

  if (modeBooking === "time") {
    price = calcPriceHourWithDiscount({
      priceDiscount: discount?.price || 0,
      priceHours: priceHour,
      totalPrice: 0,
      totalTime: totalDateTimeCheckInOut,
    });
  }

  return price;
};
