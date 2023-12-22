import { IAmenityResponse, IDiscount, IEquipmentResponse, IRoomPrice } from ".";

export interface IRoomType {
  id?: number;
  name: string;
  character: string;
  desc: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  prices?: IRoomPrice;
  discount?: IDiscount;
}

type PayloadInsert = {
  id: number;
};

export interface ImagesRoomType {
  id?: number;
  room_type_id: number;
  src: string;
  created_at?: string;
}

export type IRoomTypePayload = {
  equipments: PayloadInsert[] | null;
  amenities: PayloadInsert[] | null;
  images: any[] | null;
} & IRoomType;

export type IRoomTypePayloadEdit = {
  removeImages: { id: number }[] | null;
} & IRoomTypePayload &
  IRoomType;

export type IRoomTypeResponse = {
  amenities: IAmenityResponse[];
  equipments: IEquipmentResponse[];
  images: ImagesRoomType[];
} & IRoomType;
