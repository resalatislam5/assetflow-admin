export interface IPOSCartItem {
  product_id: number;
  variant_id?: number;
  product_title: string;
  variant_name?: string;
  sku: string;
  barcode?: string;
  unit_price: number;
  purchase_price?: number;
  quantity: number;
  discount_amount: number;
  tax_amount: number;
  subtotal_amount: number;
  total_amount: number;
  image_url?: string;
}

export interface ICreatePOSInvoicePayload {
  customer_id?: number;
  branch_id?: number;
  warehouse_id?: number;
  account_id?: number;
  payment_method: string;
  payment_type?: 'CASH' | 'BANK' | 'MOBILE_BANKING' | 'CARD' | 'CHEQUE' | 'OTHER';
  subtotal_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  tax_amount?: number;
  tendered_amount: number;
  paid_amount?: number;
  customer_notes?: string;
  admin_notes?: string;
  items: Array<{
    product_id: number;
    variant_id?: number;
    warehouse_id?: number;
    product_title: string;
    variant_name?: string;
    sku: string;
    unit_price: number;
    purchase_price?: number;
    quantity: number;
    discount_amount?: number;
    tax_amount?: number;
  }>;
}

export interface IPOSCompletedOrder {
  id: number;
  invoice_number: string;
  order_number?: string;
  invoice_date: string;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  grand_total_amount: number;
  tendered_amount: number;
  paid_amount: number;
  change_amount: number;
  payment_method: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  branch_name?: string;
  items?: Array<{
    product_title: string;
    variant_name?: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
  }>;
}
