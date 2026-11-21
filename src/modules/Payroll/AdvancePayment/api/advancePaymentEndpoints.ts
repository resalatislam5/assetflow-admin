import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type {
  IPaginatedResponse,
  ISingleResponse,
} from '../../Bonus/types/bonusTypes';

import type {
  IAdvancePayment,
  IAdvancePaymentQuery,
  ICreateAdvancePayment,
} from '../types/advancePaymentTypes';

export const advancePaymentEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdvancePayments: builder.query<
      IPaginatedResponse<IAdvancePayment>,
      { params?: IAdvancePaymentQuery }
    >({
      query: ({ params }) => ({
        url: '/advance-payment',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('ADVANCE_PAYMENT')],
    }),
    getSingleAdvancePayment: builder.query<
      ISingleResponse<IAdvancePayment>,
      string
    >({
      query: (id) => ({
        url: `/advance-payment/${id}`,
        method: 'GET',
      }),
      providesTags: [CREATE_TAG('ADVANCE_PAYMENT')],
    }),
    createAdvancePayment: builder.mutation<
      ISingleResponse<IAdvancePayment>,
      ICreateAdvancePayment
    >({
      query: (body) => ({
        url: '/advance-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('ADVANCE_PAYMENT')],
    }),
    updateAdvancePayment: builder.mutation<
      ISingleResponse<IAdvancePayment>,
      { id: string; body: Partial<ICreateAdvancePayment> }
    >({
      query: ({ id, body }) => ({
        url: `/advance-payment/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('ADVANCE_PAYMENT')],
    }),
    deleteAdvancePayment: builder.mutation<
      ISingleResponse<IAdvancePayment>,
      string
    >({
      query: (id) => ({
        url: `/advance-payment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('ADVANCE_PAYMENT')],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdvancePaymentsQuery,
  useGetSingleAdvancePaymentQuery,
  useCreateAdvancePaymentMutation,
  useUpdateAdvancePaymentMutation,
  useDeleteAdvancePaymentMutation,
} = advancePaymentEndpoints;
