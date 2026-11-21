import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type {
  IEcommerceDashboardData,
  IEcommerceSummary,
  IRecentOrder,
  ISalesTrend,
  ITopProduct,
} from '../types/dahboardTypes';

const dashboardEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getEcommerceDashboard: build.query<Response<IEcommerceDashboardData>, void>({
      query: () => ({
        url: '/admin/dashboard',
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
    getRecentOrders: build.query<Response<IRecentOrder[]>, void>({
      query: () => ({
        url: '/admin/dashboard/recent-orders',
      }),
      providesTags: () => [CREATE_TAG('DASHBOARD')],
    }),
    getTopProducts: build.query<Response<ITopProduct[]>, void>({
      query: () => ({
        url: '/admin/dashboard/top-products',
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
} = dashboardEndpoints;
