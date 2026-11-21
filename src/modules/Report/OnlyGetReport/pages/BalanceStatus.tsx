import { Table } from 'antd';
import { SelectAccount } from '../../../../common/SelectWithApi/Select';
import AntTable from '../../../../common/Table/AntTable';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { useGetAccountBalanceStatusQuery } from '../api/OnlyGetReportEndpoints';

const BalanceStatus = () => {
  const { query, setQuery } = useQueryParams<{ account_ids: string }>(false);

  const { data, isFetching, isLoading } = useGetAccountBalanceStatusQuery(query);

  const totalAmount = data?.data?.reduce((acc, item) => acc + Number(item.balance), 0) || 0;

  const columns = [
    { dataIndex: 'name', key: 'name', title: 'Account Name' },
    { dataIndex: 'account_type', key: 'account_type', title: 'Account Type' },
    { dataIndex: 'bank_name', key: 'bank_name', title: 'Bank Name' },
    { dataIndex: 'acc_number', key: 'acc_number', title: 'Account Number' },
    { dataIndex: 'balance', key: 'balance', title: 'Current Balance', render: (val: number | string) => numberWithComma(val) },
  ];

  return (
    <ReportContainer
      title='Balance Status Report'
      options={{ showDateRange: false }}
      exportExcel={data?.data ? {
        data: data.data,
        fileName: 'Balance_Status_Report',
        columns: columns,
        summary: { name: 'Total Amount:', balance: totalAmount }
      } : undefined}
      additionalFilter={
        <>
          <SelectAccount
            label='Account'
            name='account_ids'
            sm={8}
            md={8}
            lg={5}
            mode='multiple'
            onChange={(e) => setQuery({ account_ids: Array.isArray(e) ? e.join(',') : e })}
            defaultValue={query.account_ids ? query.account_ids.split(',') : undefined}
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
        pagination={false}
        columns={columns}
        summary={() => {
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align='right'></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align='right' colSpan={4}><strong>Total Amount: </strong></Table.Summary.Cell>
              <Table.Summary.Cell index={2} ><strong>{numberWithComma(totalAmount)}</strong></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </ReportContainer>
  );
};

export default BalanceStatus;
