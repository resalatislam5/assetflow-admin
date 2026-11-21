import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreatePurchaseReturn,
  IPurchaseReturnList,
  IPurchaseReturnQuery,
  IViewPurchaseReturn,
} from '../types/purchaseReturnTypes';

const purchaseReturnEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getPurchaseReturnList: build.query<Response<IPurchaseReturnList[]>, IPurchaseReturnQuery>({
      query: (query) => ({
        url: '/admin/purchase-returns',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('PURCHASE')],
    }),
    getSinglePurchaseReturn: build.query<Response<IViewPurchaseReturn>, string | number>({
      query: (id) => ({
        url: `/admin/purchase-returns/${id}`,
      }),
      providesTags: () => [CREATE_TAG('PURCHASE')],
    }),
    createPurchaseReturn: build.mutation<Response<{ id: number }>, ICreatePurchaseReturn>({
      query: (body) => ({
        url: '/admin/purchase-returns',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('PURCHASE'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('SUPPLIER'),
      ],
    }),
    deletePurchaseReturn: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/purchase-returns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        CREATE_TAG('PURCHASE'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('SUPPLIER'),
      ],
    }),
  }),
});

export const {
  useGetPurchaseReturnListQuery,
  useGetSinglePurchaseReturnQuery,
  useCreatePurchaseReturnMutation,
  useDeletePurchaseReturnMutation,
} = purchaseReturnEndpoints;
