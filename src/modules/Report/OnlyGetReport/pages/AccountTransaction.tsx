import { Table, Typography } from 'antd';
import { FormInputSelect } from '../../../../common/Form/FormIInput';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { SelectAccount } from '../../../../common/SelectWithApi/Select';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import {
  advanceNumberFormat,
  dueNumberFormat,
} from '../../../../common/utils/numberFormate';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { useGetAccountTransactionQuery } from '../api/OnlyGetReportEndpoints';
import type { IAccountTransactionQuery } from '../types/OnlyGetReportTypes';

const AccountTransaction = () => {
  const { query, setQuery } = useQueryParams<IAccountTransactionQuery>();
  const { data, isLoading, isFetching } = useGetAccountTransactionQuery(query, {
    skip: !query.from_date && !query.to_date,
  });

  let totalDebit = 0;
  let totalCredit = 0;
  
  data?.data?.forEach(item => {
    if (item.type === 'DEBIT') totalDebit += Number(item.amount);
    else totalCredit += Number(item.amount);
  });

  const columns = [
    { dataIndex: 'date', key: 'date', title: 'Date', render: (text: string) => dateAndTimeFormat(text) },
    { dataIndex: 'voucher_no', key: 'voucher_no', title: 'Voucher No' },
    { dataIndex: 'type', key: 'type', title: 'Type' },
    { title: 'Debit', key: 'debit', render: (_: unknown, record: { type: string; amount: number | string }) => record.type === 'DEBIT' && dueNumberFormat(record?.amount) },
    { title: 'Credit', key: 'credit', render: (_: unknown, record: { type: string; amount: number | string }) => record.type === 'CREDIT' && advanceNumberFormat(record?.amount) },
    { dataIndex: 'description', key: 'description', title: 'Description', width: 400 },
  ];



  return (
    <ReportContainer
      title='Account Transaction'
      exportExcel={data?.data ? {
        data: data.data,
        fileName: 'Account_Transaction',
        columns: columns,
        summary: { type: 'Total:', debit: totalDebit, credit: totalCredit, description: `Available Balance: ${totalCredit > totalDebit ? (totalCredit - totalDebit) : (totalCredit - totalDebit)}` }
      } : undefined}
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
          />
          <FormInputSelect
            label='With Balance Transfer'
            name='is_balance_transfer'
            sm={8}
            md={8}
            lg={5}
            onChange={(e) => setQuery({ is_balance_transfer: e })}
            defaultValue={
              query.is_balance_transfer ? query?.is_balance_transfer : undefined
            }
            options={[
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
          />
        </>
      }
    >
      <AntTable
        dataSource={data?.data}
        rowKey={'_id'}
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
                <Table.Summary.Cell index={0} colSpan={4}></Table.Summary.Cell>

                <Table.Summary.Cell index={1}>
                  {dueNumberFormat(totalDebit)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {advanceNumberFormat(totalCredit)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <Typography.Paragraph
                    strong
                    style={{ margin: 0, textAlign: 'right' }}
                  >
                    Available Balance:
                  </Typography.Paragraph>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={0} colSpan={4}>
                  {totalCredit > totalDebit
                    ? advanceNumberFormat(totalCredit - totalDebit)
                    : dueNumberFormat(totalCredit - totalDebit)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </ReportContainer>
  );
};

export default AccountTransaction;
