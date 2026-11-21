export interface IPurchaseReturnItemInput {
  purchase_item_id?: number | string;
  product_id: number | string;
  variant_id?: number | string;
  quantity: number;
  unit_cost: number;
  reason?: string;
}

export interface ICreatePurchaseReturn {
  purchase_id: number | string;
  branch_id?: number | string;
  supplier_id?: number | string;
  warehouse_id?: number | string;
  return_date?: string;
  refund_amount?: number;
  payment_account_id?: number | string;
  status?: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  reason?: string;
  items: IPurchaseReturnItemInput[];
}

export interface IPurchaseReturnItem {
  id: number;
  return_id: number;
  purchase_item_id?: number;
  product_id: number;
  product_title: string;
  product_sku: string;
  variant_id?: number;
  variant_name?: string;
  variant_sku?: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reason?: string;
  created_at: string;
}

export interface IPurchaseReturnList {
  id: number;
  return_number: string;
  purchase_id: number;
  purchase_number: string;
  branch_id?: number;
  branch_name?: string;
  supplier_id: number;
  supplier_name: string;
  supplier_phone?: string;
  warehouse_id?: number;
  warehouse_name?: string;
  return_date: string;
  total_amount: number;
  refund_amount: number;
  payment_account_id?: number;
  payment_account_name?: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  reason?: string;
  items?: IPurchaseReturnItem[];
  created_at: string;
  updated_at: string;
}

export interface IViewPurchaseReturn extends IPurchaseReturnList {
  items: IPurchaseReturnItem[];
}

export type IPurchaseReturnQuery = Partial<{
  limit: number;
  skip: number;
  page: number;
  search: string;
  branch_id: number | string;
  warehouse_id: number | string;
  supplier_id: number | string;
  purchase_id: number | string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
}>;
