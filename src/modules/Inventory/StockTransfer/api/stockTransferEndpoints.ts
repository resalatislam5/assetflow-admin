import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateStockTransferPayload,
  IReceiveStockTransferPayload,
  IStockTransfer,
  IStockTransferQuery,
} from '../types/stockTransferTypes';

const stockTransferEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getStockTransfers: build.query<Response<IStockTransfer[]>, IStockTransferQuery>({
      query: (query) => ({
        url: 'inventory/stock-transfers',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('STOCK_TRANSFER'), CREATE_TAG('STOCK')],
    }),

    getSingleStockTransfer: build.query<Response<IStockTransfer>, string | number>({
      query: (id) => ({
        url: `inventory/stock-transfers/${id}`,
      }),
      providesTags: () => [CREATE_TAG('STOCK_TRANSFER'), CREATE_TAG('STOCK')],
    }),

    createStockTransfer: build.mutation<Response<IStockTransfer>, ICreateStockTransferPayload>({
      query: (body) => ({
        url: 'inventory/stock-transfers',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('STOCK_TRANSFER'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('STOCK_REPORT'),
      ],
    }),

    sendStockTransfer: build.mutation<Response<{ id: number; status: string }>, string | number>({
      query: (id) => ({
        url: `inventory/stock-transfers/${id}/send`,
        method: 'POST',
      }),
      invalidatesTags: () => [
        CREATE_TAG('STOCK_TRANSFER'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('STOCK_REPORT'),
      ],
    }),

    receiveStockTransfer: build.mutation<
      Response<{ id: number; status: string }>,
      { id: string | number; body: IReceiveStockTransferPayload }
    >({
      query: ({ id, body }) => ({
        url: `inventory/stock-transfers/${id}/receive`,
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('STOCK_TRANSFER'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('STOCK_REPORT'),
      ],
    }),

    cancelStockTransfer: build.mutation<Response<{ id: number; status: string }>, string | number>({
      query: (id) => ({
        url: `inventory/stock-transfers/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: () => [
        CREATE_TAG('STOCK_TRANSFER'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('STOCK_REPORT'),
      ],
    }),
  }),
});

export const {
  useGetStockTransfersQuery,
  useGetSingleStockTransferQuery,
  useCreateStockTransferMutation,
  useSendStockTransferMutation,
  useReceiveStockTransferMutation,
  useCancelStockTransferMutation,
} = stockTransferEndpoints;
