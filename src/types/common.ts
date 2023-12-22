import type { Dayjs } from "dayjs";
import { IDiscount, IRoomNumber } from ".";

export type Filters = {
  page: number;
  limit: number;
} & Record<string, any>;

export type Pagination = {
  page: number;
  limit: number;
  totalPage: number;
  totalRows: number;
};

export type LoadingState = "ready" | "pending" | "error" | "success";

export type ResetFormType = {
  resetForm: () => void;
};

export type RadioState = {
  label: string;
  value: string | number;
};

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export type RoomNumberItemProps = {
  roomTypeId: number;
  priceHour: number;
  priceDay: number;
  roomTypeName: string;
  discount?: IDiscount | null;
} & IRoomNumber;

export type ModeType = "edit" | "delete" | null;

export type RangeValue = [Dayjs | null, Dayjs | null] | null;
