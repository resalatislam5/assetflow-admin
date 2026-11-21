import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type {
  ICreatePayment,
  ICreateRefund,
  IInvoiceSelectForPayment,
  IPaymentItem,
  IPaymentQuery,
  IPaymentSummary,
  IRefundItem,
  IRefundQuery,
  IUpdatePaymentStatus,
  IUpdateRefundStatus,
} from '../types/paymentTypes';

const paymentEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getPaymentList: build.query<Response<IPaymentItem[]>, IPaymentQuery>({
      query: (query) => ({
        url: '/admin/payments',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('PAYMENT')],
    }),
    getSinglePayment: build.query<Response<IPaymentItem>, string | number>({
      query: (id) => ({
        url: `/admin/payments/${id}`,
      }),
      providesTags: () => [CREATE_TAG('PAYMENT')],
    }),
    getPaymentSummary: build.query<Response<IPaymentSummary>, void>({
      query: () => ({
        url: '/admin/payments/summary',
      }),
      providesTags: () => [CREATE_TAG('PAYMENT'), CREATE_TAG('REFUND')],
    }),
    createPayment: build.mutation<
      Response<{ id: number; transaction_ref: string }>,
      ICreatePayment
    >({
      query: (body) => ({
        url: '/admin/payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('PAYMENT'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    updatePaymentStatus: build.mutation<
      Response<string>,
      { id: number | string; body: IUpdatePaymentStatus }
    >({
      query: ({ id, body }) => ({
        url: `/admin/payments/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('PAYMENT'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    getRefundList: build.query<Response<IRefundItem[]>, IRefundQuery>({
      query: (query) => ({
        url: '/admin/payments/refunds',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('REFUND')],
    }),
    getSingleRefund: build.query<Response<IRefundItem>, string | number>({
      query: (id) => ({
        url: `/admin/payments/refunds/${id}`,
      }),
      providesTags: () => [CREATE_TAG('REFUND')],
    }),
    createRefund: build.mutation<
      Response<{ id: number; refund_no: string }>,
      ICreateRefund
    >({
      query: (body) => ({
        url: '/admin/payments/refunds',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('REFUND'),
        CREATE_TAG('PAYMENT'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    updateRefundStatus: build.mutation<
      Response<string>,
      { id: number | string; body: IUpdateRefundStatus }
    >({
      query: ({ id, body }) => ({
        url: `/admin/payments/refunds/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('REFUND'),
        CREATE_TAG('PAYMENT'),
      ],
    }),
    getInvoicesForPaymentSelect: build.query<
      Response<IInvoiceSelectForPayment[]>,
      { branch_id?: number | string; search?: string } | void
    >({
      query: (params) => ({
        url: '/admin/payments/invoices-select',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('ORDER')],
    }),
  }),
});

export const {
  useGetPaymentListQuery,
  useGetSinglePaymentQuery,
  useGetPaymentSummaryQuery,
  useCreatePaymentMutation,
  useUpdatePaymentStatusMutation,
  useGetRefundListQuery,
  useGetSingleRefundQuery,
  useCreateRefundMutation,
  useUpdateRefundStatusMutation,
  useGetInvoicesForPaymentSelectQuery,
} = paymentEndpoints;
