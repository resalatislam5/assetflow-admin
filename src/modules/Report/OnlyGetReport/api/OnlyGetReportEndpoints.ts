import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IAccountLedger,
  IAccountLedgerQuery,
  IAccountTransaction,
  IAccountTransactionQuery,
  IExpenseReport,
  IExpenseReportQuery,
  IStudentLedger,
  IStudentLedgerQuery,
  IBalanceStatus,
  IAttendanceReport,
  IAttendanceReportQuery,
  IAttendanceReportSummary,
  IAttendanceSummaryReportItem,
  IAttendanceSummaryReportQuery,
  IAttendanceSummaryReportSummary,
} from '../types/OnlyGetReportTypes';

const onlyGetReportEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getStudentLedger: build.query<
      Response<IStudentLedger[]>,
      IStudentLedgerQuery
    >({
      query: (query) => ({
        url: '/report/student-ledger',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('ENROLLMENT')],
    }),
    getExpenseReport: build.query<
      Response<IExpenseReport[]>,
      IExpenseReportQuery
    >({
      query: (query) => ({
        url: '/report/expense',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('EXPENSE_HISTORY')],
    }),

    getAccountLedger: build.query<
      Response<IAccountLedger>,
      IAccountLedgerQuery
    >({
      query: (query) => ({
        url: '/report/account-ledger',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('MONEY_RECEIPT'),
        CREATE_TAG('EXPENSE_HISTORY'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('AGENT_PAYMENT'),
      ],
    }),
    getAccountTransaction: build.query<
      Response<IAccountTransaction[]>,
      IAccountTransactionQuery
    >({
      query: (query) => ({
        url: '/report/account-transaction',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('MONEY_RECEIPT'),
        CREATE_TAG('EXPENSE_HISTORY'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('AGENT_PAYMENT'),
      ],
    }),
    getAccountBalanceStatus: build.query<Response<IBalanceStatus[]>, { account_ids: string }>({
      query: (params) => ({
        url: '/report/balance-status',
        params,
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT')],
    }),
    getAttendanceReport: build.query<
      Response<IAttendanceReport[]> & { summary?: IAttendanceReportSummary },
      IAttendanceReportQuery
    >({
      query: (query) => ({
        url: '/report/attendance',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('ATTENDANCE')],
    }),
    getAttendanceSummaryReport: build.query<
      Response<IAttendanceSummaryReportItem[]> & { summary?: IAttendanceSummaryReportSummary },
      IAttendanceSummaryReportQuery
    >({
      query: (query) => ({
        url: '/report/attendance-summary',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('ATTENDANCE')],
    }),
  }),
});

export const {
  useGetStudentLedgerQuery,
  useGetExpenseReportQuery,
  useGetAccountLedgerQuery,
  useGetAccountTransactionQuery,
  useGetAccountBalanceStatusQuery,
  useGetAttendanceReportQuery,
  useGetAttendanceSummaryReportQuery,
} = onlyGetReportEndpoints;

