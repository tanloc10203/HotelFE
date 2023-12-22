import { IService, ServicesUnitType, SupplierType, TypeEmployeeResponse } from ".";

export type GoodsReceiptNotesDetail = {
  id?: string;
  goods_receipt_note_id: string;
  product_id: string;
  quantity_ordered: number;
  sub_total: number;
  price: number;
  discount?: number;

  unit_product_id: string;

  note?: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  product?: Omit<IService, "priceData" | "attributes" | "units">;
  unit?: null | ServicesUnitType;
};

export type GoodsReceiptNoteProduct = {
  product_id: string;
  unit_service_id: string;
  subTotal_import: number;
  quantity_import: number;
  price_origin: number;
  price: number;
};

export type GoodsReceiptNotePayloadAdd = {
  discount: number;
  note: string;
  supplier_id: string;
  employee_id: number;
  quantity_ordered: number;
  total_cost: number;
  total_cost_paymented: number;
  products: GoodsReceiptNoteProduct[];
};

export type GoodsReceiptNoteStatus = "paid" | "unpaid" | "partially_paid";

export type GoodsReceiptNote = {
  id?: string;
  supplier_id: string;
  employee_id: number;
  quantity_ordered: number;
  total_cost: number;
  total_cost_paymented: number;
  discount?: number;
  note?: string;
  status: GoodsReceiptNoteStatus;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;

  supplier?: SupplierType;
  employee?: Pick<TypeEmployeeResponse, "display_name" | "phone_number" | "photo" | "id">;
  details?: GoodsReceiptNotesDetail[];
};

export const convertStatusGoodsReceiptNote = (status: GoodsReceiptNoteStatus) => {
  const statuses: Record<GoodsReceiptNoteStatus, string> = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    partially_paid: "Thanh toán 1 phần",
  };

  return statuses[status];
};
