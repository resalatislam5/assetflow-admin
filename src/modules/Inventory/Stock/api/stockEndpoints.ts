import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IAdjustStockPayload,
  IInventorySummary,
  ISetSafetyStockPayload,
  IStock,
  IStockLog,
  IStockQuery,
} from '../types/stockTypes';

const stockEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getStockList: build.query<Response<IStock[]>, IStockQuery>({
      query: (query) => ({
        url: 'admin/stocks',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('STOCK')],
    }),

    getSingleStock: build.query<Response<IStock>, string | number>({
      query: (id) => ({
        url: `admin/stocks/${id}`,
      }),
      providesTags: () => [CREATE_TAG('STOCK')],
    }),

    getStockLogs: build.query<Response<IStockLog[]>, string | number>({
      query: (id) => ({
        url: `admin/stocks/${id}/logs`,
      }),
      providesTags: () => [CREATE_TAG('STOCK')],
    }),

    getInventorySummary: build.query<Response<IInventorySummary>, void>({
      query: () => ({
        url: 'admin/stocks/summary',
      }),
      providesTags: () => [CREATE_TAG('STOCK')],
    }),

    adjustStock: build.mutation<
      Response<{ stock_id: number; previous_quantity: number; new_quantity: number }>,
      IAdjustStockPayload
    >({
      query: (body) => ({
        url: 'admin/stocks/adjust',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('STOCK'),
        CREATE_TAG('STOCK_REPORT'),
        CREATE_TAG('WAREHOUSE'),
      ],
    }),

    setSafetyStock: build.mutation<
      Response<{ stock_id: number; safety_stock: number }>,
      ISetSafetyStockPayload
    >({
      query: (body) => ({
        url: 'admin/stocks/safety-stock',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('STOCK'),
        CREATE_TAG('STOCK_REPORT'),
        CREATE_TAG('WAREHOUSE'),
      ],
    }),
  }),
});

export const {
  useGetStockListQuery,
  useGetSingleStockQuery,
  useGetStockLogsQuery,
  useGetInventorySummaryQuery,
  useAdjustStockMutation,
  useSetSafetyStockMutation,
} = stockEndpoints;
