import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';

import type { Response } from '../../../../common/types/common.type';
import type { ICreateDesignation, IDesignationList, IDesignationQuery } from '../types/designationTypes';

export const designationEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getDesignations: builder.query<Response<IDesignationList[]>, IDesignationQuery | void>({
      query: (params) => ({
        url: '/config/designation',
        method: 'GET',
        params: params || {},
      }),
      providesTags: [CREATE_TAG('DESIGNATION')],
    }),
    createDesignation: builder.mutation<Response<IDesignationList>, ICreateDesignation>({
      query: (body) => ({
        url: '/config/designation',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('DESIGNATION')],
    }),
    updateDesignation: builder.mutation<Response<IDesignationList>, { id: string; body: Partial<ICreateDesignation> }>({
      query: ({ id, body }) => ({
        url: `/config/designation/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('DESIGNATION')],
    }),
    deleteDesignation: builder.mutation<Response<IDesignationList>, string>({
      query: (id) => ({
        url: `/config/designation/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('DESIGNATION')],
    }),
  }),
});

export const {
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} = designationEndpoints;
