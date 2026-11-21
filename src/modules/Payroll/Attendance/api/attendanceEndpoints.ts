import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type {
  IPaginatedResponse,
  ISingleResponse,
} from '../../Bonus/types/bonusTypes';

import type {
  IAttendance,
  IAttendanceQuery,
  ICreateAttendance,
  IViewAttendance,
} from '../types/attendanceTypes';

export const attendanceEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<
      IPaginatedResponse<IAttendance>,
      { params?: IAttendanceQuery }
    >({
      query: ({ params }) => ({
        url: '/attendance',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('ATTENDANCE')],
    }),
    getSingleAttendance: builder.query<
      ISingleResponse<IViewAttendance>,
      string
    >({
      query: (id) => `/attendance/${id}`,
      providesTags: [CREATE_TAG('ATTENDANCE')],
    }),
    createAttendance: builder.mutation<
      ISingleResponse<IAttendance>,
      ICreateAttendance
    >({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('ATTENDANCE')],
    }),
    updateAttendance: builder.mutation<
      ISingleResponse<IAttendance>,
      { id: string; body: Partial<ICreateAttendance> }
    >({
      query: ({ id, body }) => ({
        url: `/attendance/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('ATTENDANCE')],
    }),
    deleteAttendance: builder.mutation<ISingleResponse<IAttendance>, string>({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('ATTENDANCE')],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAttendanceQuery,
  useGetSingleAttendanceQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceEndpoints;
