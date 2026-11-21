export type TWarehouseType = 'CENTRAL_WAREHOUSE' | 'OUTLET_STORE' | 'VIRTUAL';

export interface IWarehouse {
  id: number;
  name: string;
  code: string;
  branch_id?: number | null;
  branch_name?: string | null;
  type: TWarehouseType;
  allow_negative_stock?: boolean;
  phone?: string | null;
  email?: string | null;
  address: string;
  is_active: boolean;
  stocks_count?: number;
  total_items?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateWarehouse {
  name: string;
  code: string;
  branch_id?: number | null;
  type?: TWarehouseType;
  allow_negative_stock?: boolean;
  phone?: string | null;
  email?: string | null;
  address: string;
  is_active?: boolean;
}

export interface IWarehouseQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  branch_id?: number;
  type?: TWarehouseType;
  is_active?: boolean | string;
}

export interface IWarehouseSelect {
  id: number;
  name: string;
  code: string;
}
