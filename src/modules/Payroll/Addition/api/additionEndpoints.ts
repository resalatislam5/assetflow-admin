import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type {
  IAddition,
  IAdditionQuery,
  ICreateAddition,
  IGenerateAddition,
  IGeneratedAddition,
  IPaginatedResponse,
  ISingleResponse,
} from '../types/additionTypes';

export const additionEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdditions: builder.query<
      IPaginatedResponse<IAddition>,
      { params?: IAdditionQuery }
    >({
      query: ({ params }) => ({
        url: '/addition',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('ADDITION')],
    }),
    generateAddition: builder.mutation<
      ISingleResponse<IGeneratedAddition[]>,
      IGenerateAddition
    >({
      query: (body) => ({
        url: '/addition/generate',
        method: 'POST',
        body,
      }),
    }),
    createAddition: builder.mutation<
      ISingleResponse<IAddition[]>,
      ICreateAddition[]
    >({
      query: (body) => ({
        url: '/addition',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('ADDITION')],
    }),
    updateAddition: builder.mutation<
      ISingleResponse<IAddition>,
      { id: string; body: Partial<ICreateAddition> }
    >({
      query: ({ id, body }) => ({
        url: `/addition/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('ADDITION')],
    }),
    deleteAddition: builder.mutation<ISingleResponse<IAddition>, string>({
      query: (id) => ({
        url: `/addition/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('ADDITION')],
    }),
    deleteAdditionByMonth: builder.mutation<ISingleResponse<null>, string>({
      query: (month_year) => ({
        url: `/addition/delete-by-month?month_year=${month_year}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('ADDITION')],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdditionsQuery,
  useGenerateAdditionMutation,
  useCreateAdditionMutation,
  useUpdateAdditionMutation,
  useDeleteAdditionMutation,
  useDeleteAdditionByMonthMutation,
} = additionEndpoints;
