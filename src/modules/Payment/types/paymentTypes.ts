export type PaymentMethod =
  | 'CASH'
  | 'CARD'
  | 'MOBILE_BANKING'
  | 'GATEWAY'
  | 'LOYALTY_POINTS'
  | 'OTHER';

export type PaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'SUCCESSFUL'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'CANCELLED'
  | 'EXPIRED';

export type RefundType =
  | 'CASH'
  | 'CARD'
  | 'MOBILE_BANKING'
  | 'GATEWAY'
  | 'STORE_CREDIT';

export type RefundStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'REJECTED';

export interface IPaymentItem {
  id: number;
  branch_id: number | null;
  branch_name?: string;
  invoice_id: number;
  invoice_number?: string;
  invoice_grand_total?: number;
  invoice_paid_amount?: number;
  invoice_due_amount?: number;
  invoice_payment_status?: string;
  customer_id: number | null;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  account_id: number | null;
  account_name?: string;
  account_type?: string;
  payment_method: PaymentMethod;
  gateway: string | null;
  transaction_ref: string;
  gateway_trx_id: string | null;
  amount: number;
  tendered_amount: number | null;
  change_amount: number;
  card_type: string | null;
  card_last_four: string | null;
  bank_name: string | null;
  terminal_id: string | null;
  gateway_fee: number;
  net_amount: number;
  currency: string;
  status: PaymentStatus;
  gateway_response: Record<string, unknown> | null;
  notes: string | null;
  processed_by: number | null;
  processed_by_name?: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
  refunded_amount?: number;
}

export interface ICreatePayment {
  branch_id?: number | string;
  invoice_id: number | string;
  customer_id?: number | string;
  account_id?: number | string;
  payment_method: PaymentMethod;
  gateway?: string;
  transaction_ref?: string;
  gateway_trx_id?: string;
  amount: number;
  tendered_amount?: number;
  change_amount?: number;
  card_type?: string;
  card_last_four?: string;
  bank_name?: string;
  terminal_id?: string;
  gateway_fee?: number;
  currency?: string;
  status?: PaymentStatus;
  notes?: string;
  paid_at?: string;
}

export interface IUpdatePaymentStatus {
  status: PaymentStatus;
  notes?: string;
}

export interface IPaymentQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  branch_id?: number | string;
  invoice_id?: number | string;
  customer_id?: number | string;
  account_id?: number | string;
  payment_method?: PaymentMethod | '';
  gateway?: string;
  status?: PaymentStatus | '';
  start_date?: string;
  end_date?: string;
}

export interface IPaymentSummary {
  total_collected: number;
  total_net_collected: number;
  total_gateway_fees: number;
  total_refunded: number;
  total_count: number;
  completed_count: number;
  pending_count: number;
  failed_count: number;
}

export interface IRefundItem {
  id: number;
  refund_no: string;
  branch_id: number | null;
  branch_name?: string;
  payment_id: number;
  payment_transaction_ref?: string;
  payment_method?: PaymentMethod;
  invoice_id: number;
  invoice_number?: string;
  customer_id?: number | null;
  customer_name?: string;
  customer_phone?: string;
  account_id: number | null;
  account_name?: string;
  account_type?: string;
  amount: number;
  refund_type: RefundType;
  reason: string;
  status: RefundStatus;
  gateway_refund_trx_id: string | null;
  gateway_response: Record<string, unknown> | null;
  failure_reason: string | null;
  processed_by: number | null;
  processed_by_name?: string;
  processed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateRefund {
  payment_id: number | string;
  account_id?: number | string;
  amount: number;
  refund_type: RefundType;
  reason: string;
  status?: RefundStatus;
  gateway_refund_trx_id?: string;
  failure_reason?: string;
}

export interface IUpdateRefundStatus {
  status: RefundStatus;
  failure_reason?: string;
}

export interface IRefundQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  branch_id?: number | string;
  payment_id?: number | string;
  invoice_id?: number | string;
  account_id?: number | string;
  refund_type?: RefundType | '';
  status?: RefundStatus | '';
  start_date?: string;
  end_date?: string;
}

export interface IInvoiceSelectForPayment {
  id: number;
  invoice_number: string;
  customer_id: number | null;
  customer_name: string | null;
  customer_phone: string | null;
  grand_total_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_status: string;
  branch_id: number | null;
  branch_name: string | null;
}
