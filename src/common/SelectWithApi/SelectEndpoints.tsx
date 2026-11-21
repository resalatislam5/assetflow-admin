import { api } from '../../app/api/api';
import { CREATE_TAG } from '../../app/utils/CreateTags';
import type { Response } from '../types/common.type';
import type {
  IAccountSelect,
  IBrandSelect,
  ICategorySelect,
  ICustomerSelect,
  IProductSelect,
  IRoleSelect,
  IStoreProductSelect,
  IUserSelect,
  IWarehouseSelect,
  IBranchSelect,
  ICouponSelect,
  ISupplierSelect,
  IHeadSelect,
  IAccountHeadTreeNode,
  IAccountHeadSelect,
  IOrderSelect,
} from './selectTypes';

const selectEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getAccountSelect: build.query<Response<IAccountSelect[]>, void>({
      query: () => ({
        url: '/admin/accounts/select',
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT')],
    }),
    getUserSelect: build.query<Response<IUserSelect[]>, void>({
      query: () => ({
        url: '/admin/users/select',
      }),
      providesTags: () => [CREATE_TAG('USER')],
    }),
    getRoleSelect: build.query<Response<IRoleSelect[]>, void>({
      query: () => ({
        url: '/admin/roles/select',
      }),
      providesTags: () => [CREATE_TAG('ROLE')],
    }),
    getCategorySelect: build.query<Response<ICategorySelect[]>, void>({
      query: () => ({
        url: '/admin/categories/select',
      }),
      providesTags: () => [CREATE_TAG('CATEGORY')],
    }),
    getBrandSelect: build.query<Response<IBrandSelect[]>, void>({
      query: () => ({
        url: '/admin/brands/select',
      }),
      providesTags: () => [CREATE_TAG('BRAND')],
    }),
    getProductSelect: build.query<Response<IProductSelect[]>, void>({
      query: () => ({
        url: '/admin/products/select',
      }),
      providesTags: () => [CREATE_TAG('PRODUCT')],
    }),
    getWarehouseSelect: build.query<Response<IWarehouseSelect[]>, void>({
      query: () => ({
        url: '/admin/warehouses/select',
      }),
      providesTags: () => [CREATE_TAG('WAREHOUSE')],
    }),
    getBranchSelect: build.query<Response<IBranchSelect[]>, void>({
      query: () => ({
        url: '/admin/branches/select',
      }),
      providesTags: () => [CREATE_TAG('BRANCH')],
    }),
    getCustomerSelect: build.query<Response<ICustomerSelect[]>, void>({
      query: () => ({
        url: '/admin/customers/select',
      }),
      providesTags: () => [CREATE_TAG('CUSTOMER')],
    }),
    getStoreProductSelect: build.query<Response<IStoreProductSelect[]>, void>({
      query: () => ({
        url: '/admin/store/select',
      }),
      providesTags: () => [CREATE_TAG('STORE')],
    }),
    getCouponSelect: build.query<Response<ICouponSelect[]>, void>({
      query: () => ({
        url: '/admin/coupons/select',
      }),
      providesTags: () => [CREATE_TAG('COUPON')],
    }),
    getSupplierSelect: build.query<Response<ISupplierSelect[]>, void>({
      query: () => ({
        url: '/admin/suppliers/select',
      }),
      providesTags: () => [CREATE_TAG('SUPPLIER')],
    }),
    getHeadSelect: build.query<Response<IHeadSelect[]>, void>({
      query: () => ({
        url: '/admin/account-heads/select',
        params: { account_category: 'EXPENSE' },
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT_HEAD')],
    }),
    getAccountHeadTree: build.query<Response<IAccountHeadTreeNode[]>, void>({
      query: () => ({
        url: '/admin/account-heads/tree',
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT_HEAD')],
    }),
    getAccountHeadSelect: build.query<Response<IAccountHeadSelect[]>, { account_category?: string } | void>({
      query: (params) => ({
        url: '/admin/account-heads/select',
        params: params || undefined,
      }),
      providesTags: () => [CREATE_TAG('ACCOUNT_HEAD')],
    }),
    getOrderSelect: build.query<
      Response<IOrderSelect[]>,
      {
        search?: string;
        unpaid_only?: boolean;
        customer_id?: number | string;
        refundable_returns_only?: boolean;
      } | void
    >({
      query: (params) => ({
        url: '/admin/invoices/select',
        params: params || {},
      }),
      providesTags: () => [CREATE_TAG('INVOICE'), CREATE_TAG('ORDER')],
    }),
  }),
});

export const {
  useGetAccountSelectQuery,
  useGetUserSelectQuery,
  useGetRoleSelectQuery,
  useGetCategorySelectQuery,
  useGetBrandSelectQuery,
  useGetProductSelectQuery,
  useGetWarehouseSelectQuery,
  useGetBranchSelectQuery,
  useGetCustomerSelectQuery,
  useGetStoreProductSelectQuery,
  useGetCouponSelectQuery,
  useGetSupplierSelectQuery,
  useGetHeadSelectQuery,
  useGetAccountHeadTreeQuery,
  useGetAccountHeadSelectQuery,
  useGetOrderSelectQuery,
} = selectEndpoints;

export const useGetInvoiceSelectQuery = useGetOrderSelectQuery;

