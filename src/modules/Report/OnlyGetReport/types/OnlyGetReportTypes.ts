export type IStudentLedger = {
  _id: string;
  code: string;
  admission_date: string;
  total_amount: string;
  total_paid: string;
  student_name: string;
  student_code: string;
};
export type IStudentLedgerQuery = {
  batch_id: string;
};
export type IExpenseReport = {
  _id: string;
  account_type: string;
  total_amount: string;
  date: string;
  voucher_no: string;
  account_name: string;
  expense_head_names: string[];
};
export type IExpenseReportQuery = {
  from_date: string;
  to_date: string;
  head_id: string;
};

export type IAccountTransaction = {
  _id: string;
  account_id: string;
  money_receipt_id: string;
  agent_id: string;
  expense_id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type IAccountTransactionQuery = {
  from_date: string;
  to_date: string;
  account_id: string;
  is_balance_transfer: boolean;
};

export type IAccountLedger = {
  transactions: Transaction[];
  total_last_balance: number;
};

export type Transaction = {
  id: string | number;
  _id?: string;
  account_id: string | number;
  voucher_no: string;
  reference_type?: string;
  reference_id?: string;
  tenant_id?: string;
  type: string;
  amount: number;
  description: string;
  date: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  __v?: number;
  last_balance: number;
  is_balance_transfer?: boolean;
};

export type IAccountLedgerQuery = {
  from_date: string;
  to_date: string;
  account_id: string;
};

export type IBalanceStatus = {
  _id: string;
  name: string;
  account_type: string;
  acc_number: string;
  opening_balance: number;
  balance: number;
};

export type IAttendanceReport = {
  _id: string;
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
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department_name?: string;
  designation_name?: string;
};

export type IAttendanceReportSummary = {
  totalRecords: number;
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  totalLeave: number;
};

export type IAttendanceReportQuery = {
  from_date?: string;
  to_date?: string;
  department_id?: string;
  employee_id?: string;
  status?: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  search?: string;
};

export type IAttendanceSummaryReportItem = {
  employee_id: string;
  employee_name: string;
  employee_code: string;
  department_name: string;
  designation_name: string;
  present_days: number;
  absent_days: number;
  half_days: number;
  leave_days: number;
  total_attendance_marked: number;
  total_working_minutes: number;
  total_working_hours: number;
  avg_daily_hours: number;
  attendance_rate: number;
};

export type IAttendanceSummaryReportSummary = {
  totalEmployees: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalHalfDays: number;
  totalLeaveDays: number;
  totalWorkingHours: number;
  avgAttendanceRate: number;
};

export type IAttendanceSummaryReportQuery = {
  from_date?: string;
  to_date?: string;
  department_id?: string;
  employee_id?: string;
  search?: string;
};
