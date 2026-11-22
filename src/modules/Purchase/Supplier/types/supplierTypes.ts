export interface ICreateSupplier {
  name: string;
  company_name?: string;
  phone: string;
  email?: string;
  address?: string;
  opening_balance?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ISupplierList {
  id: number;
  name: string;
  company_name?: string;
  phone?: string;
  email?: string;
  opening_balance: number;
  current_balance: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export interface IViewSupplier extends ISupplierList {
  address?: string;
  updated_at?: string;
  total_purchases?: number;
  total_paid?: number;
}

export type ISupplierQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  status: 'ACTIVE' | 'INACTIVE';
}>;
