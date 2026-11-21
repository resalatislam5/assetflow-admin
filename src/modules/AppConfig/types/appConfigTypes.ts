import type { UploadFile } from 'antd';

export interface IAppConfig {
  id: number;
  company_name: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  favicon?: string;
  currency?: string;
  currency_symbol?: string;
  default_locale?: string;
  safety_stock?: number;
  invoice_footer_text?: string;
}

export interface ICreateAppConfig {
  company_name?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: File | string | UploadFile[];
  favicon?: File | string | UploadFile[];
  currency?: string;
  currency_symbol?: string;
  default_locale?: string;
  safety_stock?: number;
  invoice_footer_text?: string;
}
