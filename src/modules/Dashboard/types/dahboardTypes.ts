export interface IEcommerceSummary {
  total_revenue: {
    amount: number;
    growth: number;
  };
  total_orders: {
    count: number;
    growth: number;
  };
  total_products: {
    count: number;
    active: number;
  };
  total_customers: {
    count: number;
    new_this_month: number;
  };
}

export interface ISalesTrend {
  month: string;
  sales: number;
  orders: number;
}

export interface IRecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
}

export interface ITopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  sold_count: number;
  stock: number;
  image?: string;
}

export interface IOrderStatusDistribution {
  status: string;
  count: number;
  color: string;
}

export interface IEcommerceDashboardData {
  summary: IEcommerceSummary;
  sales_trend: ISalesTrend[];
  recent_orders: IRecentOrder[];
  top_products: ITopProduct[];
  order_status_distribution: IOrderStatusDistribution[];
}
