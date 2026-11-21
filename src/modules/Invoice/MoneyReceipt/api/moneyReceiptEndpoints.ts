import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  ICreateMoneyReceipt,
  IMoneyReceiptList,
  IMoneyReceiptQuery,
  IViewMoneyReceipt,
} from '../types/moneyReceiptTypes';

const moneyReceiptEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getMoneyReceiptList: build.query<
      Response<IMoneyReceiptList[]>,
      IMoneyReceiptQuery
    >({
      query: (query) => ({
        url: '/admin/money-receipts',
        params: query,
      }),
      providesTags: () => [CREATE_TAG('MONEY_RECEIPT'), CREATE_TAG('ORDER')],
    }),
    getSingleMoneyReceipt: build.query<
      Response<IViewMoneyReceipt>,
      string | number
    >({
      query: (id) => ({
        url: `/admin/money-receipts/${id}`,
      }),
      providesTags: () => [CREATE_TAG('MONEY_RECEIPT'), CREATE_TAG('ORDER')],
    }),
    createMoneyReceipt: build.mutation<
      Response<{ id: number; receipt_number: string }>,
      FormData | ICreateMoneyReceipt
    >({
      query: (body) => ({
        url: '/admin/money-receipts',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [
        CREATE_TAG('MONEY_RECEIPT'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
    deleteMoneyReceipt: build.mutation<Response<string>, string | number>({
      query: (id) => ({
        url: `/admin/money-receipts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        CREATE_TAG('MONEY_RECEIPT'),
        CREATE_TAG('ORDER'),
        CREATE_TAG('ACCOUNT'),
      ],
    }),
  }),
});

export const {
  useGetMoneyReceiptListQuery,
  useGetSingleMoneyReceiptQuery,
  useCreateMoneyReceiptMutation,
  useDeleteMoneyReceiptMutation,
} = moneyReceiptEndpoints;

