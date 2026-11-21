export interface ICustomerAuditLogList {
  id: string | number;
  customer_id?: string | number;
  customer_name?: string;
  customer_email?: string;
  action: string;
  entity: string;
  entity_id?: string | number;
  changes?: string | Record<string, unknown>;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  description: string;
  status?: string;
  created_at?: string;
  createdAt?: string | Date;
}

export type ICustomerAuditLogQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  from_date: string;
  to_date: string;
  customer_id: string | number;
  action: string;
  entity: string;
  status: string;
}>;

