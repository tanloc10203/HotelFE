export type RateState = {
  id?: string;
  booking_id: string;
  room_id: string;
  customer_id: number;
  start: number;
  comment: string;

  is_hidden?: boolean | 1 | 0;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  roomTypeName?: string;
  customer?: { id: number; display_name: string; photo: string };
};
