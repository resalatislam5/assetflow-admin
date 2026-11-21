import type { UploadFile } from 'antd/es/upload';

export interface IProductImage {
  id?: number | string;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
  display_order?: number;
}

export interface IProductVariant {
  id?: number | string;
  variant_name: string;
  sku: string;
  short_code?: string;
  barcode?: string;
  purchase_price?: number;
  price: number;
  mrp?: number;
  wholesale_price?: number;
  min_selling_price?: number;
  special_price?: number;
  image_url?: string;
  attributes_json?: Record<string, unknown>;
  is_active?: boolean;
}

export interface ICreateProduct {
  title: string;
  slug?: string;
  short_code?: string;
  product_type?: 'STANDARD' | 'SERVICE' | 'COMBO';
  tracking_type?: 'NONE' | 'SERIAL' | 'BATCH';
  category_id?: number | string;
  brand_id?: number | string;
  unit_id?: number | string;
  unit?: string;
  allow_fractional_qty?: boolean;
  sku?: string;
  barcode?: string;
  short_description?: string;
  description?: string;
  purchase_price?: number;
  base_price: number;
  mrp?: number;
  wholesale_price?: number;
  min_selling_price?: number;
  special_price?: number;
  special_price_start?: string;
  special_price_end?: string;
  vat_rate?: number;
  tax_type?: 'INCLUSIVE' | 'EXCLUSIVE';
  alert_quantity?: number;
  has_warranty?: boolean;
  warranty_days?: number;
  has_variants?: boolean;
  weight_grams?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  is_featured?: boolean;
  is_pos_favorite?: boolean;
  pos_display_order?: number;
  tags?: string[];
  upload_thumbnail?: UploadFile[];
  upload_images?: UploadFile[];
  images?: IProductImage[];
  variants?: IProductVariant[];
}

export interface IProductList {
  id: number | string;
  title: string;
  slug: string;
  short_code?: string;
  product_type?: 'STANDARD' | 'SERVICE' | 'COMBO';
  tracking_type?: 'NONE' | 'SERIAL' | 'BATCH';
  sku: string;
  barcode?: string;
  category_id?: number | string;
  category_name?: string;
  brand_id?: number | string;
  brand_name?: string;
  unit_id?: number | string;
  unit?: string;
  allow_fractional_qty?: boolean;
  purchase_price?: number;
  base_price: number;
  mrp?: number;
  wholesale_price?: number;
  min_selling_price?: number;
  special_price?: number;
  special_price_start?: string;
  special_price_end?: string;
  vat_rate?: number;
  tax_type?: 'INCLUSIVE' | 'EXCLUSIVE';
  alert_quantity?: number;
  has_warranty?: boolean;
  warranty_days?: number;
  has_variants?: boolean;
  variants_count?: number;
  weight_grams?: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  is_featured?: boolean;
  is_pos_favorite?: boolean;
  pos_display_order?: number;
  primary_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IViewProduct extends IProductList {
  short_description?: string;
  description?: string;
  tags?: string[];
  images?: IProductImage[];
  variants?: IProductVariant[];
}

export type IProductQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  product_type: 'STANDARD' | 'SERVICE' | 'COMBO';
  tracking_type: 'NONE' | 'SERIAL' | 'BATCH';
  category_id: string | number;
  brand_id: string | number;
  is_featured: boolean;
  is_pos_favorite: boolean;
}>;
