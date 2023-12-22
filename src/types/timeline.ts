import type { Dayjs } from "dayjs";

export type SelectWeekState = {
  date: string;
  dayjs: Dayjs;
  day: number;
  active: boolean;
  disabled: boolean;
};

export type ModeTimeLine = "timeline" | "grid";
