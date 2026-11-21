export interface ICreateRole {
  name: string;
  permissions: (IPermission | undefined)[];
  status: 'ACTIVE' | 'INACTIVE';
}
export interface IRoleList {
  id: string | number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IViewRole {
  id: string | number;
  name: string;
  permissions: IPermission[];
  status: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export type IRoleQuery = Partial<{
  limit: number;
  page: number;
  search: string;
}>;

export interface IPermission {
  module_id: string | number;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  selected?: boolean;
  id?: string | number;
  module_name?: string;
}
