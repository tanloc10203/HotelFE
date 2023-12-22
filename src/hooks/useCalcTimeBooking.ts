import { intervalToDuration } from "date-fns";
import { Dayjs } from "dayjs";
import { useMemo } from "react";
import { ModeTimeBookingPrice } from "~/types";

export const useCalcTimeBooking = ({
  modeTime,
  checkIn,
  checkOut,
}: {
  modeTime: ModeTimeBookingPrice;
  checkIn: Dayjs;
  checkOut: Dayjs;
}) => {
  const memo = useMemo(() => {
    let modeDiff = "days";

    if (modeTime === "time") {
      modeDiff = "hours";
    }

    const durations = intervalToDuration({ start: checkIn.toDate(), end: checkOut.toDate() });

    let diff = checkOut.diff(checkIn, modeDiff as any);
    diff = diff < 0 ? 0 : diff;

    if (modeTime === "day") {
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
  }, [modeTime, checkIn, checkOut]);

  return memo;
};
