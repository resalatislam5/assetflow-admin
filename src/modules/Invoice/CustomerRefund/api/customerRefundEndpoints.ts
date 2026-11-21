import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateCustomerRefund,
  ICustomerRefundDetail,
  ICustomerRefundListItem,
  ICustomerRefundQuery,
  ICustomerRefundSummary,
} from '../types/customerRefundTypes';

const customerRefundEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getCustomerRefundList: build.query<
      Response<ICustomerRefundListItem[]>,
      ICustomerRefundQuery
    >({
      query: (query) => ({
        url: '/admin/customer-refunds',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('CUSTOMER_REFUND'),
        CREATE_TAG('CUSTOMER_LEDGER'),
        CREATE_TAG('ORDER'),
      ],
    }),
    getSingleCustomerRefund: build.query<
      Response<ICustomerRefundDetail>,
      string | number
    >({
      query: (id) => ({
        url: `/admin/customer-refunds/${id}`,
      }),
      providesTags: () => [
        CREATE_TAG('CUSTOMER_REFUND'),
        CREATE_TAG('CUSTOMER_LEDGER'),
        CREATE_TAG('ORDER'),
      ],
    }),
    getCustomerRefundSummary: build.query<
      Response<ICustomerRefundSummary>,
      void
    >({
      query: () => ({
        url: '/admin/customer-refunds/summary',
      }),
      providesTags: () => [CREATE_TAG('CUSTOMER_REFUND')],
    }),
    createCustomerRefund: build.mutation<
      Response<{ id: number; refund_number: string }>,
      FormData | ICreateCustomerRefund
    >({
      query: (body) => ({
        url: '/admin/customer-refunds',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('CUSTOMER_REFUND'),
        CREATE_TAG('CUSTOMER_LEDGER'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    deleteCustomerRefund: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/customer-refunds/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        CREATE_TAG('CUSTOMER_REFUND'),
        CREATE_TAG('CUSTOMER_LEDGER'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
  }),
});

export const {
  useGetCustomerRefundListQuery,
  useGetSingleCustomerRefundQuery,
  useGetCustomerRefundSummaryQuery,
  useCreateCustomerRefundMutation,
  useDeleteCustomerRefundMutation,
} = customerRefundEndpoints;

