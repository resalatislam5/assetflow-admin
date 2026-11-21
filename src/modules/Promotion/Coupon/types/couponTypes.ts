export type CouponDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface ICouponList {
  id: number;
  code: string;
  title: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  min_item_quantity?: number;
  branch_id?: number;
  branch_name?: string;
  warehouse_id?: number;
  warehouse_name?: string;
  member_only: boolean;
  requires_manager_approval: boolean;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  applicable_days?: number[];
  usage_limit_total?: number;
  usage_limit_per_customer: number;
  usage_count: number;
  is_active: boolean;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateCoupon {
  code: string;
  title: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  min_item_quantity?: number;
  branch_id?: number;
  warehouse_id?: number;
  member_only?: boolean;
  requires_manager_approval?: boolean;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  applicable_days?: number[];
  usage_limit_total?: number;
  usage_limit_per_customer?: number;
  is_active: boolean;
}

export type ICouponQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  discount_type: CouponDiscountType;
  is_active: boolean | string;
  branch_id: number | string;
  warehouse_id: number | string;
  member_only: boolean | string;
  requires_manager_approval: boolean | string;
}>;

export interface ICouponSelect {
  id: number;
  code: string;
  title: string;
  discount_type: CouponDiscountType;
  discount_value: number;
}

export interface ICouponUsage {
  id: number;
  coupon_id: number;
  customer_id?: number;
  customer_name?: string;
  customer_phone?: string;
  invoice_id: number;
  invoice_number?: string;
  discount_amount: number;
  used_at: string;
}

export interface ICouponUsageQuery {
  limit?: number;
  skip?: number;
  search?: string;
  customer_id?: number | string;
}
