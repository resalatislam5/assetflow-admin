export interface IOrderReportItem {
  id: number;
  order_number?: string;
  invoice_number?: string;
  created_at: string;
  invoice_date?: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  subtotal: number;
  discount_amount: number;
  coupon_discount: number;
  delivery_charge: number;
  total_amount: number;
  grand_total_amount?: number;
  paid_amount: number;
  due_amount: number;
  total_items: number;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  warehouse_id?: number;
  warehouse_name?: string;
}

export interface IOrderReportSummary {
  total_orders: number;
  total_revenue: number;
  total_grand_amount?: number;
  total_subtotal: number;
  total_subtotal_amount?: number;
  total_discount: number;
  total_discount_amount?: number;
  total_coupon_discount: number;
  total_delivery_charge: number;
  total_shipping_amount?: number;
  total_paid: number;
  total_paid_amount?: number;
  total_due: number;
  total_due_amount?: number;
  total_items_sold: number;
}

export interface IOrderReportQuery {
  from_date?: string;
  to_date?: string;
  customer_id?: number | string;
  warehouse_id?: number | string;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  search?: string;
  limit?: number;
  skip?: number;
  page?: number;
}

export type IInvoiceReportItem = IOrderReportItem;
export type IInvoiceReportSummary = IOrderReportSummary;
export type IInvoiceReportQuery = IOrderReportQuery;

