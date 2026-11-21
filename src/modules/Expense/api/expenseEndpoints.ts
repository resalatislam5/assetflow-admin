import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type {
  ICreateExpenseBody,
  IExpense,
  IExpenseQuery,
} from '../types/expense.types';

const expenseEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getExpenseList: build.query<Response<IExpense[]>, IExpenseQuery | void>({
      query: (params) => ({
        url: '/admin/expenses',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('EXPENSE'), CREATE_TAG('EXPENSE_HISTORY')],
    }),
    getSingleExpense: build.query<Response<IExpense>, number | string>({
      query: (id) => ({
        url: `/admin/expenses/${id}`,
      }),
      providesTags: () => [CREATE_TAG('EXPENSE')],
    }),
    createExpense: build.mutation<Response<{ id: number }>, ICreateExpenseBody>({
      query: (body) => ({
        url: '/admin/expenses',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('EXPENSE'),
        CREATE_TAG('EXPENSE_HISTORY'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    deleteExpense: build.mutation<Response<void>, number | string>({
      query: (id) => ({
        url: `/admin/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        CREATE_TAG('EXPENSE'),
        CREATE_TAG('EXPENSE_HISTORY'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
  }),
});

export const {
  useGetExpenseListQuery,
  useGetSingleExpenseQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseEndpoints;
