import { IService, ServicesUnitType } from ".";

export type GuestUseServiceType = {
  id?: string;
  service_id: string;
  service_unit_id: string;
  booking_details_id: string;
  guest_id?: string | null;

  quantity_ordered: number;
  price?: number;
  discount?: number;
  note?: string | null;
  sub_total?: number;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  serviceData?: IService;
  unitData?: ServicesUnitType;
};

export type GuestUseServicesPlusMinusPayload = {
  guestUseServiceId: string;
  data: {
    options: "minus" | "plus";
    quantity: number;
  };
};
