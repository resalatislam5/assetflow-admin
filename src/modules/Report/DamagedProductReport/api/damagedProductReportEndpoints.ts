import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IDamagedProductReportItem,
  IDamagedProductReportQuery,
  IDamagedProductReportSummary,
} from '../types/damagedProductReport.types';

const damagedProductReportEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getDamagedProductReport: build.query<
      Response<IDamagedProductReportItem[]> & { summary?: IDamagedProductReportSummary },
      IDamagedProductReportQuery | void
    >({
      query: (params) => ({
        url: '/admin/reports/damaged-products',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('DAMAGED_PRODUCT_REPORT')],
    }),
  }),
});

export const { useGetDamagedProductReportQuery } = damagedProductReportEndpoints;

