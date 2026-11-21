import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type { IProductList, IProductQuery } from '../../../Catalog/Product/types/productTypes';
import type { ICreatePOSInvoicePayload, IPOSCompletedOrder } from '../types/posTerminalTypes';

const posTerminalEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getPOSProductList: build.query<Response<IProductList[]>, IProductQuery>({
      query: (query) => ({
        url: '/admin/products',
        params: {
          ...query,
          limit: query.limit || 50,
        },
      }),
      providesTags: () => [CREATE_TAG('PRODUCT')],
    }),

    createPOSInvoice: build.mutation<
      Response<IPOSCompletedOrder>,
      ICreatePOSInvoicePayload
    >({
      query: (body) => ({
        url: 'admin/invoices/pos',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('INVOICE'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('STOCK'),
        CREATE_TAG('PRODUCT'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
  }),
});

export const {
  useGetPOSProductListQuery,
  useCreatePOSInvoiceMutation,
} = posTerminalEndpoints;

export default posTerminalEndpoints;
