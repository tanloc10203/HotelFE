export type SupplierType = {
  id?: string;
  name: string;
  phone_number: string;
  address?: string;
  email?: string;
  company_name?: string;
  code_tax?: string;
  note?: string;
  status?: "active" | "inactive";
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};
