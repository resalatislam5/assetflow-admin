import type { TransactionType } from '../../../Inventory/Stock/types/stockTypes';

export type { TransactionType };

export interface IStockLog {
  id: number | string;
  stock_id: number | string;
  branch_id?: number | string;
  branch_name?: string;
  warehouse_id?: number | string;
  batch_id?: number | string;
  batch_number?: string;
  transaction_type: TransactionType;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  product_title?: string;
  product_sku?: string;
  warehouse_name?: string;
  variant_name?: string;
  created_by_name?: string;
  created_by_email?: string;
  created_at: string;
}

export interface IStockReportQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  product_id?: number | string;
  stock_id?: number | string;
  batch_id?: number | string;
  transaction_type?: string;
}
