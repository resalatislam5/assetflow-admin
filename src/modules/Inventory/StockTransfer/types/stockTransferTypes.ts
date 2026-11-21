export type StockTransferStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'SENT'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'PARTIALLY_RECEIVED'
  | 'CANCELLED';

export interface IStockTransferItemPayload {
  product_id: number;
  variant_id?: number;
  batch_id?: number;
  quantity_sent: number;
  quantity_received?: number;
}

export interface IStockTransferItem extends IStockTransferItemPayload {
  id: number;
  transfer_id: number;
  product_title?: string;
  product_sku?: string;
  variant_name?: string;
  variant_sku?: string;
  batch_number?: string;
  created_at: string;
}

export interface ICreateStockTransferPayload {
  from_branch_id?: number;
  to_branch_id?: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  status?: 'DRAFT' | 'PENDING' | 'SENT' | 'IN_TRANSIT';
  notes?: string;
  items: IStockTransferItemPayload[];
}

export interface IReceiveStockTransferItemInput {
  item_id: number;
  quantity_received: number;
}

export interface IReceiveStockTransferPayload {
  items?: IReceiveStockTransferItemInput[];
  notes?: string;
}

export interface IStockTransfer {
  id: number;
  transfer_number: string;
  from_branch_id?: number;
  from_branch_name?: string;
  to_branch_id?: number;
  to_branch_name?: string;
  from_warehouse_id: number;
  from_warehouse_name?: string;
  from_warehouse_code?: string;
  to_warehouse_id: number;
  to_warehouse_name?: string;
  to_warehouse_code?: string;
  status: StockTransferStatus;
  notes?: string;
  created_by?: number;
  created_by_name?: string;
  received_by?: number;
  received_by_name?: string;
  sent_at?: string;
  received_at?: string;
  created_at: string;
  updated_at: string;
  items?: IStockTransferItem[];
  items_count?: number;
  total_quantity_sent?: number;
  total_quantity_received?: number;
}

export interface IStockTransferQuery {
  page?: number;
  limit?: number;
  skip?: number;
  search?: string;
  from_branch_id?: number | string;
  to_branch_id?: number | string;
  from_warehouse_id?: number | string;
  to_warehouse_id?: number | string;
  status?: string;
}
