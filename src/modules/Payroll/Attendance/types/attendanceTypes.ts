export interface IAttendance {
  _id: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  check_in?: string;
  check_out?: string;
  location?: string;
  check_in_location?: string;
  check_out_location?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IViewAttendance extends IAttendance {}

export interface ICreateAttendance {
  employee_id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  check_in?: string;
  check_out?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
}

export type IAttendanceQuery = Partial<{
  limit: number;
  page: number;
  search: string;
  employee_id: string;
  status: string;
  from_date: string;
  to_date: string;
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
