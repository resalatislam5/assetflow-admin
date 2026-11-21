import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ISupportTicket,
  ISupportTicketQuery,
  IUpdateSupportTicket,
} from '../types/supportTicketTypes';

const supportTicketEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getSupportTicketList: build.query<
      Response<ISupportTicket[]>,
      ISupportTicketQuery
    >({
      query: (query) => ({
        url: '/admin/support-tickets',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('SUPPORT_TICKET')],
    }),
    getSingleSupportTicket: build.query<
      Response<ISupportTicket>,
      string | number
    >({
      query: (id) => ({
        url: `/admin/support-tickets/${id}`,
      }),
      providesTags: () => [CREATE_TAG('SUPPORT_TICKET')],
    }),
    updateSupportTicket: build.mutation<
      Response<string>,
      { body: IUpdateSupportTicket; id: string | number }
    >({
      query: ({ body, id }) => ({
        url: `/admin/support-tickets/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('SUPPORT_TICKET')],
    }),
    deleteSupportTicket: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/support-tickets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [CREATE_TAG('SUPPORT_TICKET')],
    }),
  }),
});

export const {
  useGetSupportTicketListQuery,
  useGetSingleSupportTicketQuery,
  useUpdateSupportTicketMutation,
  useDeleteSupportTicketMutation,
} = supportTicketEndpoints;

