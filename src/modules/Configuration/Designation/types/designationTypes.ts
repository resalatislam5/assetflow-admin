export interface IDesignationList {
  _id: string;
  name: string;
  department_id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export type IDesignationQuery = Partial<{
  limit: number;
  page: number;
  search: string;
}>;

export interface ICreateDesignation {
  department_id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}
