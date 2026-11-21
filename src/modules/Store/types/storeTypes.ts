export type StockMovementType = 'STOCK_IN' | 'STOCK_OUT' | 'DAMAGED';

export interface IStockLog {
  id?: number | string;
  type: StockMovementType;
  quantity: number;
  unit_price?: number;
  amount?: number;
  date?: string | Date;
  remarks?: string;
  created_by?: {
    id?: number | string;
    name: string;
    email: string;
  } | string;
  created_by_name?: string;
  created_by_email?: string;
  created_at?: string;
  createdAt?: string;
}

export interface IStoreProduct {
  id: number | string;
  name: string;
  code: string;
  unit_price: number;
  current_stock: number;
  stock_in: number;
  stock_out: number;
  damaged_quantity: number;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_by?: {
    id?: number | string;
    name: string;
    email: string;
  };
  created_by_name?: string;
  created_by_email?: string;
  stock_logs?: IStockLog[];
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateStoreProduct {
  name: string;
  code: string;
  unit_price: number;
  initial_stock?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IUpdateStoreProduct {
  name?: string;
  code?: string;
  unit_price?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IStockInPayload {
  quantity: number;
  unit_price?: number;
  date?: string | Date;
  remarks?: string;
}

export interface IStockOutPayload {
  quantity: number;
  amount?: number;
  date?: string | Date;
  remarks?: string;
}

export interface IDamagedPayload {
  quantity: number;
  date?: string | Date;
  remarks?: string;
}

export interface IStoreSummary {
  totalProducts: number;
  totalStockIn: number;
  totalStockOut: number;
  totalDamaged: number;
  totalCurrentStock: number;
  totalValuation: number;
}

export interface IStoreProductQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
