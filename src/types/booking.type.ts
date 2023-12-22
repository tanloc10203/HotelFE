import {
  IBill,
  ICustomer,
  IDiscount,
  IEmployee,
  IRoom,
  IRoomNumber,
  IRoomPrice,
  IRoomTypeResponse,
  RoomsSelected,
} from ".";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "pending_confirmation"
  | "canceled"
  | "checked_out"
  | "in_progress"
  | "completed";

export type BookingPayment = "online" | "offline";

export type BookingFor = "me" | "you";

export type ModeBookingType = "day" | "time";

export interface IBookingDetail {
  id?: string;

  booking_id: string;
  room_number_id: string;
  room_id: number;
  discount_id?: string | null;

  check_in: string;
  check_out: string;

  adults: number;
  children: number | null;

  last_room_number_transfer?: string | null;
  note?: string | null;
  status: "transfer_room" | BookingStatus;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  checked_in?: string | null;
  checked_out?: string | null;

  rooms?: Omit<IRoom, "room_numbers">;
  bill?: IBill | null;

  roomNumber?: IRoomNumber;
  discount?: IDiscount | null;

  guestInformations?: IGuestStayInformation[];
  bookingData?: Pick<
    IBooking,
    "id" | "is_booked_online" | "mode_booking" | "payment" | "total_price" | "total_room"
  > & { customerData: Pick<ICustomer, "display_name" | "id" | "phone_number" | "email"> };

  prices?: IRoomPrice;
  roomType?: IRoomTypeResponse;
}

export interface IBooking {
  id?: string;
  customer_id: number;
  employee_id?: number;

  voucher?: string | null;
  payment: BookingPayment;

  booking_for: BookingFor;
  check_in: string;
  check_out: string;

  guests_adults: number;
  guests_children?: number;

  total_price: number;
  total_room: number;
  status: BookingStatus;

  mode_booking?: ModeBookingType;
  is_booked_online?: 0 | 1 | boolean;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  bookingDetails?: IBookingDetail | null;
  customer?: ICustomer;
  employee?: IEmployee | null;
}

export type SearchingAvailableDesktopPayload = {
  check_in: string;
  check_out: string;
};

export type GetChangeRoomsQuery = {
  checkIn: string;
  checkOut: string;
  roomTypeId?: number;
};

export type RoomsSelectedOverride = Omit<RoomsSelected, "checkIn" | "checkOut"> & {
  checkIn: string;
  checkOut: string;
  totalCost: number;
};

export type BookingDeskTopPayload = {
  rooms: RoomsSelectedOverride[];
  customerId: number;
  employeeId: number;
  modeCheckPrice: string;
  note?: string;
  voucher?: string;
};

export type IGuestStayInformation = {
  id?: string;
  booking_details_id: string;
  room_number: string;
  full_name: string;
  gender?: "MALE" | "FEMALE" | "OTHERS";
  birthday?: string | null;
  nationality: string;
  note?: string;
  identification_type: "passport" | "cccd" | "cmnd" | "others" | "cavet_xe";
  identification_value: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};

export type GetCustomerBooked = {
  customer_id: number;
  display_name: string;
  prices: IRoomPrice;
  roomTypeName: string;
  mode_booking: ModeBookingType;
  is_booked_online: boolean | number;
  guestInformations: IGuestStayInformation[];

  bill: IBill | null;
  discount: IDiscount | null;
  tax: number;
} & IBookingDetail;

export type GetCustomerBookedPayload = {
  checkIn: string;
  checkOut: string;
  modeBooking: ModeBookingType;
  roomNumber: string;
  customerId?: number;
  bookingDetailsId?: string;
  status: BookingStatus;
};

export type CheckInPayload = {
  bookingDetails: {
    id: string;
    room_number_id: string;
    room_id: number;
    check_in: string;
    check_out: string;
    prices: IRoomPrice;
  }[];
  modeBooking: ModeBookingType;
  booking_id: string;
  customer_id: number;
  employee_id: number;
  is_booked_online: boolean | number;
};

export type AddGuestStayInformationPayload = {
  filters?: GetCustomerBookedPayload;
} & IGuestStayInformation;
