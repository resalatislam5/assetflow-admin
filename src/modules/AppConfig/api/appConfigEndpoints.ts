import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type { IAppConfig } from '../types/appConfigTypes';

const appConfigEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getAppConfigList: build.query<Response<IAppConfig>, void>({
      query: () => ({
        url: '/admin/app-config',
      }),
      providesTags: () => [CREATE_TAG('APP_CONFIG')],
    }),

    updateAppConfig: build.mutation<Response<string>, FormData>({
      query: (body) => ({
        url: '/admin/app-config',
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('APP_CONFIG')],
    }),
  }),
});

export const { useUpdateAppConfigMutation, useGetAppConfigListQuery } =
  appConfigEndpoints;
