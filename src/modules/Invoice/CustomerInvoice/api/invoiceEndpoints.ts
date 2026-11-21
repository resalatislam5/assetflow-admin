import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateOrder,
  IOrder,
  IOrderQuery,
  IOrderSummary,
  IUpdateOrderStatus,
  IUpdatePaymentStatus,
} from '../types/invoiceTypes';

const invoiceEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getOrderList: build.query<Response<IOrder[]>, IOrderQuery>({
      query: (query) => ({
        url: 'admin/invoices',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),

    getSingleOrder: build.query<Response<IOrder>, string | number>({
      query: (id) => ({
        url: `admin/invoices/${id}`,
      }),
      providesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),

    getOrderSummary: build.query<Response<IOrderSummary>, void>({
      query: () => ({
        url: 'admin/invoices/summary',
      }),
      providesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),

    createOrder: build.mutation<
      Response<{ id: number; order_number: string; invoice_number?: string }>,
      ICreateOrder
    >({
      query: (body) => ({
        url: 'admin/invoices',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),

    updateOrder: build.mutation<
      Response<{ id: number; order_number: string; invoice_number?: string }>,
      { id: string | number; body: Partial<ICreateOrder> }
    >({
      query: ({ id, body }) => ({
        url: `admin/invoices/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),

    updateOrderStatus: build.mutation<
      Response<string>,
      { id: string | number; body: IUpdateOrderStatus }
    >({
      query: ({ id, body }) => ({
        url: `admin/invoices/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),

    updatePaymentStatus: build.mutation<
      Response<string>,
      { id: string | number; body: IUpdatePaymentStatus }
    >({
      query: ({ id, body }) => ({
        url: `admin/invoices/${id}/payment`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),

    deleteOrder: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `admin/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),
  }),
});

export const {
  useGetOrderListQuery,
  useGetSingleOrderQuery,
  useGetOrderSummaryQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useDeleteOrderMutation,
} = invoiceEndpoints;

export const useGetInvoiceListQuery = useGetOrderListQuery;
export const useGetSingleInvoiceQuery = useGetSingleOrderQuery;
export const useGetInvoiceSummaryQuery = useGetOrderSummaryQuery;
export const useCreateInvoiceMutation = useCreateOrderMutation;
export const useUpdateInvoiceMutation = useUpdateOrderMutation;
export const useUpdateInvoiceStatusMutation = useUpdateOrderStatusMutation;
export const useUpdateInvoicePaymentStatusMutation = useUpdatePaymentStatusMutation;
export const useDeleteInvoiceMutation = useDeleteOrderMutation;
