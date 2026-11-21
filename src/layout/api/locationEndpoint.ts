import { api } from '../../app/api/api';

export interface INavbarLocationResponse {
  can_select_all: boolean;
  branches: Array<{
    id: number;
    name: string;
    code: string;
    is_main_branch?: boolean;
  }>;
  warehouses: Array<{
    id: number;
    name: string;
    code: string;
    branch_id?: number;
  }>;
}

export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNavbarLocations: builder.query<INavbarLocationResponse, void>({
      query: () => '/branches/navbar-options',
      transformResponse: (response: { data: INavbarLocationResponse }) =>
        response.data,
      providesTags: ['ADMIN', 'BRANCH', 'WAREHOUSE'],
    }),
  }),
});

export const { useGetNavbarLocationsQuery } = locationApi;
