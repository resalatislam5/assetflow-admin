export interface IEmployee {
  _id: string;
  name: string;
  code: string;
  department_name: string;
  designation_name: string;
  joining_date?: string;
  basic_salary: number;
  status: 'ACTIVE' | 'INACTIVE';
}
export interface IViewEmployee {
  _id: string;
  user_id: string;
  tenant_id: string;
  name: string;
  code: string;
  department_id: string;
  designation_id: string;
  joining_date: string;
  basic_salary: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  account_name: string;
  account_no: string;
  bank_name: string;
  branch_name: string;
  routing_no: string;
  department_name: string;
  designation_name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ICreateEmployee {
  name: string;
  code: string;
  user_id?: string;
  department_id: string;
  designation_id: string;
  joining_date?: string;
  basic_salary: number;
  bank_name?: string;
  account_no?: string;
  account_name?: string;
  branch_name?: string;
  routing_no?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type IEmployeeQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  code: string;
}>;
