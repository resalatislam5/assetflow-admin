import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICustomerAuditLogList,
  ICustomerAuditLogQuery,
} from '../types/customerAuditLogTypes';

const customerAuditLogEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    CustomerAuditLogList: build.query<
      Response<ICustomerAuditLogList[]>,
      ICustomerAuditLogQuery
    >({
      query: (query) => ({
        url: '/report/customer-audit-log',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('CUSTOMER_AUDIT_LOG')],
    }),
  }),
});

export const { useCustomerAuditLogListQuery } = customerAuditLogEndpoints;

