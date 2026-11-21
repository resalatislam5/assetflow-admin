export interface IDamagedProductReportItem {
  id: number;
  stock_id: number;
  damage_date: string;
  created_at: string;
  product_id: number;
  product_title: string;
  product_sku: string;
  product_image?: string;
  variant_id?: number;
  variant_name?: string;
  variant_sku?: string;
  category_name?: string;
  brand_name?: string;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_code: string;
  damaged_quantity: number;
  unit_cost: number;
  total_loss_amount: number;
  previous_stock: number;
  current_stock: number;
  notes?: string;
  reference_id?: string;
  created_by?: number;
  created_by_name?: string;
}

export interface IDamagedProductReportSummary {
  total_records: number;
  total_damaged_quantity: number;
  total_loss_amount: number;
  total_products_affected: number;
  total_warehouses_affected: number;
}

export interface IDamagedProductReportQuery {
  from_date?: string;
  to_date?: string;
  warehouse_id?: number | string;
  product_id?: number | string;
  category_id?: number | string;
  brand_id?: number | string;
  search?: string;
  limit?: number;
  skip?: number;
  page?: number;
}

