import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type {
  ICreatePayroll,
  IPaginatedResponse,
  IPayroll,
  IPayrollQuery,
  ISingleResponse,
} from '../types/payrollTypes';

export const payrollEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayrolls: builder.query<
      IPaginatedResponse<IPayroll>,
      { params?: IPayrollQuery }
    >({
      query: ({ params }) => ({
        url: '/payroll',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('PAYROLL')],
    }),
    createPayroll: builder.mutation<ISingleResponse<IPayroll>, ICreatePayroll>({
      query: (body) => ({
        url: '/payroll',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL')],
    }),
    updatePayroll: builder.mutation<
      ISingleResponse<IPayroll>,
      { id: string | number; body: Partial<ICreatePayroll> }
    >({
      query: ({ id, body }) => ({
        url: `/payroll/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL')],
    }),
    deletePayroll: builder.mutation<ISingleResponse<IPayroll>, string | number>({
      query: (id) => ({
        url: `/payroll/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL')],
    }),
    updatePayrollStatus: builder.mutation<
      ISingleResponse<IPayroll>,
      { id: string | number; body: { status: string } }
    >({
      query: ({ id, body }) => ({
        url: `/payroll/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL')],
    }),
    payPayroll: builder.mutation<
      ISingleResponse<IPayroll>,
      { id: string; body: { amount: number; acc_id?: string; date?: string; reason?: string; transaction_charge?: number } }
    >({
      query: ({ id, body }) => ({
        url: `/payroll/${id}/pay`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL'), CREATE_TAG('ACCOUNT')],
    }),
    bulkUpdatePayrollStatus: builder.mutation<
      ISingleResponse<unknown>,
      { body: { ids: string[]; status: string } }
    >({
      query: ({ body }) => ({
        url: `/payroll/bulk-status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL')],
    }),
    bulkPayPayroll: builder.mutation<
      ISingleResponse<unknown>,
      { body: { ids: string[]; acc_id?: string; date?: string; reason?: string; transaction_charge?: number } }
    >({
      query: ({ body }) => ({
        url: `/payroll/bulk-pay`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL'), CREATE_TAG('ACCOUNT')],
    }),
    bulkDeletePayroll: builder.mutation<
      ISingleResponse<unknown>,
      { body: { ids: string[] } }
    >({
      query: ({ body }) => ({
        url: `/payroll/bulk-delete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('PAYROLL')],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayrollsQuery,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useDeletePayrollMutation,
  useUpdatePayrollStatusMutation,
  usePayPayrollMutation,
  useBulkUpdatePayrollStatusMutation,
  useBulkPayPayrollMutation,
  useBulkDeletePayrollMutation,
} = payrollEndpoints;
