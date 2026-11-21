export interface IBalanceSheetItem {
  id: number;
  code?: string;
  name: string;
  category: 'ASSET' | 'LIABILITY' | 'EQUITY';
  sub_category: 'CURRENT_ASSET' | 'NON_CURRENT_ASSET' | 'CURRENT_LIABILITY' | 'NON_CURRENT_LIABILITY' | 'EQUITY';
  amount: number;
  note?: string;
}

export interface IBalanceSheetSummary {
  total_current_assets: number;
  total_non_current_assets: number;
  total_assets: number;
  total_current_liabilities: number;
  total_non_current_liabilities: number;
  total_liabilities: number;
  total_equity: number;
  total_liabilities_and_equity: number;
  retained_earnings: number;
  difference: number;
  is_balanced: boolean;
}

export interface IBalanceSheetData {
  current_assets: IBalanceSheetItem[];
  non_current_assets: IBalanceSheetItem[];
  current_liabilities: IBalanceSheetItem[];
  non_current_liabilities: IBalanceSheetItem[];
  equity_items: IBalanceSheetItem[];
  summary: IBalanceSheetSummary;
}

export interface IBalanceSheetQuery {
  to_date?: string;
  from_date?: string;
  as_of_date?: string;
}

