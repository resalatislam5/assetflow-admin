export interface IAuditLogList {
  id: string | number;
  user_id: string | number;
  user_name: string;
  action: string;
  entity: string;
  entity_id?: string | number;
  changes?: string | Record<string, unknown>;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  description?: string;
  created_at?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type IAuditLogQuery = Partial<{
  limit: number;
  skip: number;
  search: string;
  from_date: string;
  to_date: string;
  user_id: string;
}>;
