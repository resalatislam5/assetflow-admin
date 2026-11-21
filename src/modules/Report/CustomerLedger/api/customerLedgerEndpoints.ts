import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICustomerLedgerItem,
  ICustomerLedgerQuery,
  ICustomerLedgerSummary,
} from '../types/customerLedgerTypes';

type CustomerLedgerResponse = Response<ICustomerLedgerItem[]> & {
  summary?: ICustomerLedgerSummary;
};

const customerLedgerEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getCustomerLedger: build.query<CustomerLedgerResponse, ICustomerLedgerQuery>({
      query: (query) => ({
        url: '/report/customer-ledger',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('CUSTOMER_LEDGER'),
        CREATE_TAG('CUSTOMER'),
      ],
    }),
    getCustomerBalance: build.query<Response<ICustomerLedgerSummary>, number | string>({
      query: (id) => ({
        url: `/report/customer-ledger/balance/${id}`,
      }),
      providesTags: () => [CREATE_TAG('CUSTOMER_LEDGER')],
    }),
  }),
});

export const { useGetCustomerLedgerQuery, useGetCustomerBalanceQuery } = customerLedgerEndpoints;
