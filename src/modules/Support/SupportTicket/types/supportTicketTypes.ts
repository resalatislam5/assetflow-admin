export interface ISupportTicket {
  id: number;
  ticket_number: string;
  customer_id?: number;
  name: string;
  email: string;
  phone: string;
  topic: 'ORDER_STATUS' | 'RETURN_REFUND' | 'PRODUCT_WARRANTY' | 'PAYMENT_ISSUE' | 'GENERAL_QUERY';
  order_number?: string;
  subject?: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  admin_notes?: string;
  resolved_by?: number;
  resolved_by_name?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IUpdateSupportTicket {
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  admin_notes?: string;
}

export type ISupportTicketQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  topic: string;
  priority: string;
}>;
