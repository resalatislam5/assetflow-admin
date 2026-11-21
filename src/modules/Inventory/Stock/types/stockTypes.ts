export type TransactionType =
  | 'PURCHASE_RECEIVED'
  | 'PURCHASE_RETURN'
  | 'POS_SALE'
  | 'POS_RETURN'
  | 'ORDER_RESERVATION'
  | 'ORDER_SHIPPED'
  | 'ORDER_CANCELLED'
  | 'ORDER_RETURNED'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'
  | 'MANUAL_ADJUSTMENT'
  | 'DAMAGED'
  | 'EXPIRED'
  | 'OPENING_STOCK';

export type StockStatusType = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface IStock {
  id: number | string;
  branch_id?: number | string;
  branch_name?: string;
  warehouse_id: number | string;
  product_id: number | string;
  variant_id?: number | string;
  quantity_on_hand: number;
  quantity_reserved: number;
  available_quantity?: number;
  safety_stock: number;
  bin_location?: string;
  warehouse_name?: string;
  warehouse_code?: string;
  product_title?: string;
  product_slug?: string;
  product_sku?: string;
  category_name?: string;
  brand_name?: string;
  variant_name?: string;
  variant_sku?: string;
  stock_status?: StockStatusType;
  updated_at?: string;
  stock_logs?: IStockLog[];
}

export interface IAdjustStockPayload {
  stock_id?: number | string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  product_id?: number | string;
  variant_id?: number | string;
  quantity_change: number;
  transaction_type: TransactionType;
  safety_stock?: number;
  notes?: string;
}

export interface ISetSafetyStockPayload {
  stock_id?: number | string;
  warehouse_id?: number | string;
  product_id?: number | string;
  variant_id?: number | string;
  safety_stock: number;
}

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

export interface IInventorySummary {
  totalWarehouses: number;
  totalStockOnHand: number;
  totalReservedStock: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface IStockQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  product_id?: number | string;
  stock_status?: StockStatusType | '';
}
