import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type {
  IPaginatedResponse,
  ISingleResponse,
} from '../../Bonus/types/bonusTypes';

import type {
  ICreateEmployee,
  IEmployee,
  IEmployeeQuery,
  IViewEmployee,
} from '../types/employeeTypes';

export const employeeEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
      IPaginatedResponse<IEmployee>,
      { params?: IEmployeeQuery }
    >({
      query: ({ params }) => ({
        url: '/employee',
        method: 'GET',
        params,
      }),
      providesTags: [CREATE_TAG('EMPLOYEE')],
    }),
    getSingleEmployee: builder.query<ISingleResponse<IViewEmployee>, string>({
      query: (id) => `/employee/${id}`,
      providesTags: [CREATE_TAG('EMPLOYEE')],
    }),
    createEmployee: builder.mutation<
      ISingleResponse<IEmployee>,
      ICreateEmployee
    >({
      query: (body) => ({
        url: '/employee',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('EMPLOYEE')],
    }),
    updateEmployee: builder.mutation<
      ISingleResponse<IEmployee>,
      { id: string; body: Partial<ICreateEmployee> }
    >({
      query: ({ id, body }) => ({
        url: `/employee/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('EMPLOYEE')],
    }),
    deleteEmployee: builder.mutation<ISingleResponse<IEmployee>, string>({
      query: (id) => ({
        url: `/employee/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('EMPLOYEE')],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetSingleEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeEndpoints;
