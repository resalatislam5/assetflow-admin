import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type {
  IDeduction,
  IDeductionQuery,
  ICreateDeduction,
  IGenerateDeduction,
  IGeneratedDeduction,
  IPaginatedResponse,
  ISingleResponse,
} from '../types/deductionTypes';

export const deductionEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeductions: builder.query<
      IPaginatedResponse<IDeduction>,
      { params?: IDeductionQuery }
    >({
      query: ({ params }) => ({
        url: '/deduction',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('DEDUCTION')],
    }),
    generateDeduction: builder.mutation<
      ISingleResponse<IGeneratedDeduction[]>,
      IGenerateDeduction
    >({
      query: (body) => ({
        url: '/deduction/generate',
        method: 'POST',
        body,
      }),
    }),
    createDeduction: builder.mutation<
      ISingleResponse<IDeduction[]>,
      ICreateDeduction[]
    >({
      query: (body) => ({
        url: '/deduction',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('DEDUCTION')],
    }),
    updateDeduction: builder.mutation<
      ISingleResponse<IDeduction>,
      { id: string; body: Partial<ICreateDeduction> }
    >({
      query: ({ id, body }) => ({
        url: `/deduction/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('DEDUCTION')],
    }),
    deleteDeduction: builder.mutation<ISingleResponse<IDeduction>, string>({
      query: (id) => ({
        url: `/deduction/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('DEDUCTION')],
    }),
    deleteDeductionByMonth: builder.mutation<ISingleResponse<null>, string>({
      query: (month_year) => ({
        url: `/deduction/delete-by-month?month_year=${month_year}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('DEDUCTION')],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDeductionsQuery,
  useGenerateDeductionMutation,
  useCreateDeductionMutation,
  useUpdateDeductionMutation,
  useDeleteDeductionMutation,
  useDeleteDeductionByMonthMutation,
} = deductionEndpoints;
