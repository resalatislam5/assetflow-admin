import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IBalanceAdjustmentList,
  IBalanceAdjustmentQuery,
  IBalanceAdjustmentSummary,
  ICreateBalanceAdjustment,
  IViewBalanceAdjustment,
} from '../types/balanceAdjustmentTypes';

const balanceAdjustmentEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getBalanceAdjustmentList: build.query<
      Response<IBalanceAdjustmentList[]>,
      IBalanceAdjustmentQuery | void
    >({
      query: (params) => ({
        url: '/admin/balance-adjustments',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('BALANCE_ADJUSTMENT')],
    }),
    getBalanceAdjustmentSummary: build.query<
      Response<IBalanceAdjustmentSummary>,
      void
    >({
      query: () => ({
        url: '/admin/balance-adjustments/summary',
      }),
      providesTags: () => [CREATE_TAG('BALANCE_ADJUSTMENT')],
    }),
    getSingleBalanceAdjustment: build.query<
      Response<IViewBalanceAdjustment>,
      number | string
    >({
      query: (id) => ({
        url: `/admin/balance-adjustments/${id}`,
      }),
      providesTags: () => [CREATE_TAG('BALANCE_ADJUSTMENT')],
    }),
    createBalanceAdjustment: build.mutation<
      Response<{ id: number }>,
      ICreateBalanceAdjustment
    >({
      query: (body) => ({
        url: '/admin/balance-adjustments',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('BALANCE_ADJUSTMENT'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    updateBalanceAdjustment: build.mutation<
      Response<{ id: number }>,
      { body: Partial<ICreateBalanceAdjustment>; id: number | string }
    >({
      query: ({ body, id }) => ({
        url: `/admin/balance-adjustments/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('BALANCE_ADJUSTMENT'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    deleteBalanceAdjustment: build.mutation<
      Response<{ id: number }>,
      number | string
    >({
      query: (id) => ({
        url: `/admin/balance-adjustments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        CREATE_TAG('BALANCE_ADJUSTMENT'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
  }),
});

export const {
  useCreateBalanceAdjustmentMutation,
  useGetBalanceAdjustmentListQuery,
  useGetBalanceAdjustmentSummaryQuery,
  useUpdateBalanceAdjustmentMutation,
  useDeleteBalanceAdjustmentMutation,
  useGetSingleBalanceAdjustmentQuery,
} = balanceAdjustmentEndpoints;
