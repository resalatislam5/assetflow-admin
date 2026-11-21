import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateOrderReturn,
  IOrderReturn,
  IOrderReturnQuery,
  IOrderReturnSummary,
  IUpdateReturnStatus,
} from '../types/invoiceReturnTypes';

const invoiceReturnEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getOrderReturnList: build.query<Response<IOrderReturn[]>, IOrderReturnQuery>({
      query: (query) => ({
        url: 'admin/invoice-returns',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('INVOICE_RETURN'), CREATE_TAG('ORDER_RETURN')],
    }),

    getSingleOrderReturn: build.query<Response<IOrderReturn>, string | number>({
      query: (id) => ({
        url: `admin/invoice-returns/${id}`,
      }),
      providesTags: () => [CREATE_TAG('INVOICE_RETURN'), CREATE_TAG('ORDER_RETURN')],
    }),

    getOrderReturnSummary: build.query<Response<IOrderReturnSummary>, void>({
      query: () => ({
        url: 'admin/invoice-returns/summary',
      }),
      providesTags: () => [CREATE_TAG('INVOICE_RETURN'), CREATE_TAG('ORDER_RETURN')],
    }),

    createOrderReturn: build.mutation<
      Response<{ id: number; return_number: string }>,
      ICreateOrderReturn
    >({
      query: (body) => ({
        url: 'admin/invoice-returns',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('INVOICE_RETURN'),
        CREATE_TAG('ORDER_RETURN'),
        CREATE_TAG('INVOICE'),
        CREATE_TAG('ORDER'),
      ],
    }),

    updateReturnStatus: build.mutation<
      Response<string>,
      { id: string | number; body: IUpdateReturnStatus }
    >({
      query: ({ id, body }) => ({
        url: `admin/invoice-returns/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('INVOICE_RETURN'),
        CREATE_TAG('ORDER_RETURN'),
        CREATE_TAG('INVOICE'),
        CREATE_TAG('ORDER'),
      ],
    }),

    deleteOrderReturn: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `admin/invoice-returns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('INVOICE_RETURN'), CREATE_TAG('ORDER_RETURN')],
    }),
  }),
});

export const {
  useGetOrderReturnListQuery,
  useGetSingleOrderReturnQuery,
  useGetOrderReturnSummaryQuery,
  useCreateOrderReturnMutation,
  useUpdateReturnStatusMutation,
  useDeleteOrderReturnMutation,
} = invoiceReturnEndpoints;

export const useGetInvoiceReturnListQuery = useGetOrderReturnListQuery;
export const useGetSingleInvoiceReturnQuery = useGetSingleOrderReturnQuery;
export const useGetInvoiceReturnSummaryQuery = useGetOrderReturnSummaryQuery;
export const useCreateInvoiceReturnMutation = useCreateOrderReturnMutation;
export const useUpdateInvoiceReturnStatusMutation = useUpdateReturnStatusMutation;
export const useDeleteInvoiceReturnMutation = useDeleteOrderReturnMutation;
