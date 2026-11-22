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
  total_purchases?: {
    amount: number;
    count: number;
  };
  total_expenses?: {
    amount: number;
  };
  total_due?: {
    amount: number;
  };
  low_stock_count?: number;
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
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'RETURNED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  branch_name?: string;
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

export interface ILowStockAlert {
  id: string;
  product_name: string;
  sku: string;
  category_name: string;
  branch_name: string;
  warehouse_name: string;
  quantity_on_hand: number;
  safety_stock: number;
}

export interface ILocationContext {
  scope: 'ALL' | 'BRANCH' | 'WAREHOUSE';
  branch_id: number | null;
  warehouse_id: number | null;
  location_name: string;
}

export interface IEcommerceDashboardData {
  summary: IEcommerceSummary;
  sales_trend: ISalesTrend[];
  recent_orders: IRecentOrder[];
  top_products: ITopProduct[];
  order_status_distribution: IOrderStatusDistribution[];
  low_stock_items?: ILowStockAlert[];
  location_context?: ILocationContext;
}
