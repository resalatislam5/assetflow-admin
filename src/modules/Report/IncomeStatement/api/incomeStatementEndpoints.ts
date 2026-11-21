import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IIncomeStatementData,
  IIncomeStatementQuery,
} from '../types/incomeStatementTypes';

type IncomeStatementResponse = Response<IIncomeStatementData>;

const incomeStatementEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getIncomeStatement: build.query<IncomeStatementResponse, IIncomeStatementQuery>({
      query: (query) => ({
        url: '/report/income-statement',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('INCOME_STATEMENT'),
        CREATE_TAG('GENERAL_LEDGER'),
        CREATE_TAG('GENERAL_JOURNAL'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('ACCOUNT_HEAD'),
      ],
    }),
  }),
});

export const { useGetIncomeStatementQuery } = incomeStatementEndpoints;

