import { IDepartment, IPosition, RolePayload } from ".";

export type StatusEmployee = "active" | "inactive" | "banned" | "retired";

export interface IEmployee {
  id?: number;
  display_name: string;
  username: string;
  password: string;
  email?: string;
  email_verified_at?: string | Date;
  phone_number?: string;
  phone_verified_at?: string;
  remember_token?: string | null;
  email_verify_token?: string | null;
  photo?: string;
  status?: StatusEmployee;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export interface IEmployeeInfo {
  id?: number;
  employee_id: number;
  first_name: string;
  last_name: string;
  birth_date?: string;
  address?: string;
  desc?: string;
  gender?: "MALE" | "FEMALE" | "OTHERS";
  created_at?: string;
  updated_at?: string;
}

export type TypeEmployeeResponse = {
  employeeInfo: IEmployeeInfo;
  roles: null | RolePayload[];
  department: null | IDepartment;
  position: null | IPosition;
} & IEmployee;

export interface IEmployeePayload {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  username: string;
  gender: string;
  password: string;
  roles:
    | {
        id: number;
      }[]
    | null;
  position: number | null;
  department: number | null;
  status?: StatusEmployee;
}

export interface IEmployeePayloadEdit {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  roles:
    | {
        id: number;
      }[]
    | null;
  position: number | null;
  department: number | null;
}
