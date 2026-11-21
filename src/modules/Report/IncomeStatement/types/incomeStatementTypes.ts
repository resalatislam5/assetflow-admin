export interface IIncomeStatementLine {
  head_id: number;
  head_code?: string;
  head_name: string;
  account_category: 'REVENUE' | 'EXPENSE';
  is_cogs: boolean;
  total_debit: number;
  total_credit: number;
  net_amount: number;
}

export interface IIncomeStatementSummary {
  total_revenue: number;
  total_cogs: number;
  gross_profit: number;
  gross_profit_margin: number;
  total_operating_expense: number;
  total_expense: number;
  net_profit: number;
  net_profit_margin: number;
  status: 'PROFIT' | 'LOSS' | 'BREAK_EVEN';
}

export interface IIncomeStatementData {
  revenue_heads: IIncomeStatementLine[];
  cogs_heads: IIncomeStatementLine[];
  operating_expense_heads: IIncomeStatementLine[];
  summary: IIncomeStatementSummary;
}

export interface IIncomeStatementQuery {
  from_date?: string;
  to_date?: string;
}

