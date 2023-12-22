import { Duration } from "date-fns";
import { useEffect, useState } from "react";
import { calcUsedDuration, calcUsedInRoom, fDurationUsedInRoom } from "~/utils";

export const useCalcTimeUsedInRoom = (updatedAt?: string, disabled?: boolean) => {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (!updatedAt || disabled) return;
    const response = fDurationUsedInRoom(calcUsedInRoom(String(updatedAt)));
    setDuration(response);

    const intervalId = setInterval(() => {
      const response = fDurationUsedInRoom(calcUsedInRoom(String(updatedAt)));
      setDuration(response);
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [updatedAt, disabled]);

  return duration;
};

export const useCalcDuration = (dateStart: string | Date, dateEnd: string | Date) => {
  const [duration, setDuration] = useState<Duration>({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    weeks: 0,
    years: 0,
  });

  useEffect(() => {
    if (!dateEnd || !dateStart) return;
    const response = calcUsedDuration(dateStart, dateEnd);
    setDuration(response);
  }, [dateStart, dateEnd]);

  return duration;
};
