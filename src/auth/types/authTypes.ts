export type LoginTypes = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  token: string;
  user: {
    id: string | number;
    name: string;
    email: string;
    role_id: string;
    data_scope?: 'ALL' | 'BRANCH' | 'WAREHOUSE';
    branch_id?: number | null;
    warehouse_id?: number | null;
  };
};

export interface ILocationItem {
  id: number;
  name: string;
  code: string;
  is_primary?: boolean;
}

export interface ICheckPermission {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  role_id?: string;
  is_super_admin?: boolean;
  permissions: Permission[];
  logo: string;
  favicon: string;
  company_name: string;
  domain_name: string;
  support_email: string;
  address: string;
  phone: string;
  phone_2?: string;
  data_scope?: 'ALL' | 'BRANCH' | 'WAREHOUSE';
  branch_id?: number | null;
  warehouse_id?: number | null;
  branch_name?: string;
  warehouse_name?: string;
  branches?: ILocationItem[];
  warehouses?: ILocationItem[];
  enrollment_color?: string;
  short_company_name?: string;
  seal_stamp?: string;
  signature?: string;
  show_created_by?: boolean | string;
}

export interface Permission {
  module_id: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  id?: string | number;
  name: string;
}
