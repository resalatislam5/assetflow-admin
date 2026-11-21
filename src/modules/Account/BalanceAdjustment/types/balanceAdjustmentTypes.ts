import type dayjs from 'dayjs';

export type AdjustmentType = 'INCREASE' | 'DECREASE';

export interface IBalanceAdjustmentList {
  id: number;
  adjustment_number: string;
  account_id: number;
  account_name?: string;
  account_type?: string;
  type: AdjustmentType;
  amount: string | number;
  adjustment_date: string;
  reason: string;
  notes?: string;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at?: string;
}

export type IViewBalanceAdjustment = IBalanceAdjustmentList;

export interface IBalanceAdjustmentSummary {
  totalAdjustments: number;
  totalIncreased: number;
  totalDecreased: number;
}

export type IBalanceAdjustmentQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  account_id: number | string;
  type: AdjustmentType;
}>;

export interface ICreateBalanceAdjustment {
  account_id: number | string;
  type: AdjustmentType;
  amount: number | string;
  adjustment_date?: string | dayjs.Dayjs;
  reason: string;
  notes?: string;
}
