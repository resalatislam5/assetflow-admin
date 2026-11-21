import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateWarehouse,
  IWarehouse,
  IWarehouseQuery,
  IWarehouseSelect,
} from '../types/warehouseTypes';

const warehouseEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getWarehouseList: build.query<Response<IWarehouse[]>, IWarehouseQuery>({
      query: (query) => ({
        url: 'admin/warehouses',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('WAREHOUSE')],
    }),

    getWarehouseSelect: build.query<Response<IWarehouseSelect[]>, void>({
      query: () => ({
        url: 'admin/warehouses/select',
      }),
      providesTags: () => [CREATE_TAG('WAREHOUSE')],
    }),

    getSingleWarehouse: build.query<Response<IWarehouse>, string | number>({
      query: (id) => ({
        url: `admin/warehouses/${id}`,
      }),
      providesTags: () => [CREATE_TAG('WAREHOUSE')],
    }),

    createWarehouse: build.mutation<Response<string>, ICreateWarehouse>({
      query: (body) => ({
        url: 'admin/warehouses',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('WAREHOUSE'), CREATE_TAG('STOCK')],
    }),

    updateWarehouse: build.mutation<
      Response<string>,
      { id: string | number; body: ICreateWarehouse }
    >({
      query: ({ id, body }) => ({
        url: `admin/warehouses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('WAREHOUSE'), CREATE_TAG('STOCK')],
    }),

    deleteWarehouse: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `admin/warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('WAREHOUSE'), CREATE_TAG('STOCK')],
    }),
  }),
});

export const {
  useGetWarehouseListQuery,
  useGetWarehouseSelectQuery,
  useGetSingleWarehouseQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehouseEndpoints;
