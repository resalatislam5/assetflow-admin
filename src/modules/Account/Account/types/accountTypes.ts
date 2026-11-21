export type AccountType = 'CASH' | 'BANK' | 'MOBILE_BANKING';
export type AccountStatus = 'ACTIVE' | 'INACTIVE';

export interface IAccountList {
  id: number;
  head_id: number;
  head_name?: string;
  account_category?: string;
  name: string;
  account_type: AccountType;
  account_number?: string;
  bank_name?: string;
  branch_name?: string;
  opening_balance: string | number;
  current_balance: string | number;
  status: AccountStatus;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export type IAccountQuery = Partial<{
  limit: number;
  page: number;
  skip: number;
  search: string;
  status: AccountStatus;
  head_id: number | string;
  account_type: AccountType;
}>;

export interface ICreateAccount {
  head_id?: number;
  name: string;
  account_type: AccountType;
  account_number?: string;
  bank_name?: string;
  branch_name?: string;
  opening_balance?: number | string;
  status?: AccountStatus;
}

export interface IAccountSummary {
  totalAccounts: number;
  totalBalance: number;
  totalCash: number;
  totalBank: number;
  totalMobileBanking: number;
}

export const ACCOUNT_TYPE_OPTIONS = [
  { label: 'Cash Account', value: 'CASH' },
  { label: 'Bank Account', value: 'BANK' },
  { label: 'Mobile Banking', value: 'MOBILE_BANKING' },
];
