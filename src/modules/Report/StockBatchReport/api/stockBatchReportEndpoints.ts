import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IStockBatchReportItem,
  IStockBatchReportQuery,
  IStockBatchReportSummary,
} from '../types/stockBatchReport.types';

const stockBatchReportEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getStockBatchReport: build.query<
      Response<IStockBatchReportItem[]> & { summary?: IStockBatchReportSummary },
      IStockBatchReportQuery | void
    >({
      query: (params) => ({
        url: '/admin/reports/stock-batches',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('STOCK_BATCH_REPORT')],
    }),
  }),
});

export const { useGetStockBatchReportQuery } = stockBatchReportEndpoints;

