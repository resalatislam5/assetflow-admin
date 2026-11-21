import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ILoyaltyPointConfig,
  IUpdateLoyaltyPointConfig,
  ICustomerPoint,
  ICustomerPointQuery,
  IPointTransaction,
  IPointTransactionQuery,
  IAdjustCustomerPoints,
} from '../types/loyaltyPointTypes';

const loyaltyPointEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getLoyaltyPointConfig: build.query<Response<ILoyaltyPointConfig>, void>({
      query: () => ({
        url: '/admin/loyalty-points/config',
      }),
      providesTags: () => [CREATE_TAG('LOYALTY_POINT')],
    }),

    updateLoyaltyPointConfig: build.mutation<
      Response<ILoyaltyPointConfig>,
      IUpdateLoyaltyPointConfig
    >({
      query: (body) => ({
        url: '/admin/loyalty-points/config',
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('LOYALTY_POINT')],
    }),

    getCustomerPointsList: build.query<
      Response<ICustomerPoint[]>,
      ICustomerPointQuery
    >({
      query: (query) => ({
        url: '/admin/loyalty-points/customers',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('LOYALTY_POINT')],
    }),

    getPointTransactionsList: build.query<
      Response<IPointTransaction[]>,
      IPointTransactionQuery
    >({
      query: (query) => ({
        url: '/admin/loyalty-points/transactions',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('LOYALTY_POINT')],
    }),

    adjustCustomerPoints: build.mutation<
      Response<{ customer_id: number | string; new_balance: number }>,
      IAdjustCustomerPoints
    >({
      query: (body) => ({
        url: '/admin/loyalty-points/adjust',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [CREATE_TAG('LOYALTY_POINT')],
    }),
  }),
});

export const {
  useGetLoyaltyPointConfigQuery,
  useUpdateLoyaltyPointConfigMutation,
  useGetCustomerPointsListQuery,
  useGetPointTransactionsListQuery,
  useAdjustCustomerPointsMutation,
} = loyaltyPointEndpoints;
