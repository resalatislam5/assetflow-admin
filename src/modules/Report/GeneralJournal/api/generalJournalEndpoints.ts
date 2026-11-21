import { api } from '../../../../app/api/api';
import { CREATE_TAG } from '../../../../app/utils/CreateTags';
import type { Response } from '../../../../common/types/common.type';
import type {
  IGeneralJournalItem,
  IGeneralJournalQuery,
  IGeneralJournalSummary,
} from '../types/generalJournalTypes';

type GeneralJournalResponse = Response<IGeneralJournalItem[]> & {
  summary?: IGeneralJournalSummary;
};

const generalJournalEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    getGeneralJournal: build.query<GeneralJournalResponse, IGeneralJournalQuery>({
      query: (query) => ({
        url: '/report/general-journal',
        params: query,
      }),
      providesTags: () => [
        CREATE_TAG('GENERAL_JOURNAL'),
        CREATE_TAG('ACCOUNT'),
        CREATE_TAG('PURCHASE'),
        CREATE_TAG('SUPPLIER_PAYMENT'),
      ],
    }),
  }),
});

export const { useGetGeneralJournalQuery } = generalJournalEndpoints;
