import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type {
  ICreateStoreProduct,
  IDamagedPayload,
  IStockInPayload,
  IStockOutPayload,
  IStoreProduct,
  IStoreProductQuery,
  IStoreSummary,
  IUpdateStoreProduct,
} from '../types/storeTypes';

const storeEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getStoreProductsList: build.query<
      Response<IStoreProduct[]>,
      IStoreProductQuery | void
    >({
      query: (params) => ({
        url: '/admin/store',
        params: params || undefined,
      }),
      providesTags: () => [CREATE_TAG('STORE')],
    }),

    getStoreSummary: build.query<Response<IStoreSummary>, void>({
      query: () => ({
        url: '/admin/store/summary',
      }),
      providesTags: () => [CREATE_TAG('STORE')],
    }),

    getStoreProductSelect: build.query<Response<IStoreProduct[]>, void>({
      query: () => ({
        url: '/admin/store/select',
      }),
      providesTags: () => [CREATE_TAG('STORE')],
    }),

    getSingleStoreProduct: build.query<Response<IStoreProduct>, number | string>({
      query: (id) => ({
        url: `/admin/store/${id}`,
      }),
      providesTags: () => [CREATE_TAG('STORE')],
    }),

    createStoreProduct: build.mutation<
      Response<IStoreProduct>,
      ICreateStoreProduct
    >({
      query: (body) => ({
        url: '/admin/store',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('STORE')],
    }),

    updateStoreProduct: build.mutation<
      Response<IStoreProduct>,
      { body: IUpdateStoreProduct; id: number | string }
    >({
      query: ({ body, id }) => ({
        url: `/admin/store/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('STORE')],
    }),

    deleteStoreProduct: build.mutation<Response<string>, number | string>({
      query: (id) => ({
        url: `/admin/store/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('STORE')],
    }),

    addStockIn: build.mutation<
      Response<IStoreProduct>,
      { id: number | string; body: IStockInPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/store/${id}/stock-in`,
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('STORE')],
    }),

    addStockOut: build.mutation<
      Response<IStoreProduct>,
      { id: number | string; body: IStockOutPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/store/${id}/stock-out`,
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('STORE')],
    }),

    addDamaged: build.mutation<
      Response<IStoreProduct>,
      { id: number | string; body: IDamagedPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/store/${id}/damaged`,
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('STORE')],
    }),
  }),
});

export const {
  useGetStoreProductsListQuery,
  useGetStoreSummaryQuery,
  useGetStoreProductSelectQuery,
  useGetSingleStoreProductQuery,
  useCreateStoreProductMutation,
  useUpdateStoreProductMutation,
  useDeleteStoreProductMutation,
  useAddStockInMutation,
  useAddStockOutMutation,
  useAddDamagedMutation,
} = storeEndpoints;
