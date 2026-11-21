import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { IPayrollReportQuery, IPayrollReportResponse } from '../types/payrollReportTypes';

export const payrollReportEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollReport: builder.query<IPayrollReportResponse, IPayrollReportQuery>({
      query: (params) => ({
        url: '/report/payroll',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('PAYROLL')],
    }),
  }),
});

export const { useGetPayrollReportQuery } = payrollReportEndpoints;
