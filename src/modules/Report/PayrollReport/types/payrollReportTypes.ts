export interface IPayrollReportQuery {
  from_month?: string;
  to_month?: string;
  employee_id?: string;
  department_id?: string;
  status?: string;
  payment_status?: string;
}

export interface IPayrollReportData {
  id?: string | number;
  month_year: string;
  employee_name: string;
  employee_code: string;
  department_name: string;
  basic_salary: number;
  net_salary: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  createdAt: string;
}

export interface IPayrollReportResponse {
  success: boolean;
  total: number;
  summary: {
    total_basic_salary: number;
    total_net_salary: number;
    total_paid_amount: number;
    total_due_amount: number;
  };
  data: IPayrollReportData[];
}
