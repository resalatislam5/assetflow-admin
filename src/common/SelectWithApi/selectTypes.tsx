export type IUserSelect = {
  id: string | number;
  name: string;
  email: string;
};

export type IRoleSelect = {
  id: string | number;
  name: string;
};

export type ICategorySelect = {
  id: string | number;
  name: string;
  parent_id?: string | number;
};

export type IBrandSelect = {
  id: string | number;
  name: string;
  logo?: string;
};

export type IVariantSelect = {
  id: string | number;
  variant_name: string;
  sku: string;
  purchase_price?: string | number;
  price?: string | number;
  special_price?: string | number;
};

export type IProductSelect = {
  id: string | number;
  title: string;
  sku: string;
  base_price?: string | number;
  purchase_price?: string | number;
  special_price?: string | number;
  has_variants?: boolean;
  variants?: IVariantSelect[];
};

export type IWarehouseSelect = {
  id: string | number;
  name: string;
  code: string;
};

export type IBranchSelect = {
  id: string | number;
  name: string;
  code: string;
  is_main_branch?: boolean;
};

export type ICustomerSelect = {
  id: number;
  branch_id?: number | null;
  branch_name?: string;
  customer_code: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  current_balance?: number;
  credit_limit?: number;
};

export type IStoreProductSelect = {
  id: string | number;
  name: string;
  code: string;
  unit_price: string | number;
  current_stock: number;
};

export type IAccountSelect = {
  id: string | number;
  head_id?: string | number;
  head_name?: string;
  code?: string;
  name: string;
  account_category?: string;
  account_type: string;
  account_number?: string;
  is_group?: boolean;
  current_balance?: string | number;
};

export type IAccountHeadTreeNode = {
  id: string | number;
  key: string | number;
  value: string | number;
  title: string;
  code?: string;
  name: string;
  account_category: string;
  account_number?: string;
  account_type?: string;
  is_account?: boolean;
  account_id?: number;
  is_system?: boolean;
  children?: IAccountHeadTreeNode[];
};

export type IAccountHeadSelect = {
  id: string | number;
  code?: string;
  name: string;
  account_category: string;
  parent_id?: string | number;
};

export type ICouponSelect = {
  id: string | number;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
};

export type ISupplierSelect = {
  id: string | number;
  name: string;
  company_name?: string;
  phone?: string;
  current_balance?: string | number;
};

export type IHeadSelect = {
  id: string | number;
  name: string;
  code?: string;
};

export type IOrderSelect = {
  id: string | number;
  order_number: string;
  invoice_number?: string;
  customer_id?: number | string;
  customer_name?: string;
  customer_phone?: string;
  grand_total_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_status: string;
  status: string;
  return_id?: number | string;
  return_number?: string;
  return_refund_amount?: number;
  return_status?: string;
  shipping_amount?: number;
  delivery_charge_treatment?: 'DEDUCT_DELIVERY' | 'REFUND_FULL';
};

export type IInvoiceSelect = IOrderSelect;



