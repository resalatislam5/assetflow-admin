import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateSupplier,
  ISupplierList,
  ISupplierQuery,
  IViewSupplier,
} from '../types/supplierTypes';

const supplierEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getSupplierList: build.query<Response<ISupplierList[]>, ISupplierQuery>({
      query: (query) => ({
        url: '/admin/suppliers',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('SUPPLIER')],
    }),
    getSingleSupplier: build.query<Response<IViewSupplier>, string | number>({
      query: (id) => ({
        url: `/admin/suppliers/${id}`,
      }),
      providesTags: () => [CREATE_TAG('SUPPLIER')],
    }),
    createSupplier: build.mutation<Response<{ id: number }>, ICreateSupplier>({
      query: (body) => ({
        url: '/admin/suppliers',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('SUPPLIER')],
    }),
    updateSupplier: build.mutation<
      Response<{ id: number }>,
      { body: ICreateSupplier; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/suppliers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('SUPPLIER')],
    }),
    deleteSupplier: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/suppliers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('SUPPLIER')],
    }),
  }),
});

export const {
  useGetSupplierListQuery,
  useGetSingleSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierEndpoints;
