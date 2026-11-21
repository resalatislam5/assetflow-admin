
export interface IPayroll {
  id?: string | number;
  _id?: string;
  employee_id: string;
  department_id?: string;
  employee_code?: string;
  employee_name?: string;
  department_name?: string;
  bank_name?: string;
  account_no?: string;
  account_name?: string;
  branch_name?: string;
  routing_no?: string;
  month_year: string;
  basic_salary: number;
  bonus: number;
  deductions?: { name: string; amount: number }[];
  additions?: { name: string; amount: number }[];
  advance_deduction: number;
  advance_payment_id?: string;
  net_salary: number;
  acc_id?: string;
  account_type?: 'CASH' | 'BANK' | 'MOBILE_BANKING';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  payment_status: 'UNPAID' | 'PARTIAL' | 'PAID';
  paid_amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePayroll {
  employee_ids?: string[];
  department_id?: string;
  month_year: string;
  acc_id?: string;
  account_type?: 'CASH' | 'BANK' | 'MOBILE_BANKING';
}

export type IPayrollQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  employee_id: string;
  month_year: string;
  status: string;
  payment_status: string;
}>;

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ISingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
