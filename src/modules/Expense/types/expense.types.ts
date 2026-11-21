export interface IExpenseVoucherItem {
  id?: number;
  expense_id?: number;
  head_id: number;
  head_name?: string;
  amount: number;
  description?: string;
}

export interface IExpense {
  id: number;
  voucher_no: string;
  account_id: number;
  account_name: string;
  account_type?: string;
  expense_date: string;
  total_amount: number;
  total_items: number;
  notes?: string;
  receipt_image?: string;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  expense_head_names?: string[];
  items?: IExpenseVoucherItem[];
}

export interface IExpenseQuery {
  limit?: number;
  skip?: number;
  search?: string;
  account_id?: number | string;
  head_id?: number | string;
  from_date?: string;
  to_date?: string;
}

export interface ICreateExpenseItemBody {
  head_id: number;
  amount: number;
  description?: string;
}

export interface ICreateExpenseBody {
  voucher_no?: string;
  account_id: number;
  expense_date: string;
  notes?: string;
  receipt_image?: string;
  items: ICreateExpenseItemBody[];
}
