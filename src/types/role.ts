import { IPermission } from ".";

export interface IRole {
  id?: number;
  name: string;
  desc: string;
  created_at?: string;
  updated_at?: string;
}

export type RolePayload = {
  permissions: IPermission[];
} & IRole;

export type RoleEmployeePayload = {
  employee_id: number;
  roles: {
    id: number;
  }[];
};
