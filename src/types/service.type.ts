import { IServiceType, ServicesAttributeType, ServicesUnitType } from ".";

export type ServicesPriceType = {
  id?: string;
  service_id: string;
  price_original: number;
  price_sell: number;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};

export interface IService {
  id?: string;
  service_type_id: string;
  serviceTypeData?: IServiceType | null;
  name: string;
  timer?: number;
  desc?: string;
  note?: string;
  photo_public?: string;
  quantity?: number;
  min_quantity_product?: number;
  units?: ServicesUnitType[];
  attributes?: ServicesAttributeType[];
  priceData?: ServicesPriceType;
  is_product?: boolean;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export type UnitPayloadAddProduct = {
  id?: string;
  unit_id: number;
  is_sell: boolean;
  price?: number;
  quantity?: number;
  is_default?: boolean;
};

export interface IServicePayload extends IService {
  price_original?: number;
  price_sell?: number;
  price_id?: string;
  units?: UnitPayloadAddProduct[];
}

export type AttributesAddProduct = {
  attribute_id: string;
  value: string;
  quantity: number;
};

export interface ProductPayload extends Omit<IService, "units" | "attributes"> {
  price_original: number;
  price_sell: number;
  min_quantity_product?: number;
  attributes?: AttributesAddProduct[];
  units?: UnitPayloadAddProduct[];
}

export type ImportProductDataType = IService & {
  unit_service_id: string;
  unit_id: number;
  unit_quantity?: number;
  unit_is_sell?: boolean;
  unit_price?: number;
  unit_is_default?: boolean;
  unit_is_product?: boolean;
  unit_quantity_in_stock?: number;
  unit_name: string;
  quantity_import: number;
  subTotal_import: number;
};

export type ServiceCustomerSelect = {
  c_service_quantity: number;
  c_service_discount: number;
  c_service_subTotal: number;
} & ImportProductDataType;
