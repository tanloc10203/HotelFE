export interface IUnit {
  id?: number;
  name: string;
  character?: string | null;
  desc?: string | null;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
}

export type ServicesUnitType = {
  id?: string;
  service_id?: string;
  unit_id: number;

  quantity?: number | null;
  is_sell?: boolean | null;
  price?: number | null;
  is_default?: boolean;
  quantity_in_stock?: number;

  unitData?: IUnit;

  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};
