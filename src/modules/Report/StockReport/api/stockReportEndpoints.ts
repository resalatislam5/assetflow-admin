import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type { IStockLog, IStockReportQuery } from '../types/stockReportTypes';

const stockReportEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getStockMovementReport: build.query<Response<IStockLog[]>, IStockReportQuery>({
      query: (query) => ({
        url: 'report/stock-movement',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('STOCK_REPORT')],
    }),
  }),
});

export const { useGetStockMovementReportQuery } = stockReportEndpoints;
