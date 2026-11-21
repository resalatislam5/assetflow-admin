export interface ILoyaltyPointConfig {
  id: number | string;
  is_enabled: boolean;
  earning_spending_amount: number;
  earning_points: number;
  min_order_amount_for_earning: number;
  redemption_points: number;
  redemption_amount: number;
  min_points_to_redeem: number;
  max_discount_percentage: number;
  updated_by?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface IUpdateLoyaltyPointConfig {
  is_enabled: boolean;
  earning_spending_amount: number;
  earning_points: number;
  min_order_amount_for_earning: number;
  redemption_points: number;
  redemption_amount: number;
  min_points_to_redeem: number;
  max_discount_percentage: number;
}

export interface ICustomerPoint {
  id: number | string;
  customer_code?: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  reward_points: number;
  total_points_earned: number;
  total_points_redeemed: number;
  created_at: string;
}

export type PointTransactionType = 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED' | 'REFUNDED';

export interface IPointTransaction {
  id: number | string;
  customer_id: number | string;
  customer_code?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  invoice_id?: number | string;
  invoice_number?: string;
  order_id?: number | string;
  order_number?: string;
  type: PointTransactionType;
  points: number;
  amount?: number;
  balance_after: number;
  remarks?: string;
  description?: string;
  admin_name?: string;
  created_at: string;
}

export interface IAdjustCustomerPoints {
  customer_id: number | string;
  points: number;
  remarks: string;
  description?: string;
}

export interface ICustomerPointQuery {
  limit?: number | string;
  skip?: number | string;
  search?: string;
  status?: string;
  min_points?: number | string;
}

export interface IPointTransactionQuery {
  limit?: number | string;
  skip?: number | string;
  search?: string;
  customer_id?: number | string;
  invoice_id?: number | string;
  order_id?: number | string;
  type?: string;
}
