import { api } from '../../../app/api/api';
import { CREATE_TAG } from '../../../app/utils/CreateTags';
import type { Response } from '../../../common/types/common.type';
import type { IChangePassword } from '../types/profileTypes';

import type { ICheckPermission } from '../../../auth/types/authTypes';

const AccountEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    changePassword: build.mutation<Response<string>, IChangePassword>({
      query: (body) => ({
        url: '/profile/change-password',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('PROFILE')],
    }),
    updateProfile: build.mutation<Response<Partial<ICheckPermission>>, FormData>({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('PROFILE')],
    }),
  }),
});

export const { useChangePasswordMutation, useUpdateProfileMutation } = AccountEndpoints;
