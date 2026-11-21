export type CampaignPromoType =
  | 'CATEGORY_DISCOUNT'
  | 'BRAND_DISCOUNT'
  | 'BUY_X_GET_Y'
  | 'BILL_TOTAL_DISCOUNT';

export interface IPromotionList {
  id: number;
  name: string;
  promo_type: CampaignPromoType;
  buy_quantity?: number;
  get_quantity?: number;
  discount_percentage?: number;
  discount_amount?: number;
  min_spend_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICreatePromotion {
  name: string;
  promo_type: CampaignPromoType;
  buy_quantity?: number;
  get_quantity?: number;
  discount_percentage?: number;
  discount_amount?: number;
  min_spend_amount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export type IPromotionQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  promo_type: CampaignPromoType;
  is_active: boolean | string;
}>;

export interface IPromotionSummary {
  total_promotions: number;
  active_promotions: number;
  expired_promotions: number;
}
