import type { UploadFile } from 'antd/es/upload';

export interface ICreateCustomer {
  branch_id?: number | null;
  customer_code?: string;
  customer_type?: 'RETAIL' | 'WHOLESALE' | 'CORPORATE' | 'WALK_IN';
  first_name: string;
  last_name?: string;
  company_name?: string;
  email?: string;
  phone: string;
  address?: string;
  credit_limit?: number;
  credit_period_days?: number;
  opening_balance?: number;
  opening_balance_type?: 'DEBIT' | 'CREDIT';
  current_balance?: number;
  avatar?: string | UploadFile[];
  upload_avatar?: UploadFile[];
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

export interface ICustomer {
  id: number;
  branch_id?: number | null;
  branch_name?: string;
  branch_code?: string;
  customer_code: string;
  customer_type: 'RETAIL' | 'WHOLESALE' | 'CORPORATE' | 'WALK_IN';
  first_name: string;
  last_name?: string;
  company_name?: string;
  email?: string;
  phone: string;
  address?: string;
  credit_limit: number;
  credit_period_days: number;
  opening_balance: number;
  opening_balance_type: 'DEBIT' | 'CREDIT';
  current_balance: number;
  avatar?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  created_at: string;
  updated_at: string;
}

export type ICustomerList = ICustomer;
export type IViewCustomer = ICustomer;

export interface ICustomerQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  status?: string;
  customer_type?: string;
  branch_id?: number | string;
}

export interface ICustomerOption {
  id: number;
  branch_id?: number | null;
  branch_name?: string;
  customer_code?: string;
  first_name: string;
  last_name?: string;
  company_name?: string;
  phone: string;
  email?: string;
  current_balance?: number;
  credit_limit?: number;
}
