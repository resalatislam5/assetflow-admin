export type TDataScope = 'ALL' | 'BRANCH' | 'WAREHOUSE';

export interface IUserList {
  id: number;
  name: string;
  email: string;
  password?: string;
  role_id: number;
  role_name?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  type: 'ADMIN' | 'EMPLOYEE';
  phone: string;
  data_scope: TDataScope;
  branch_id?: number | null;
  branch_name?: string | null;
  warehouse_id?: number | null;
  warehouse_name?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type IUserQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  status: string;
  role_id: number;
  data_scope: string;
  branch_id: number;
  warehouse_id: number;
}>;

export interface ICreateUser {
  name: string;
  email: string;
  password?: string;
  role_id: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  type: 'ADMIN' | 'EMPLOYEE';
  phone: string;
  data_scope: TDataScope;
  branch_id?: number | null;
  warehouse_id?: number | null;
  branch_ids?: number[];
  warehouse_ids?: number[];
}
