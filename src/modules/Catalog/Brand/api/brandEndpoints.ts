import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateBrand,
  IBrandList,
  IBrandQuery,
  IViewBrand,
} from '../types/brandTypes';

const brandEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getBrandList: build.query<Response<IBrandList[]>, IBrandQuery>({
      query: (query) => ({
        url: '/admin/brands',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('BRAND')],
    }),
    getSingleBrand: build.query<Response<IViewBrand>, string | number>({
      query: (id) => ({
        url: `/admin/brands/${id}`,
      }),
      providesTags: () => [CREATE_TAG('BRAND')],
    }),
    createBrand: build.mutation<Response<string>, ICreateBrand | FormData>({
      query: (body) => ({
        url: '/admin/brands',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('BRAND')],
    }),
    updateBrand: build.mutation<
      Response<string>,
      { body: ICreateBrand | FormData; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/brands/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('BRAND')],
    }),
    deleteBrand: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('BRAND')],
    }),
  }),
});

export const {
  useGetBrandListQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandEndpoints;
