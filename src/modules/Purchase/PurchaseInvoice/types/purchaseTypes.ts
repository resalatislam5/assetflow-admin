export interface IPurchaseItemInput {
  product_id: number | string;
  variant_id?: number | string;
  quantity: number;
  unit_cost: number;
  purchase_price?: number;
  base_price?: number;
  special_price?: number;
  batch_number?: string;
  expiry_date?: string;
}

export interface ICreatePurchase {
  purchase_number?: string;
  branch_id?: number | string;
  supplier_id: number | string;
  warehouse_id?: number | string;
  purchase_date?: string;
  discount_amount?: number;
  shipping_cost?: number;
  paid_amount?: number;
  status?: 'PENDING' | 'ORDERED' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELLED' | 'RETURNED';
  payment_status?: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
  payment_account_id?: number | string;
  notes?: string;
  items: IPurchaseItemInput[];
}

export interface IPurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  product_title?: string;
  product_sku?: string;
  variant_id?: number;
  variant_name?: string;
  variant_sku?: string;
  quantity: number;
  unit_cost: number;
  purchase_price: number;
  total_cost?: number;
  subtotal: number;
  batch_number?: string;
  expiry_date?: string;
}

export interface IPurchaseList {
  id: number;
  purchase_number: string;
  branch_id?: number;
  branch_name?: string;
  supplier_id: number;
  supplier_name: string;
  supplier_phone?: string;
  supplier_company?: string;
  warehouse_id?: number;
  warehouse_name?: string;
  purchase_date: string;
  subtotal_amount: number;
  discount_amount: number;
  shipping_cost: number;
  grand_total_amount?: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  status: 'PENDING' | 'ORDERED' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELLED' | 'RETURNED';
  payment_status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
  payment_account_id?: number;
  payment_account_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: IPurchaseItem[];
}

export interface IViewPurchase extends IPurchaseList {
  items: IPurchaseItem[];
}

export type IPurchaseQuery = Partial<{
  limit: number;
  skip: number;
  page: number;
  search: string;
  branch_id: number | string;
  supplier_id: number | string;
  warehouse_id: number | string;
  status: 'PENDING' | 'ORDERED' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELLED' | 'RETURNED';
  payment_status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
}>;
