export interface IStockBatchReportItem {
  id: number;
  batch_number: string;
  created_at: string;
  branch_id?: number;
  branch_name?: string;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_code: string;
  product_id: number;
  product_title: string;
  product_sku: string;
  product_image?: string;
  variant_id?: number;
  variant_name?: string;
  variant_sku?: string;
  category_name?: string;
  brand_name?: string;
  purchase_id?: number;
  purchase_number?: string;
  supplier_name?: string;
  quantity: number;
  remaining_quantity: number;
  consumed_quantity: number;
  purchase_price: number;
  mrp?: number;
  mfg_date?: string;
  expiry_date?: string;
  total_batch_cost: number;
  remaining_value: number;
  consumed_value: number;
  is_opening_stock: boolean;
  status: 'ACTIVE' | 'DEPLETED';
  notes?: string;
}

export interface IStockBatchReportSummary {
  total_batches: number;
  total_initial_quantity: number;
  total_remaining_quantity: number;
  total_consumed_quantity: number;
  total_inventory_value: number;
  total_batch_cost: number;
  active_batches: number;
  depleted_batches: number;
}

export interface IStockBatchReportQuery {
  from_date?: string;
  to_date?: string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  product_id?: number | string;
  category_id?: number | string;
  brand_id?: number | string;
  supplier_id?: number | string;
  status?: 'ACTIVE' | 'DEPLETED' | string;
  is_opening_stock?: boolean | string;
  search?: string;
  limit?: number;
  skip?: number;
  page?: number;
}
