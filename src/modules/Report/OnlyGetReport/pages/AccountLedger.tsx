import { Table, Typography } from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { SelectAccount } from '../../../../common/SelectWithApi/Select';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import {
  advanceNumberFormat,
  dueNumberFormat,
  numberWithComma,
} from '../../../../common/utils/numberFormate';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { useGetAccountLedgerQuery } from '../api/OnlyGetReportEndpoints';
import type { IAccountLedgerQuery } from '../types/OnlyGetReportTypes';

const AccountLedger = () => {
  const { query, setQuery } = useQueryParams<IAccountLedgerQuery>();
  const { data, isLoading, isFetching } = useGetAccountLedgerQuery(query, {
    skip: !query.from_date || !query.to_date || !query.account_id,
  });

  let totalDebit = 0;
  let totalCredit = 0;

  data?.data?.transactions?.forEach((item) => {
    if (item.type === 'DEBIT') totalDebit += Number(item.amount);
    else totalCredit += Number(item.amount);
  });

  const columns = [
    {
      dataIndex: 'date',
      key: 'date',
      title: 'Date',
      render: (text: string) => dateAndTimeFormat(text),
    },
    { dataIndex: 'voucher_no', key: 'voucher_no', title: 'Voucher No' },
    {
      dataIndex: 'description',
      key: 'description',
      title: 'Description',
      width: 400,
    },
    { dataIndex: 'type', key: 'type', title: 'Type' },
    {
      title: 'Debit',
      key: 'debit',
      render: (_: unknown, record: { type: string; amount: number | string }) =>
        record.type === 'DEBIT' && advanceNumberFormat(record?.amount),
    },
    {
      title: 'Credit',
      key: 'credit',
      render: (_: unknown, record: { type: string; amount: number | string }) =>
        record.type === 'CREDIT' && dueNumberFormat(record?.amount),
    },
    {
      title: 'Last Balance',
      dataIndex: 'last_balance',
      render: (text: number | string) => advanceNumberFormat(text),
    },
  ];

  return (
    <ReportContainer
      title='Account Ledger'
      exportExcel={
        data?.data?.transactions
          ? {
              data: data.data.transactions,
              fileName: 'Account_Ledger',
              columns: columns,
              summary: {
                type: 'Total:',
                debit: totalDebit,
                credit: totalCredit,
              },
            }
          : undefined
      }
      additionalFilter={
        <>
          <SelectAccount
            label='Account'
            name='account_id'
            sm={8}
            md={8}
            lg={5}
            onChange={(e) => setQuery({ account_id: e })}
            defaultValue={query.account_id ? query?.account_id : undefined}
            required
          />
        </>
      }
    >
      <AntTable
        dataSource={data?.data?.transactions}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        pagination={false}
        columns={columns}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Typography.Paragraph
                    strong
                    style={{ margin: 0, textAlign: 'right' }}
                  >
                    Total:
                  </Typography.Paragraph>
                </Table.Summary.Cell>

                <Table.Summary.Cell index={1}>
                  {dueNumberFormat(totalDebit)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {advanceNumberFormat(totalCredit)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
              </Table.Summary.Row>

              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Typography.Paragraph
                    strong
                    style={{ margin: 0, textAlign: 'right' }}
                  >
                    Period Balance:
                  </Typography.Paragraph>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={3}>
                  {totalCredit > totalDebit
                    ? advanceNumberFormat(totalCredit + totalDebit)
                    : dueNumberFormat(totalCredit + totalDebit)}
                </Table.Summary.Cell>
              </Table.Summary.Row>

              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Typography.Paragraph
                    strong
                    style={{ margin: 0, textAlign: 'right' }}
                  >
                    Current Balance:
                  </Typography.Paragraph>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={3}>
                  {numberWithComma(data?.data?.total_last_balance || 0)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </ReportContainer>
  );
};

export default AccountLedger;
