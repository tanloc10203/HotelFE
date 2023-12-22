import { IAmenityType } from ".";

export interface IAmenitie {
  id?: number;
  type_id: number;
  name: string;
  desc?: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export type IAmenityResponse = {
  typeData: IAmenityType;
} & IAmenitie;
