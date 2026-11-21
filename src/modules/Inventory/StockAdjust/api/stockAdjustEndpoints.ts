import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateStockAdjustmentPayload,
  IStockAdjustment,
  IStockAdjustmentQuery,
} from '../types/stockAdjustTypes';

const stockAdjustEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getStockAdjustments: build.query<Response<IStockAdjustment[]>, IStockAdjustmentQuery>({
      query: (query) => ({
        url: 'admin/stock-adjustments',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('STOCK_ADJUST')],
    }),

    getSingleStockAdjustment: build.query<Response<IStockAdjustment>, string | number>({
      query: (id) => ({
        url: `admin/stock-adjustments/${id}`,
      }),
      providesTags: () => [CREATE_TAG('STOCK_ADJUST')],
    }),

    createStockAdjustment: build.mutation<
      Response<{ stock_id: number; previous_quantity: number; new_quantity: number }>,
      ICreateStockAdjustmentPayload
    >({
      query: (body) => ({
        url: 'admin/stock-adjustments',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('STOCK_ADJUST'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('STOCK_REPORT'),
        CREATE_TAG('WAREHOUSE'),
      ],
    }),
  }),
});

export const {
  useGetStockAdjustmentsQuery,
  useGetSingleStockAdjustmentQuery,
  useCreateStockAdjustmentMutation,
} = stockAdjustEndpoints;

