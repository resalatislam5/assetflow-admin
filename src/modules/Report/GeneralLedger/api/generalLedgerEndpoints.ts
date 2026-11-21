import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IGeneralLedgerItem,
  IGeneralLedgerQuery,
  IGeneralLedgerSummary,
} from '../types/generalLedgerTypes';

type GeneralLedgerResponse = Response<IGeneralLedgerItem[]> & {
  summary?: IGeneralLedgerSummary;
};

const generalLedgerEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getGeneralLedger: build.query<GeneralLedgerResponse, IGeneralLedgerQuery>({
      query: (query) => ({
        url: '/report/general-ledger',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('GENERAL_LEDGER'),
        CREATE_TAG('GENERAL_JOURNAL'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('ACCOUNT_HEAD'),
        CREATE_TAG('PURCHASE'),
        CREATE_TAG('SUPPLIER_PAYMENT'),
      ],
    }),
  }),
});

export const { useGetGeneralLedgerQuery } = generalLedgerEndpoints;
