import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateRole,
  IRoleList,
  IRoleQuery,
  IViewRole,
} from '../types/roleTypes';

const roleEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getRoleList: build.query<Response<IRoleList[]>, IRoleQuery>({
      query: (query) => ({
        url: '/admin/roles',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('ROLE')],
    }),
    getSingleRole: build.query<Response<IViewRole>, string | number>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
      }),
      providesTags: () => [CREATE_TAG('ROLE')],
    }),
    getModuleList: build.query<Response<IRoleList[]>, IRoleQuery>({
      query: (query) => ({
        url: '/admin/modules',
        query,
      }),
      providesTags: () => [CREATE_TAG('ROLE')],
    }),
    createRole: build.mutation<Response<string>, ICreateRole>({
      query: (body) => ({
        url: '/admin/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('ROLE')],
    }),
    updateRole: build.mutation<
      Response<string>,
      { body: ICreateRole; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/roles/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('ROLE')],
    }),
    deleteRole: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('ROLE')],
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetRoleListQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetModuleListQuery,
  useGetSingleRoleQuery,
} = roleEndpoints;
