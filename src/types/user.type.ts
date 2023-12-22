export interface UserState {
  address?: null | string;
  birth_date?: null | string;
  desc?: null | string;
  display_name: string;
  email: string;
  first_name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  id: number;
  last_name: string;
  phone_number: string;
  photo?: string | null;
  username: string;
}

export interface UserInfo {
  id?: number;
  owner_id: number;
  first_name: string;
  last_name: string;
  birth_date?: string;
  address?: string;
  desc?: string;
  gender?: "MALE" | "FEMALE" | "OTHERS";
  created_at?: string;
  updated_at?: string;
}
