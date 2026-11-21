export interface IBranch {
  id: number;
  name: string;
  code: string;
  phone?: string | null;
  email?: string | null;
  address: string;
  city?: string | null;
  is_main_branch: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateBranch {
  name: string;
  code: string;
  phone?: string | null;
  email?: string | null;
  address: string;
  city?: string | null;
  is_main_branch?: boolean;
  is_active?: boolean;
}

export interface IBranchQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  is_active?: boolean | string;
  is_main_branch?: boolean | string;
}
