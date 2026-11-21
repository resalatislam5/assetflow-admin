import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IBalanceTransferList,
  IBalanceTransferQuery,
  IBalanceTransferSummary,
  ICreateBalanceTransfer,
  IViewBalanceTransfer,
} from '../types/balanceTransferTypes';

const balanceTransferEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getBalanceTransferList: build.query<
      Response<IBalanceTransferList[]>,
      IBalanceTransferQuery | void
    >({
      query: (params) => ({
        url: '/admin/balance-transfers',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('BALANCE_TRANSFER')],
    }),
    getBalanceTransferSummary: build.query<
      Response<IBalanceTransferSummary>,
      void
    >({
      query: () => ({
        url: '/admin/balance-transfers/summary',
      }),
      providesTags: () => [CREATE_TAG('BALANCE_TRANSFER')],
    }),
    getSingleBalanceTransfer: build.query<
      Response<IViewBalanceTransfer>,
      number | string
    >({
      query: (id) => ({
        url: `/admin/balance-transfers/${id}`,
      }),
      providesTags: () => [CREATE_TAG('BALANCE_TRANSFER')],
    }),
    createBalanceTransfer: build.mutation<
      Response<{ id: number }>,
      ICreateBalanceTransfer
    >({
      query: (body) => ({
        url: '/admin/balance-transfers',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('BALANCE_TRANSFER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    updateBalanceTransfer: build.mutation<
      Response<{ id: number }>,
      { body: Partial<ICreateBalanceTransfer>; id: number | string }
    >({
      query: ({ body, id }) => ({
        url: `/admin/balance-transfers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('BALANCE_TRANSFER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    deleteBalanceTransfer: build.mutation<
      Response<{ id: number }>,
      number | string
    >({
      query: (id) => ({
        url: `/admin/balance-transfers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        CREATE_TAG('BALANCE_TRANSFER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
  }),
});

export const {
  useCreateBalanceTransferMutation,
  useGetBalanceTransferListQuery,
  useGetBalanceTransferSummaryQuery,
  useUpdateBalanceTransferMutation,
  useDeleteBalanceTransferMutation,
  useGetSingleBalanceTransferQuery,
} = balanceTransferEndpoints;
