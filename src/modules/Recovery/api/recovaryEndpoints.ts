import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type {
  IRecoveryList,
  IRecoveryQuery,
  IViewRecovery,
} from '../types/recoverTypes';

const recoveryEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getRecoveryList: build.query<Response<IRecoveryList[]>, IRecoveryQuery>({
      query: (params) => ({
        url: '/recovery',
        params,
      }),
      providesTags: () => [CREATE_TAG('RECOVERY')],
    }),
    getSingleRecovery: build.query<Response<IViewRecovery>, string>({
      query: (_id) => ({
        url: `/recovery/${_id}`,
      }),
      providesTags: () => [CREATE_TAG('RECOVERY')],
    }),
    restore: build.mutation<Response<IViewRecovery>, string>({
      query: (_id) => ({
        url: `/recovery/restore/${_id}`,
        method: 'POST',
      }),
      invalidatesTags: () => [CREATE_TAG('RECOVERY')],
    }),
  }),
});

export const {
  useGetRecoveryListQuery,
  useGetSingleRecoveryQuery,
  useRestoreMutation,
} = recoveryEndpoints;
