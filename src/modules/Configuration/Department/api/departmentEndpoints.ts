import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';

import type { Response } from '../../../../common/types/common.type';
import type { ICreateDepartment, IDepartmentList, IDepartmentQuery } from '../types/departmentTypes';

export const departmentEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Response<IDepartmentList[]>, IDepartmentQuery | void>({
      query: (params) => ({
        url: '/config/department',
        method: 'GET',
        params: params || {},
      }),
      providesTags: [CREATE_TAG('DEPARTMENT')],
    }),
    createDepartment: builder.mutation<Response<IDepartmentList>, ICreateDepartment>({
      query: (body) => ({
        url: '/config/department',
        method: 'POST',
        body,
      }),
      invalidatesTags: [CREATE_TAG('DEPARTMENT')],
    }),
    updateDepartment: builder.mutation<Response<IDepartmentList>, { id: string; body: Partial<ICreateDepartment> }>({
      query: ({ id, body }) => ({
        url: `/config/department/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CREATE_TAG('DEPARTMENT')],
    }),
    deleteDepartment: builder.mutation<Response<IDepartmentList>, string>({
      query: (id) => ({
        url: `/config/department/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [CREATE_TAG('DEPARTMENT')],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentEndpoints;
