export interface IGeneralJournalItem {
  id: number;
  voucher_no?: string;
  transaction_date?: string;
  head_id: number;
  head_code?: string;
  head_name: string;
  account_category?: string;
  account_id?: number;
  account_name?: string;
  account_type?: string;
  account_code?: string;
  account_number?: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  balance_after?: number;
  source_type: string;
  source_id?: string;
  description: string;
  customer_name?: string;
  customer_code?: string;
  supplier_name?: string;
  created_by_name?: string;
  created_at: string;
}

export interface IGeneralJournalSummary {
  total_debit: number;
  total_credit: number;
  net_flow: number;
}

export type IGeneralJournalQuery = Partial<{
  head_id: number | string;
  account_id: number | string;
  from_date: string;
  to_date: string;
  type: 'DEBIT' | 'CREDIT';
  source_type: string;
  search: string;
  limit: number;
  skip: number;
  page: number;
}>;
