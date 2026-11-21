export type CustomerRefundPaymentType =
  | 'CASH'
  | 'BANK'
  | 'MOBILE_BANKING'
  | 'CARD'
  | 'CHEQUE'
  | 'OTHER';
export type CustomerRefundChargeType = 'PERCENTAGE' | 'FIXED';
export type CustomerRefundReason =
  | 'ORDER_CANCELLED'
  | 'ORDER_RETURN'
  | 'OVERPAYMENT'
  | 'PRODUCT_UNAVAILABLE'
  | 'OTHER';
export type CustomerRefundStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface ICreateCustomerRefund {
  customer_id: number | string;
  branch_id?: number | string;
  order_id?: number | string;
  invoice_id?: number | string;
  return_id?: number | string;
  account_id: number | string;
  payment_type: CustomerRefundPaymentType;
  amount: number;
  charge_type?: CustomerRefundChargeType;
  charge_rate?: number;
  refund_date?: string;
  refund_reason?: CustomerRefundReason;
  status?: CustomerRefundStatus;
  reference?: string;
  customer_account_details?: string;
  notes?: string;
  image?: string;
}

export interface ICustomerRefundListItem {
  id: number;
  refund_number: string;
  refund_date: string;
  customer_id: number;
  customer_code?: string;
  customer_name?: string;
  customer_phone?: string;
  branch_id?: number;
  branch_name?: string;
  order_id?: number;
  invoice_id?: number;
  order_number?: string;
  invoice_number?: string;
  return_id?: number;
  return_number?: string;
  account_id: number;
  account_name: string;
  account_type: string;
  payment_type: CustomerRefundPaymentType;
  amount: number;
  charge_amount: number;
  net_amount: number;
  refund_reason: CustomerRefundReason;
  status: CustomerRefundStatus;
  reference?: string;
  customer_account_details?: string;
  notes?: string;
  image?: string;
  created_by_name?: string;
  created_at: string;
}

export interface ICustomerRefundDetail extends ICustomerRefundListItem {
  charge_type: CustomerRefundChargeType;
  charge_rate: number;
  order_grand_total?: number;
  order_paid_amount?: number;
  order_status?: string;
  notes?: string;
  image?: string;
  created_by?: number | string;
  updated_at?: string;
}

export type IViewCustomerRefund = ICustomerRefundDetail;

export type ICustomerRefundQuery = Partial<{
  limit: number;
  skip: number;
  page: number;
  search: string;
  customer_id: number | string;
  branch_id: number | string;
  order_id: number | string;
  invoice_id: number | string;
  return_id: number | string;
  account_id: number | string;
  payment_type: CustomerRefundPaymentType | '';
  refund_reason: CustomerRefundReason | '';
  status: CustomerRefundStatus | '';
}>;

export interface ICustomerRefundSummary {
  totalRefunds: number;
  totalNet: number;
  totalCharges: number;
  totalCount: number;
  cashTotal: number;
  bankTotal: number;
  mobileBankingTotal: number;
}
