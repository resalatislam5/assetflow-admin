export type OrderStatus =
  | 'COMPLETED'
  | 'PENDING'
  | 'CANCELLED'
  | 'RETURNED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PICKED'
  | 'SHIPPED'
  | 'DELIVERED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED';

export type DeliveryChargeTreatment = 'DEDUCT_DELIVERY' | 'REFUND_FULL';

export type InvoiceType = 'POS' | 'WHOLESALE' | 'RETURN';

export interface IAddressSnapshot {
  recipient_name: string;
  recipient_phone: string;
  division_id?: number | string;
  district_id?: number | string;
  upazila_id?: number | string;
  street_address: string;
  division_name?: string;
  district_name?: string;
  upazila_name?: string;
}

export interface IOrderItem {
  id: number | string;
  order_id?: number | string;
  invoice_id?: number | string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  warehouse_name?: string;
  product_id: number | string;
  variant_id?: number | string;
  product_title: string;
  variant_name?: string;
  sku: string;
  attributes_snapshot?: Record<string, unknown>;
  unit_price: number;
  quantity: number;
  subtotal_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  created_at: string;
}

export interface IOrderStatusHistory {
  id: number | string;
  order_id: number | string;
  from_status?: OrderStatus;
  to_status: OrderStatus;
  actor_type: 'ADMIN' | 'CUSTOMER' | 'SYSTEM';
  actor_id?: number | string;
  actor_name?: string;
  comment?: string;
  created_at: string;
}

export type OrderPaymentType =
  | 'CASH'
  | 'BANK'
  | 'MOBILE_BANKING'
  | 'CARD'
  | 'CHEQUE'
  | 'OTHER';
export type OrderChargeType = 'PERCENTAGE' | 'FIXED';

export interface IOrderPaymentItem {
  id: number | string;
  receipt_number: string;
  order_id: number | string;
  branch_id?: number | string;
  branch_name?: string;
  account_id: number | string;
  payment_type: OrderPaymentType;
  amount: number;
  charge_type: OrderChargeType;
  charge_rate: number;
  charge_amount: number;
  net_amount: number;
  payment_date: string;
  reference?: string;
  notes?: string;
  created_by?: number | string;
  created_at: string;
  account_name?: string;
  account_number?: string;
  created_by_name?: string;
}

export interface IOrder {
  id: number | string;
  order_number: string;
  invoice_number?: string;
  customer_id: number | string;
  branch_id?: number | string;
  branch_name?: string;
  warehouse_id?: number | string;
  warehouse_name?: string;
  warehouse_code?: string;
  invoice_type?: InvoiceType;
  invoice_date?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  currency: string;
  subtotal_amount: number;
  discount_amount?: number;
  coupon_code?: string;
  points_redeemed?: number;
  points_discount_amount?: number;
  points_earned?: number;
  shipping_amount?: number;
  tax_amount?: number;
  grand_total_amount: number;
  paid_amount?: number;
  due_amount?: number;
  shipping_address_snapshot: IAddressSnapshot;
  billing_address_snapshot: IAddressSnapshot;
  payment_method: string;
  customer_notes?: string;
  admin_notes?: string;
  cancel_reason?: string;
  delivery_charge_treatment?: DeliveryChargeTreatment;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  total_items?: number;
  items?: IOrderItem[];
  status_history?: IOrderStatusHistory[];
  payments?: IOrderPaymentItem[];
}

export interface IUpdateOrderStatus {
  status: OrderStatus;
  warehouse_id?: number | string;
  comment?: string;
  admin_notes?: string;
  cancel_reason?: string;
  delivery_charge_treatment?: DeliveryChargeTreatment;
}

export interface IUpdatePaymentStatus {
  payment_type?: OrderPaymentType;
  account_id?: number | string;
  paid_amount?: number;
  charge_type?: OrderChargeType;
  charge_rate?: number;
  payment_date?: string;
  reference?: string;
  admin_notes?: string;
  payment_status?: PaymentStatus;
}

export interface IOrderQuery {
  limit?: number;
  skip?: number;
  page?: number;
  search?: string;
  status?: OrderStatus | '';
  payment_status?: PaymentStatus | '';
  customer_id?: number | string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  invoice_type?: InvoiceType | '';
}

export interface IOrderSummary {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders?: number;
  processingOrders?: number;
  shippedOrders?: number;
  deliveredOrders?: number;
  completedInvoices?: number;
  totalInvoices?: number;
  pendingInvoices?: number;
  cancelledInvoices?: number;
  returnedInvoices?: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalRevenue: number;
}

export interface ICreateOrderItem {
  branch_id?: number | string;
  warehouse_id?: number | string;
  product_id: number | string;
  variant_id?: number | string;
  product_title: string;
  variant_name?: string;
  sku: string;
  unit_price: number;
  quantity: number;
}

export interface ICreateOrder {
  customer_id: number | string;
  branch_id?: number | string;
  warehouse_id?: number | string;
  invoice_type?: InvoiceType;
  recipient_name: string;
  recipient_phone: string;
  division_id?: number | string;
  district_id?: number | string;
  upazila_id?: number | string;
  upazila_thana?: string;
  upazila_name?: string;
  division?: string;
  district?: string;
  street_address: string;
  payment_method: string;
  shipping_amount?: number;
  discount_amount?: number;
  coupon_code?: string;
  points_to_redeem?: number;
  customer_notes?: string;
  admin_notes?: string;
  items: ICreateOrderItem[];
  shipping_address_snapshot?: Record<string, unknown>;
  billing_address_snapshot?: Record<string, unknown>;
}

export type InvoiceStatus = OrderStatus;
export type InvoicePaymentStatus = PaymentStatus;
export type IInvoice = IOrder;
export type IInvoiceItem = IOrderItem;
export type IInvoicePaymentItem = IOrderPaymentItem;
export type IInvoiceSummary = IOrderSummary;
export type ICreateInvoice = ICreateOrder;
export type IInvoiceQuery = IOrderQuery;
export type IUpdateInvoiceStatus = IUpdateOrderStatus;
export type IUpdateInvoicePaymentStatus = IUpdatePaymentStatus;
