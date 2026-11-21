import type { UploadFile } from 'antd/es/upload';

export interface ICreateBrand {
  name: string;
  logo?: string | UploadFile[];
  website?: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IBrandList {
  id: number | string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IViewBrand extends IBrandList {}

export type IBrandQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  status: 'ACTIVE' | 'INACTIVE';
}>;
