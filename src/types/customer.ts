export interface Customer {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password?: string;
}

export type CustomerInfo = {
  id?: number;
  customer_id: number;
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  address?: string;
  desc?: string;
  gender?: "MALE" | "FEMALE" | "OTHERS";
  created_at?: string;
  updated_at?: string;
};

export type CustomerType = {
  id?: number;
  name: string;
  desc: string;
  is_default: 0 | 1;
  created_at?: string;
  updated_at?: string;
};

export type StatusCustomer = "active" | "inactive" | "banned" | "verify" | "verified";

export interface ICustomer {
  id?: number;
  customer_type_id: number;
  display_name: string;
  username: string;
  password: string;
  email: string;
  email_verified_at?: string | Date;
  phone_number?: string;
  phone_verified_at?: string;
  remember_token?: string | null;
  email_verify_token?: string | null;
  phone_number_verify_token?: string | null;
  status?: StatusCustomer;
  photo?: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  dataInfo?: CustomerInfo;
  type?: CustomerType;
}

export type CustomerPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;

  gender: "MALE" | "FEMALE" | "OTHERS";
  birthday: string | null;
  address: string;
  desc: string;
};
