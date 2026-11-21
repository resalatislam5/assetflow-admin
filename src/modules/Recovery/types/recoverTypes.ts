export interface IRecoveryList {
  id: string | number;
  model: string;
  original_id: string;
  createdAt: string;
  deleted_by_name: string;
}

export type IRecoveryQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  Recovery_id: string;
}>;

export interface IViewRecovery {
  id: string | number;
  tenant_id?: string;
  model: string;
  original_id: string;
  data: Record<string, unknown>;
  deleted_by: string;
  createdAt: string;
  updatedAt: string;
}
