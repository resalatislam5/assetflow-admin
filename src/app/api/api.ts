import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logOut } from '../features/authSlice';
import { tags } from '../utils/CreateTags';
import { baseQuery } from './../../common/utils/quarry';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseQuery,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('assetflow_token');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    const state = getState() as {
      location?: {
        currentScope?: string;
        selectedBranchId?: number | null;
        selectedWarehouseId?: number | null;
      };
    };

    const scope =
      state?.location?.currentScope ||
      localStorage.getItem('assetflow_scope') ||
      'ALL';
    const branchId =
      state?.location?.selectedBranchId ??
      (localStorage.getItem('assetflow_branch_id')
        ? Number(localStorage.getItem('assetflow_branch_id'))
        : null);
    const warehouseId =
      state?.location?.selectedWarehouseId ??
      (localStorage.getItem('assetflow_warehouse_id')
        ? Number(localStorage.getItem('assetflow_warehouse_id'))
        : null);

    headers.set('x-location-scope', scope);
    if (branchId !== null && branchId !== undefined) {
      headers.set('x-branch-id', String(branchId));
    }
    if (warehouseId !== null && warehouseId !== undefined) {
      headers.set('x-warehouse-id', String(warehouseId));
    }

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, apiCtx, extraOptions) => {
  const result = await rawBaseQuery(args, apiCtx, extraOptions);

  const requestUrl = typeof args === 'string' ? args : args.url;
  const isLoginRequest =
    apiCtx.endpoint === 'login' ||
    requestUrl.includes('/auth/login') ||
    window.location.pathname.startsWith('/auth/login');

  if (result.error?.status === 401 && !isLoginRequest) {
    apiCtx.dispatch(api.util.resetApiState());
    apiCtx.dispatch(logOut());
    localStorage.removeItem('assetflow_token');
    window.location.href = '/auth/login';
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [...tags],
  endpoints: () => ({}),
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  keepUnusedDataFor: 300,
});
