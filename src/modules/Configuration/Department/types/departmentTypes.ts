export interface IDepartmentList {
  _id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export type IDepartmentQuery = Partial<{
  limit: number;
  page: number;
  search: string;
}>;

export interface ICreateDepartment {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}
