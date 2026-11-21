import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IAccountList,
  IAccountQuery,
  IAccountSummary,
  ICreateAccount,
} from '../types/accountTypes';

const AccountEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getAccountList: build.query<Response<IAccountList[]>, IAccountQuery>({
      query: (params) => ({
        url: '/admin/accounts',
        params,
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT')],
    }),

    getAccountSummary: build.query<Response<IAccountSummary>, void>({
      query: () => ({
        url: '/admin/accounts/summary',
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT')],
    }),

    getSingleAccount: build.query<Response<IAccountList>, string | number>({
      query: (id) => ({
        url: `/admin/accounts/${id}`,
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT')],
    }),

    createAccount: build.mutation<Response<string>, ICreateAccount>({
      query: (body) => ({
        url: '/admin/accounts',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('ACCOUNT')],
    }),

    updateAccount: build.mutation<
      Response<string>,
      { body: ICreateAccount; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/accounts/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('ACCOUNT')],
    }),

    deleteAccount: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('ACCOUNT')],
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useGetAccountListQuery,
  useGetAccountSummaryQuery,
  useGetSingleAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = AccountEndpoints;
