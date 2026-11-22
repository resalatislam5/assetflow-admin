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

export interface IStockAdjustment {
  id: number;
  stock_id: number;
  branch_id?: number;
  branch_name?: string;
  warehouse_id: number;
  warehouse_name: string;
  product_id: number;
  product_title: string;
  product_sku: string;
  product_image?: string;
  variant_id?: number;
  batch_id?: number;
  batch_number?: string;
  transaction_type: TransactionType;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  reference_id?: string;
  notes?: string;
  created_by_user_id?: number;
  created_by_user_name?: string;
  created_at: string;
}

export interface ICreateStockAdjustmentPayload {
  branch_id?: number;
  warehouse_id?: number;
  product_id: number;
  variant_id?: number;
  batch_id?: number;
  transaction_type: 'MANUAL_ADJUSTMENT' | 'DAMAGED';
  quantity_change: number;
  notes?: string;
}

export interface IStockAdjustmentQuery {
  page?: number;
  limit?: number;
  search?: string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  product_id?: number | string;
  transaction_type?: string;
}
