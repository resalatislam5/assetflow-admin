export interface ICreateSupplierPayment {
  branch_id?: number | string;
  supplier_id: number | string;
  purchase_id?: number | string;
  account_id: number | string;
  amount: number;
  payment_method?: 'CASH' | 'BANK' | 'MOBILE_BANKING' | 'CHEQUE' | 'OTHER';
  payment_date?: string;
  reference?: string;
  notes?: string;
  image?: string;
}

export interface ISupplierPaymentList {
  id: number;
  payment_number: string;
  branch_id?: number;
  branch_name?: string;
  supplier_id: number;
  supplier_name: string;
  supplier_phone?: string;
  purchase_id?: number;
  purchase_number?: string;
  account_id: number;
  account_name: string;
  account_type: string;
  amount: number;
  payment_method: 'CASH' | 'BANK' | 'MOBILE_BANKING' | 'CHEQUE' | 'OTHER';
  payment_date: string;
  reference?: string;
  notes?: string;
  image?: string;
  created_at: string;
  updated_at?: string;
}

export interface IViewSupplierPayment extends ISupplierPaymentList {}

export type ISupplierPaymentQuery = Partial<{
  limit: number;
  skip: number;
  page: number;
  search: string;
  branch_id: number | string;
  supplier_id: number | string;
  account_id: number | string;
  payment_method: 'CASH' | 'BANK' | 'MOBILE_BANKING' | 'CHEQUE' | 'OTHER';
}>;
