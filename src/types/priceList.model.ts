import { IRoomType } from ".";

export type PriceListStatus = "service" | "product" | "room" | "discount";

export type PriceListState = {
  id?: string;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  type?: PriceListStatus;

  is_default: 1 | 0 | boolean;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  roomTypes: IRoomType[];
};
