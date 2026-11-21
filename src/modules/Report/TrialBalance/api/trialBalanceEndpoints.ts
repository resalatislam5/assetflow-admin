import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ITrialBalanceItem,
  ITrialBalanceQuery,
  ITrialBalanceSummary,
} from '../types/trialBalanceTypes';

type TrialBalanceResponse = Response<ITrialBalanceItem[]> & {
  summary?: ITrialBalanceSummary;
};

const trialBalanceEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getTrialBalance: build.query<TrialBalanceResponse, ITrialBalanceQuery>({
      query: (query) => ({
        url: '/report/trial-balance',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('TRIAL_BALANCE'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('PURCHASE'),
        CREATE_TAG('SUPPLIER_PAYMENT'),
      ],
    }),
  }),
});

export const { useGetTrialBalanceQuery } = trialBalanceEndpoints;
