import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IBalanceSheetData,
  IBalanceSheetQuery,
} from '../types/balanceSheetTypes';

type BalanceSheetResponse = Response<IBalanceSheetData>;

const balanceSheetEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getBalanceSheet: build.query<BalanceSheetResponse, IBalanceSheetQuery>({
      query: (query) => ({
        url: '/report/balance-sheet',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('BALANCE_SHEET'),
        CREATE_TAG('INCOME_STATEMENT'),
        CREATE_TAG('TRIAL_BALANCE'),
        CREATE_TAG('GENERAL_LEDGER'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('ACCOUNT_HEAD'),
      ],
    }),
  }),
});

export const { useGetBalanceSheetQuery } = balanceSheetEndpoints;

