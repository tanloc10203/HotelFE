export type AttributeType = {
  id?: string;
  name: string;
  desc?: string;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};

export type ServicesAttributeType = {
  id?: string;
  attribute_id: string;
  service_id?: number;
  value: string;
  attributeData?: AttributeType;
  quantity: number;
  created_at?: string;
  deleted_at?: string;
  updated_at?: string;
};
