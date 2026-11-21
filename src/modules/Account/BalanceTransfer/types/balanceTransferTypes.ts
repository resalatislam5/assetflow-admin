import type dayjs from 'dayjs';

export interface IBalanceTransferList {
  id: number;
  transfer_number: string;
  from_account_id: number;
  from_account_name?: string;
  from_account_type?: string;
  to_account_id: number;
  to_account_name?: string;
  to_account_type?: string;
  amount: string | number;
  charge_amount: string | number;
  transfer_date: string;
  reference?: string;
  notes?: string;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at?: string;
}

export type IViewBalanceTransfer = IBalanceTransferList;

export interface IBalanceTransferSummary {
  totalTransfers: number;
  totalTransferredAmount: number;
  totalCharges: number;
}

export type IBalanceTransferQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  from_account_id: number | string;
  to_account_id: number | string;
}>;

export interface ICreateBalanceTransfer {
  from_account_id: number | string;
  to_account_id: number | string;
  amount: number | string;
  charge_amount?: number | string;
  transfer_date?: string | dayjs.Dayjs;
  reference?: string;
  notes?: string;
}
