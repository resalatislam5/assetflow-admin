import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type {
  IEcommerceDashboardData,
  IEcommerceSummary,
  ILowStockAlert,
  IRecentOrder,
  ISalesTrend,
  ITopProduct,
} from '../types/dahboardTypes';

const dashboardEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getEcommerceDashboard: build.query<Response<IEcommerceDashboardData>, { year?: number } | void>({
      query: (params) => ({
        url: '/admin/dashboard',
        params: params ? { year: params.year } : undefined,
      }),
      providesTags: () => [CREATE_TAG('DASHBOARD')],
    }),
    getDashboardSummary: build.query<Response<IEcommerceSummary>, void>({
      query: () => ({
        url: '/admin/dashboard/summary',
      }),
      providesTags: () => [CREATE_TAG('DASHBOARD')],
    }),
    getSalesTrend: build.query<Response<ISalesTrend[]>, number | void>({
      query: (year) => ({
        url: `/admin/dashboard/sales-trend${year ? `?year=${year}` : ''}`,
      }),
      providesTags: () => [CREATE_TAG('DASHBOARD')],
    }),
    getRecentOrders: build.query<Response<IRecentOrder[]>, { limit?: number } | void>({
      query: (params) => ({
        url: `/admin/dashboard/recent-orders${params?.limit ? `?limit=${params.limit}` : ''}`,
      }),
      providesTags: () => [CREATE_TAG('DASHBOARD')],
    }),
    getTopProducts: build.query<Response<ITopProduct[]>, { limit?: number } | void>({
      query: (params) => ({
        url: `/admin/dashboard/top-products${params?.limit ? `?limit=${params.limit}` : ''}`,
      }),
      providesTags: () => [CREATE_TAG('DASHBOARD')],
    }),
    getLowStockItems: build.query<Response<ILowStockAlert[]>, { limit?: number } | void>({
      query: (params) => ({
        url: `/admin/dashboard/low-stock${params?.limit ? `?limit=${params.limit}` : ''}`,
      }),
      providesTags: () => [CREATE_TAG('DASHBOARD')],
    }),
  }),
});

export const {
  useGetEcommerceDashboardQuery,
  useGetDashboardSummaryQuery,
  useGetSalesTrendQuery,
  useGetRecentOrdersQuery,
  useGetTopProductsQuery,
  useGetLowStockItemsQuery,
} = dashboardEndpoints;
