export interface ITrialBalanceItem {
  head_id: number;
  head_code?: string;
  head_name: string;
  account_category: string;
  total_debit: number;
  total_credit: number;
  net_change: number;
  status: string;
}

export interface ITrialBalanceSummary {
  total_heads: number;
  total_debits: number;
  total_credits: number;
  difference: number;
  is_balanced: boolean;
}

export type ITrialBalanceQuery = Partial<{
  from_date: string;
  to_date: string;
  account_category: string;
  search: string;
  limit: number;
  skip: number;
  page: number;
}>;
