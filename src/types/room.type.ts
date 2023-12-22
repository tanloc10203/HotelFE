import { Dayjs } from "dayjs";
import {
  DiscountPayload,
  IBooking,
  IBookingDetail,
  ICustomer,
  IDiscount,
  IEquipmentResponse,
  IFloor,
  IGuestStayInformation,
  IRoomTypeResponse,
  ModeBookingType,
} from ".";

export type StatusRoom = "maintenance" | "unavailable" | "available" | "cleanup";
export type BillStatus = "paid" | "unpaid" | "partially_paid" | "others";

export interface IBill {
  id?: string;
  employee_id: number;
  booking_details_id: string;

  payment?: "online" | "offline" | "transfer" | "others";
  status: BillStatus;

  total_price: number;
  deposit?: number;
  change?: number;
  price_received?: number;

  note?: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  cost_room?: number;
  cost_service?: number;
  cost_room_paid?: number;
  cost_over_checkout?: number;
  cost_last_checkin?: number;
  change_room_bill?: number;
  cost_late_checkout?: number;

  discount?: number;
}

export interface IPriceByHour {
  id?: number;
  room_price_id?: string;
  room_type_id: number;
  start_hour: number;
  price: number;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IRoomPrice {
  id?: string;
  price_list_id?: string;
  room_type_id: number;
  price_online: number;
  price_offline: number;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  price_hours: IPriceByHour[];
}

export type BookingFrontDeskTimeline = IBookingDetail &
  Pick<IBooking, "mode_booking" | "is_booked_online">;

export interface IRoomNumber {
  id: string;
  note?: string;
  status: null | StatusRoom;

  room_id?: number;
  booking_id?: null | string;
  booking_detail_id?: null | string;

  check_in?: null | string;
  check_out?: null | string;
  checked_in?: string;

  mode_booking?: null | ModeBookingType;
  adults?: number;
  children?: number;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  bill?: null | IBill;
  guestInformations?: IGuestStayInformation[] | null;
  bookings?: BookingFrontDeskTimeline[];
}

export interface IRoom {
  id?: number;
  floor_id: number;
  room_type_id: number;
  room_numbers: IRoomNumber[];
  room_quantity: number;
  status?: StatusRoom;
  is_public: 0 | 1;
  is_smoking: 0 | 1;
  is_parking: 0 | 1;
  is_breakfast: 0 | 1;
  is_pets: 0 | 1;
  is_extra_beds: 0 | 1;
  area: number | null;
  adults: number;
  children: number | null;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
  photo_publish?: string;
}

export interface IBed {
  bed_id: number;
  room_id: number;
  quantity: number;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IBedResponse extends IBed {
  bed: IEquipmentResponse;
}

export interface IDurationsRoom {
  id?: number;
  room_id: number;
  check_in_from: string;
  check_in_to: string;
  check_out_from?: string;
  check_out_to: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IRoomResponse extends IRoom {
  roomType: IRoomTypeResponse;
  floor: IFloor;
  discount: IDiscount | null;
  beds: IBedResponse[] | null;
  durationRoom: IDurationsRoom | null;
}

export interface RoomPayloadChangePrice extends DiscountPayload {
  price_day: number;
  price_hour: number;
  price_day_online: number;
  price_hour_online: number;
}

export interface RoomAddDiscount {
  room_id?: number;
  id?: string;
  num_discount: number;
  price_discount: number;
  percent_discount: number;
  time_start: string;
  time_end: string;
  type: string;
  is_public: boolean;
}

export interface BedsOptions {
  value: number;
  label: string;
  quantity: number;
}

export interface RoomPayload {
  id?: number;
  room_quantity: string;
  floor_id: string;
  room_type_id: string;
  is_public: 0 | 1;
  is_smoking: 0 | 1;
  is_parking: 0 | 1;
  is_breakfast: 0 | 1;
  is_pets: 0 | 1;
  is_extra_beds: 0 | 1;
  adults: string;
  children: string;
  area: string;
  beds: BedsOptions[] | null;
  check_in_from: string;
  check_in_to: string;
  check_out_from?: string;
  check_out_to: string;
  photo_publish: string;
  room_numbers: IRoomNumber[];
}

export interface RoomPayloadAdd {
  id?: number;
  floor_id: number;
  room_type_id: number;
  room_quantity: number;
  is_public: 0 | 1;
  is_smoking: 0 | 1;
  is_parking: 0 | 1;
  is_breakfast: 0 | 1;
  is_pets: 0 | 1;
  is_extra_beds: 0 | 1;
  adults: number;
  children: number;
  area: number;
  beds: BedsOptions[];
  check_in_from: string;
  check_in_to: string;
  check_out_from?: string;
  check_out_to: string;
  photo_publish: any;
  room_numbers: IRoomNumber[];
}

export type FrontDesk = {
  rooms: IRoomResponse[];
} & IFloor;

export type RoomsAvailableDesktop = {
  roomTypeId: number;
  name: string;
  desc: string;
  roomId: number;
  character: number;
  roomAvailable: number;
  prices: IRoomPrice;
  roomNumbers: IRoomNumber[];
  maxPeople: { adults: number; children: number };
  discount: IDiscount | null;
};

export type RoomsSelected = {
  quantity: number;
  adults: number;
  children: number;
  checkIn: Dayjs;
  checkOut: Dayjs;
  roomNumberSelected: IRoomNumber[];
  totalTime: number;
} & RoomsAvailableDesktop;

export type ModeTimeBookingPrice = "time" | "day";

export type InformationRoomDetails = {
  room: {
    roomNumber: IRoomNumber;
    roomTypeName: string;
    prices: IRoomPrice | null;
    discount: IDiscount | null;
  };
  tax: number;
  bill: IBill | null;
  guestsData: IGuestStayInformation[];
  bookingDetails: IBookingDetail & {
    bookingData: Pick<
      IBooking,
      "is_booked_online" | "mode_booking" | "payment" | "total_price" | "total_room"
    > & {
      customerData: Pick<ICustomer, "display_name" | "id" | "phone_number" | "email">;
    };
  };
};

export type BillInfoPayload = {
  totalCostRoom: number;

  paymentCost: number; // phi da thanh toan
  costLateCheckIn: number; // phi nhan phong som
  costOverCheckOut: number; // phi tra phong tre
  totalCostService: number; // phi tien dich vu hang hoa

  discount: number;
  customerPay: number;
  customerRequirePay: number;
  note: string;
  totalQuantityOrdered: number;

  deposit: number;
  change: number;
};

export type ChangeRoomPayload = {
  roomNumber: string;
  bookingDetailsId: string;
};

export type RoomNumberRender = IRoomNumber & {
  prices: IRoomPrice;
  roomTypeId: number;
  roomTypeName: string;
  bookingDetailsId: string;
};

export type CheckoutPayload = BillInfoPayload & {
  bookingDetailsId: string;
  billId: string;
  employeeId: number;
};

export type FrontDeskTimeline = {
  rooms: IRoomResponse[];
} & IFloor;
