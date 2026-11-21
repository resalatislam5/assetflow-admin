import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateCategory,
  ICategoryList,
  ICategoryQuery,
  IViewCategory,
} from '../types/categoryTypes';

const categoryEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getCategoryList: build.query<Response<ICategoryList[]>, ICategoryQuery>({
      query: (query) => ({
        url: '/admin/categories',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('CATEGORY')],
    }),
    getSingleCategory: build.query<Response<IViewCategory>, string | number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
      }),
      providesTags: () => [CREATE_TAG('CATEGORY')],
    }),
    createCategory: build.mutation<Response<string>, ICreateCategory | FormData>({
      query: (body) => ({
        url: '/admin/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('CATEGORY')],
    }),
    updateCategory: build.mutation<
      Response<string>,
      { body: ICreateCategory | FormData; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('CATEGORY')],
    }),
    deleteCategory: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('CATEGORY')],
    }),
  }),
});

export const {
  useGetCategoryListQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryEndpoints;
