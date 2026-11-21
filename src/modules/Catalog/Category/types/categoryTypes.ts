import type { UploadFile } from 'antd/es/upload';

export interface ICreateCategory {
  name: string;
  parent_id?: number | string;
  description?: string;
  image?: string | UploadFile[];
  display_order?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ICategoryList {
  id: number | string;
  name: string;
  slug: string;
  parent_id?: number | string;
  parent_name?: string;
  description?: string;
  image?: string;
  display_order?: number;
  status: 'ACTIVE' | 'INACTIVE';
  children_count?: number;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IViewCategory extends ICategoryList {
  parent_name?: string;
}

export type ICategoryQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  status: 'ACTIVE' | 'INACTIVE';
  parent_id: string | number;
  is_root: boolean;
}>;
