import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type { ICreateUser, IUserList, IUserQuery } from '../types/userTypes';

const userEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    userList: build.query<Response<IUserList[]>, IUserQuery>({
      query: (query) => ({
        url: '/admin/users',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('USER')],
    }),
    createUser: build.mutation<Response<string>, ICreateUser>({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('USER')],
    }),

    updateUser: build.mutation<
      Response<string>,
      { body: ICreateUser; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('USER')],
    }),

    deleteUser: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('USER')],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUserListQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userEndpoints;
