export interface IGeneralLedgerItem {
  id: number;
  voucher_no: string;
  transaction_date: string;
  head_id: number;
  head_code?: string;
  head_name: string;
  account_category: string;
  account_id?: number;
  account_name?: string;
  account_type?: string;
  account_number?: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  debit_amount: number;
  credit_amount: number;
  running_balance: number;
  source_type: string;
  source_id?: string;
  description: string;
  customer_name?: string;
  customer_code?: string;
  supplier_name?: string;
  created_by_name?: string;
  created_at: string;
}

export interface IGeneralLedgerSummary {
  opening_balance: number;
  total_debit: number;
  total_credit: number;
  net_change: number;
  closing_balance: number;
  head_name?: string;
  head_code?: string;
  account_category?: string;
}

export interface IGeneralLedgerQuery {
  head_id?: string | number;
  account_id?: string | number;
  account_category?: string;
  from_date?: string;
  to_date?: string;
  type?: 'DEBIT' | 'CREDIT';
  source_type?: string;
  search?: string;
  limit?: number;
  skip?: number;
  page?: number;
}
