import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IOrderReportItem,
  IOrderReportQuery,
  IOrderReportSummary,
} from '../types/invoiceReport.types';

const invoiceReportEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getOrderReport: build.query<
      Response<IOrderReportItem[]> & { summary?: IOrderReportSummary },
      IOrderReportQuery | void
    >({
      query: (params) => ({
        url: '/admin/reports/invoice',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('INVOICE_REPORT'), CREATE_TAG('ORDER_REPORT')],
    }),
  }),
});

export const { useGetOrderReportQuery } = invoiceReportEndpoints;
export const useGetInvoiceReportQuery = useGetOrderReportQuery;

