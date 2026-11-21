export type CustomerLedgerType = 'DEBIT' | 'CREDIT';

export type CustomerLedgerTransactionType =
  | 'OPENING_BALANCE'
  | 'ORDER_INVOICE'
  | 'ORDER_PAYMENT'
  | 'ORDER_RETURN'
  | 'ORDER_REFUND'
  | 'CUSTOMER_REFUND'
  | 'BALANCE_ADJUSTMENT'
  | 'MANUAL';

export interface ICustomerLedgerItem {
  id: number;
  customer_id: number;
  customer_name?: string;
  customer_code?: string;
  customer_phone?: string;
  branch_id?: number;
  branch_name?: string;
  voucher_no: string;
  transaction_date: string;
  transaction_type: CustomerLedgerTransactionType;
  invoice_id?: number;
  invoice_number?: string;
  order_id?: number;
  order_number?: string;
  payment_id?: number;
  receipt_number?: string;
  type: CustomerLedgerType;
  amount: number;
  balance: number;
  description?: string;
  created_by_name?: string;
  created_at: string;
}

export interface ICustomerLedgerSummary {
  total_debit: number;
  total_credit: number;
  current_balance: number;
}

export type ICustomerLedgerQuery = Partial<{
  customer_id: string | number;
  branch_id: string | number;
  from_date: string;
  to_date: string;
  type: CustomerLedgerType;
  transaction_type: CustomerLedgerTransactionType;
  search: string;
  limit: number;
  skip: number;
  page: number;
}>;
