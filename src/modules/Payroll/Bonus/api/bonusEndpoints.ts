import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type {
  IBonus,
  IBonusQuery,
  ICreateBonus,
  IGenerateBonus,
  IPaginatedResponse,
  ISingleResponse,
} from '../types/bonusTypes';

export const bonusEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getBonuses: builder.query<
      IPaginatedResponse<IBonus>,
      { params?: IBonusQuery }
    >({
      query: ({ params }) => ({
        url: '/bonus',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('BONUS')],
    }),
    generateBonus: builder.mutation<ISingleResponse<IBonus[]>, IGenerateBonus>({
      query: (body) => ({
        url: '/bonus/generate',
        method: 'POST',
        body,
      }),
    }),
    createBonus: builder.mutation<ISingleResponse<IBonus[]>, ICreateBonus[]>({
      query: (body) => ({
        url: '/bonus',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('BONUS')],
    }),
    updateBonus: builder.mutation<
      ISingleResponse<IBonus>,
      { id: string; body: Partial<ICreateBonus> }
    >({
      query: ({ id, body }) => ({
        url: `/bonus/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('BONUS')],
    }),
    deleteBonus: builder.mutation<ISingleResponse<IBonus>, string>({
      query: (id) => ({
        url: `/bonus/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('BONUS')],
    }),
    deleteBonusByMonth: builder.mutation<ISingleResponse<null>, string>({
      query: (month_year) => ({
        url: `/bonus/delete-by-month?month_year=${month_year}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('BONUS')],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBonusesQuery,
  useGenerateBonusMutation,
  useCreateBonusMutation,
  useUpdateBonusMutation,
  useDeleteBonusMutation,
  useDeleteBonusByMonthMutation,
} = bonusEndpoints;
