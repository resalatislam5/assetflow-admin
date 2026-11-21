import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreatePurchase,
  IPurchaseList,
  IPurchaseQuery,
  IViewPurchase,
} from '../types/purchaseTypes';

const purchaseEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getPurchaseList: build.query<Response<IPurchaseList[]>, IPurchaseQuery>({
      query: (query) => ({
        url: '/admin/purchases',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('PURCHASE')],
    }),
    getSinglePurchase: build.query<Response<IViewPurchase>, string | number>({
      query: (id) => ({
        url: `/admin/purchases/${id}`,
      }),
      providesTags: () => [CREATE_TAG('PURCHASE')],
    }),
    createPurchase: build.mutation<Response<{ id: number }>, ICreatePurchase>({
      query: (body) => ({
        url: '/admin/purchases',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('PURCHASE'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('SUPPLIER'),
        CREATE_TAG('PRODUCT'),
      ],
    }),
    updatePurchase: build.mutation<
      Response<{ id: number }>,
      { body: ICreatePurchase; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/purchases/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('PURCHASE'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('SUPPLIER'),
        CREATE_TAG('PRODUCT'),
      ],
    }),
    deletePurchase: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/purchases/${id}`,
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
  useGetPurchaseListQuery,
  useGetSinglePurchaseQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseEndpoints;
