export interface IAddition {
  _id: string;
  employee_id: string;
  employee_code: string;
  title: string;
  amount_type: 'FIXED' | 'PERCENTAGE';
  amount: number;
  month_year: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGenerateAddition {
  department_id?: string;
  employee_ids?: string[];
  title: string;
  amount_type: 'FIXED' | 'PERCENTAGE';
  percentage?: number;
  amount?: number;
  month_year: string;
}

export interface IGeneratedAddition {
  employee_id: string;
  employee_name: string;
  employee_code: string;
  title: string;
  amount_type: 'FIXED' | 'PERCENTAGE';
  percentage?: number;
  amount: number;
  month_year: string;
}

export interface ICreateAddition {
  department_id?: string;
  employee_id?: string;
  title: string;
  amount_type: 'FIXED' | 'PERCENTAGE';
  percentage?: number;
  amount?: number;
  month_year: string;
}

export type IAdditionQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  employee_id: string;
  month_year: string;
}>;

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ISingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
