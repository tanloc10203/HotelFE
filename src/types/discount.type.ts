export type StatusDiscount = "expired" | "using";

export interface IDiscount {
  id?: string;
  price_list_id: string;
  room_type_id: number;

  num_discount: number;
  code_used: number | null;
  price: number;

  time_start: string;
  time_end: string;

  status: StatusDiscount;
  is_public: 0 | 1 | number | boolean;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface DiscountPayload {
  id?: string;
  room_type_id: string;

  num_discount: string;
  price: string;

  time_start: string;
  time_end: string;

  is_public: boolean;
}
