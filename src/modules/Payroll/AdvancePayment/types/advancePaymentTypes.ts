export interface IAdvancePayment {
  _id: string;
  employee_name: string;
  employee_code: string;
  acc_id: string;
  account_type: 'CASH' | 'BANK' | 'MOBILE_BANKING';
  voucher_no: string;
  date: string;
  amount: number;
  deduction_per_month: number;
  remaining_amount: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  transaction_charge?: number;
  createdAt: string;
  updatedAt: string;
  action_by_name?: string;
}

export interface ICreateAdvancePayment {
  employee_id: string;
  acc_id: string;
  account_type: 'CASH' | 'BANK' | 'MOBILE_BANKING';
  voucher_no: string;
  date: string;
  amount: number;
  deduction_per_month: number;
  reason?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  transaction_charge?: number;
}

export type IAdvancePaymentQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  employee_id: string;
  from_date: string;
  to_date: string;
}>;
