export type ReturnStatus =
  | 'PENDING'
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PICKED_UP'
  | 'RECEIVED'
  | 'REFUNDED'
  | 'COMPLETED';

export type ReturnReason =
  | 'DEFECTIVE'
  | 'WRONG_ITEM'
  | 'EXCHANGE'
  | 'CUSTOMER_RETURN'
  | 'DAMAGED_IN_TRANSIT'
  | 'SIZE_FIT_ISSUE'
  | 'NOT_AS_DESCRIBED'
  | 'CHANGE_OF_MIND'
  | 'OTHER';

export type RefundStatus = 'PENDING' | 'PROCESSED' | 'COMPLETED' | 'REJECTED';

export type ReturnDeliveryChargeTreatment = 'DEDUCT_DELIVERY' | 'REFUND_FULL';

export interface IOrderReturnItem {
  id: number | string;
  return_id: number | string;
  order_item_id?: number | string;
  invoice_item_id?: number | string;
  quantity: number;
  refund_amount: number;
  reason?: string;
  product_title?: string;
  sku?: string;
  variant_name?: string;
  unit_price?: number;
}

export interface IOrderReturn {
  id: number | string;
  return_number: string;
  order_id?: number | string;
  invoice_id?: number | string;
  branch_id?: number | string;
  branch_name?: string;
  warehouse_id?: number | string;
  warehouse_name?: string;
  customer_id: number | string;
  return_date?: string;
  return_reason: ReturnReason;
  status: ReturnStatus;
  refund_status: RefundStatus;
  refund_amount: number;
  delivery_charge_treatment?: ReturnDeliveryChargeTreatment;
  customer_notes?: string;
  admin_notes?: string;
  notes?: string;
  processed_by_admin_id?: number | string;
  created_at: string;
  updated_at: string;
  order_number?: string;
  invoice_number?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  admin_name?: string;
  items?: IOrderReturnItem[];
}

export interface ICreateOrderReturn {
  order_id: number | string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  customer_id: number | string;
  return_date?: string;
  return_reason: ReturnReason;
  refund_amount?: number;
  delivery_charge_treatment?: ReturnDeliveryChargeTreatment;
  customer_notes?: string;
  admin_notes?: string;
  items: Array<{
    order_item_id: number | string;
    quantity: number;
    refund_amount: number;
    reason?: string;
  }>;
}

export interface IUpdateReturnStatus {
  status: ReturnStatus;
  refund_status?: RefundStatus;
  refund_amount?: number;
  delivery_charge_treatment?: ReturnDeliveryChargeTreatment;
  admin_notes?: string;
}

export interface IOrderReturnQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  status?: ReturnStatus | '';
  refund_status?: RefundStatus | '';
  order_id?: number | string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  customer_id?: number | string;
}

export interface IOrderReturnSummary {
  totalReturns: number;
  requestedReturns: number;
  approvedReturns: number;
  rejectedReturns: number;
  refundedReturns: number;
  completedReturns: number;
  totalRefundAmount: number;
}

export type IInvoiceReturn = IOrderReturn;
export type IInvoiceReturnItem = IOrderReturnItem;
export type ICreateInvoiceReturn = ICreateOrderReturn;
export type IUpdateInvoiceReturnStatus = IUpdateReturnStatus;
export type IInvoiceReturnQuery = IOrderReturnQuery;
export type IInvoiceReturnSummary = IOrderReturnSummary;
