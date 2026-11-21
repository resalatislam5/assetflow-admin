import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateSupplierPayment,
  ISupplierPaymentList,
  ISupplierPaymentQuery,
  IViewSupplierPayment,
} from '../types/supplierPaymentTypes';

const supplierPaymentEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getSupplierPaymentList: build.query<
      Response<ISupplierPaymentList[]>,
      ISupplierPaymentQuery
    >({
      query: (query) => ({
        url: '/admin/supplier-payments',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('SUPPLIER_PAYMENT')],
    }),
    getSingleSupplierPayment: build.query<
      Response<IViewSupplierPayment>,
      string | number
    >({
      query: (id) => ({
        url: `/admin/supplier-payments/${id}`,
      }),
      providesTags: () => [CREATE_TAG('SUPPLIER_PAYMENT')],
    }),
    createSupplierPayment: build.mutation<
      Response<{ id: number }>,
      ICreateSupplierPayment
    >({
      query: (body) => ({
        url: '/admin/supplier-payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('SUPPLIER_PAYMENT'),
        CREATE_TAG('SUPPLIER'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('PURCHASE'),
      ],
    }),
    deleteSupplierPayment: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/supplier-payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        CREATE_TAG('SUPPLIER_PAYMENT'),
        CREATE_TAG('SUPPLIER'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('PURCHASE'),
      ],
    }),
  }),
});

export const {
  useGetSupplierPaymentListQuery,
  useGetSingleSupplierPaymentQuery,
  useCreateSupplierPaymentMutation,
  useDeleteSupplierPaymentMutation,
} = supplierPaymentEndpoints;
