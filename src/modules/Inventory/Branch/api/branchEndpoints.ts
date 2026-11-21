import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IBranch,
  IBranchQuery,
  ICreateBranch,
} from '../types/branchTypes';

const branchEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getBranchList: build.query<Response<IBranch[]>, IBranchQuery>({
      query: (query) => ({
        url: '/admin/branches',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('BRANCH')],
    }),

    getSingleBranch: build.query<Response<IBranch>, number | string>({
      query: (id) => ({
        url: `/admin/branches/${id}`,
      }),
      providesTags: () => [CREATE_TAG('BRANCH')],
    }),

    createBranch: build.mutation<Response<IBranch>, ICreateBranch>({
      query: (body) => ({
        url: '/admin/branches',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('BRANCH')],
    }),

    updateBranch: build.mutation<
      Response<IBranch>,
      { id: number | string; body: ICreateBranch }
    >({
      query: ({ id, body }) => ({
        url: `/admin/branches/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('BRANCH')],
    }),

    deleteBranch: build.mutation<Response<void>, number | string>({
      query: (id) => ({
        url: `/admin/branches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('BRANCH')],
    }),
  }),
});

export const {
  useGetBranchListQuery,
  useGetSingleBranchQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchEndpoints;
