import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type {
  ICreateCustomer,
  ICustomerList,
  ICustomerQuery,
  IViewCustomer,
} from '../types/customerTypes';

const customerEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getCustomerList: build.query<Response<ICustomerList[]>, ICustomerQuery>({
      query: (query) => ({
        url: '/admin/customers',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('CUSTOMER')],
    }),
    getSingleCustomer: build.query<Response<IViewCustomer>, number | string>({
      query: (id) => ({
        url: `/admin/customers/${id}`,
      }),
      providesTags: () => [CREATE_TAG('CUSTOMER')],
    }),
    createCustomer: build.mutation<
      Response<string>,
      ICreateCustomer | FormData
    >({
      query: (body) => ({
        url: '/admin/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('CUSTOMER')],
    }),
    updateCustomer: build.mutation<
      Response<string>,
      { body: ICreateCustomer | FormData; id: number | string }
    >({
      query: ({ body, id }) => ({
        url: `/admin/customers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('CUSTOMER')],
    }),
    deleteCustomer: build.mutation<Response<string>, number | string>({
      query: (id) => ({
        url: `/admin/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('CUSTOMER')],
    }),
  }),
});

export const {
  useGetCustomerListQuery,
  useGetSingleCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerEndpoints;
