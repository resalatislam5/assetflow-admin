import { api } from '../../app/api/api';
import type { Response } from '../../common/types/common.type';
import {
  type ICheckPermission,
  type LoginResponseType,
  type LoginTypes,
} from '../types/authTypes';

export const authEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Response<LoginResponseType>, LoginTypes>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: build.mutation<Response<string>, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: build.mutation<Response<string>, { email: string; token: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: build.mutation<Response<string>, { token: string; email: string; new_password: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    checkPermission: build.query<Response<ICheckPermission>, void>({
      query: () => '/check',
    }),
  }),
});

export const { useLoginMutation, useCheckPermissionQuery, useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation } = authEndpoint;
