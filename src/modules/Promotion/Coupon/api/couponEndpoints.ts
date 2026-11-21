import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateCoupon,
  ICouponList,
  ICouponQuery,
  ICouponSelect,
  ICouponUsage,
  ICouponUsageQuery,
} from '../types/couponTypes';

const couponEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getCouponList: build.query<Response<ICouponList[]>, ICouponQuery>({
      query: (query) => ({
        url: '/admin/coupons',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('COUPON')],
    }),
    getCouponSelect: build.query<Response<ICouponSelect[]>, void>({
      query: () => ({
        url: '/admin/coupons/select',
      }),
      providesTags: () => [CREATE_TAG('COUPON')],
    }),
    getSingleCoupon: build.query<Response<ICouponList>, string | number>({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
      }),
      providesTags: () => [CREATE_TAG('COUPON')],
    }),
    getCouponUsages: build.query<
      Response<ICouponUsage[]>,
      { id: string | number; params?: ICouponUsageQuery }
    >({
      query: ({ id, params }) => ({
        url: `/admin/coupons/${id}/usages`,
        params,
      }),
      providesTags: () => [CREATE_TAG('COUPON')],
    }),
    createCoupon: build.mutation<Response<string>, ICreateCoupon>({
      query: (body) => ({
        url: '/admin/coupons',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('COUPON')],
    }),
    updateCoupon: build.mutation<
      Response<string>,
      { body: ICreateCoupon; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/coupons/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('COUPON')],
    }),
    deleteCoupon: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('COUPON')],
    }),
  }),
});

export const {
  useGetCouponListQuery,
  useGetCouponSelectQuery,
  useGetSingleCouponQuery,
  useGetCouponUsagesQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponEndpoints;
