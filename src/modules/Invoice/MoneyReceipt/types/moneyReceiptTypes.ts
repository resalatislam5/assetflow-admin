export type MoneyReceiptPaymentType =
  | 'CASH'
  | 'BANK'
  | 'MOBILE_BANKING'
  | 'CARD'
  | 'CHEQUE'
  | 'OTHER';
export type MoneyReceiptChargeType = 'PERCENTAGE' | 'FIXED';

export interface ICreateMoneyReceipt {
  order_id?: number | string;
  invoice_id?: number | string;
  branch_id?: number | string;
  account_id: number | string;
  payment_type: MoneyReceiptPaymentType;
  amount: number;
  charge_type?: MoneyReceiptChargeType;
  charge_rate?: number;
  payment_date?: string;
  reference?: string;
  notes?: string;
  image?: string;
}

export interface IMoneyReceiptList {
  id: number;
  receipt_number: string;
  order_id: number;
  invoice_id?: number;
  branch_id?: number;
  branch_name?: string;
  order_number: string;
  invoice_number?: string;
  order_grand_total: number;
  invoice_grand_total?: number;
  order_paid_amount: number;
  order_payment_status: string;
  order_status: string;
  customer_id?: number;
  customer_code?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  account_id: number;
  account_name: string;
  account_type: string;
  account_number?: string;
  payment_type: MoneyReceiptPaymentType;
  amount: number;
  charge_type: MoneyReceiptChargeType;
  charge_rate: number;
  charge_amount: number;
  net_amount: number;
  payment_date: string;
  reference?: string;
  notes?: string;
  image?: string;
  created_by?: number | string;
  created_by_name?: string;
  created_at: string;
}

export type IViewMoneyReceipt = IMoneyReceiptList;

export type IMoneyReceiptQuery = Partial<{
  limit: number;
  skip: number;
  page: number;
  search: string;
  order_id: number | string;
  invoice_id: number | string;
  branch_id: number | string;
  customer_id: number | string;
  account_id: number | string;
  payment_type: MoneyReceiptPaymentType | '';
}>;
