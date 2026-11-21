import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreatePromotion,
  IPromotionList,
  IPromotionQuery,
  IPromotionSummary,
} from '../types/promotionTypes';

const promotionEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getPromotionList: build.query<Response<IPromotionList[]>, IPromotionQuery>({
      query: (query) => ({
        url: '/admin/promotions',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('PROMOTION')],
    }),
    getPromotionSummary: build.query<Response<IPromotionSummary>, void>({
      query: () => ({
        url: '/admin/promotions/summary',
      }),
      providesTags: () => [CREATE_TAG('PROMOTION')],
    }),
    getSinglePromotion: build.query<Response<IPromotionList>, string | number>({
      query: (id) => ({
        url: `/admin/promotions/${id}`,
      }),
      providesTags: () => [CREATE_TAG('PROMOTION')],
    }),
    createPromotion: build.mutation<Response<string>, ICreatePromotion>({
      query: (body) => ({
        url: '/admin/promotions',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('PROMOTION')],
    }),
    updatePromotion: build.mutation<
      Response<string>,
      { body: ICreatePromotion; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/promotions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('PROMOTION')],
    }),
    deletePromotion: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('PROMOTION')],
    }),
  }),
});

export const {
  useGetPromotionListQuery,
  useGetPromotionSummaryQuery,
  useGetSinglePromotionQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionEndpoints;
