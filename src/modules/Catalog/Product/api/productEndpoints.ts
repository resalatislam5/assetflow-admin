import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateProduct,
  IProductList,
  IProductQuery,
  IViewProduct,
} from '../types/productTypes';

const productEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getProductList: build.query<Response<IProductList[]>, IProductQuery>({
      query: (query) => ({
        url: '/admin/products',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('PRODUCT')],
    }),
    getSingleProduct: build.query<Response<IViewProduct>, string | number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
      }),
      providesTags: () => [CREATE_TAG('PRODUCT')],
    }),
    createProduct: build.mutation<Response<string>, ICreateProduct | FormData>({
      query: (body) => ({
        url: '/admin/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('PRODUCT')],
    }),
    updateProduct: build.mutation<
      Response<string>,
      { body: ICreateProduct | FormData; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('PRODUCT')],
    }),
    deleteProduct: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('PRODUCT')],
    }),
    getProductSelect: build.query<
      Response<
        Array<{
          id: number | string;
          title: string;
          sku: string;
          base_price: number;
          variants?: Array<{ id: number | string; variant_name: string; sku: string }>;
        }>
      >,
      void
    >({
      query: () => ({
        url: '/admin/products/select',
      }),
      providesTags: () => [CREATE_TAG('PRODUCT')],
    }),
  }),
});

export const {
  useGetProductListQuery,
  useGetSingleProductQuery,
  useGetProductSelectQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productEndpoints;
