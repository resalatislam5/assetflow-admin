import { Card, Col, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import AntTable from '../../../../common/Table/AntTable';
import { TreeSelectAccountHead } from '../../../../common/SelectWithApi';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import { useGetGeneralLedgerQuery } from '../api/generalLedgerEndpoints';
import type { IGeneralLedgerItem, IGeneralLedgerQuery } from '../types/generalLedgerTypes';

const GeneralLedgerReport = () => {
  const { query, setQuery } = useQueryParams<IGeneralLedgerQuery>();
  const { data, isLoading, isFetching } = useGetGeneralLedgerQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const summary = data?.summary || {
    opening_balance: 0,
    total_debit: 0,
    total_credit: 0,
    net_change: 0,
    closing_balance: 0,
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'ASSET':
        return 'blue';
      case 'LIABILITY':
        return 'volcano';
      case 'EQUITY':
        return 'purple';
      case 'REVENUE':
        return 'green';
      case 'EXPENSE':
        return 'gold';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      title: 'Date',
      width: 120,
      render: (text: string) => dateAndTimeFormat(text),
    },
    {
      dataIndex: 'voucher_no',
      key: 'voucher_no',
      title: 'Voucher No',
      width: 140,
      render: (text: string) => <Tag color='blue'>{text || '-'}</Tag>,
    },
    {
      dataIndex: 'head_name',
      key: 'head_name',
      title: 'Account Head',
      width: 220,
      render: (text: string, record: IGeneralLedgerItem) => (
        <Space direction='vertical' size={2}>
          <Space orientation='horizontal' size={4} wrap>
            <span style={{ fontWeight: 600 }}>{text}</span>
            {record.head_code ? <Tag color='cyan'>{record.head_code}</Tag> : null}
          </Space>
          <Tag color={getCategoryColor(record.account_category)} style={{ margin: 0 }}>
            {record.account_category}
          </Tag>
        </Space>
      ),
    },
    {
      dataIndex: 'account_name',
      key: 'account_name',
      title: 'Sub-Account',
      width: 150,
      render: (text?: string, record?: IGeneralLedgerItem) =>
        text ? (
          <Space direction='vertical' size={0}>
            <span>{text}</span>
            {record?.account_number ? (
              <span style={{ fontSize: 11, color: '#888' }}>{record.account_number}</span>
            ) : null}
          </Space>
        ) : (
          <span style={{ color: '#aaa' }}>-</span>
        ),
    },
    {
      dataIndex: 'description',
      key: 'description',
      title: 'Particulars',
      render: (text: string, record: IGeneralLedgerItem) => {
        const partyName = record.customer_name || record.supplier_name;
        return (
          <Space direction='vertical' size={2}>
            <span>{text || '-'}</span>
            {partyName ? (
              <span style={{ fontSize: 11, color: '#1677ff' }}>
                Party: {partyName} {record.customer_code ? `(${record.customer_code})` : ''}
              </span>
            ) : null}
          </Space>
        );
      },
    },
    {
      dataIndex: 'debit_amount',
      key: 'debit_amount',
      title: 'Debit (৳)',
      width: 120,
      align: 'right' as const,
      render: (amount: number) =>
        amount > 0 ? (
          <span style={{ color: '#389e0d', fontWeight: 600 }}>৳ {numberWithComma(amount)}</span>
        ) : (
          <span style={{ color: '#ccc' }}>-</span>
        ),
    },
    {
      dataIndex: 'credit_amount',
      key: 'credit_amount',
      title: 'Credit (৳)',
      width: 120,
      align: 'right' as const,
      render: (amount: number) =>
        amount > 0 ? (
          <span style={{ color: '#cf1322', fontWeight: 600 }}>৳ {numberWithComma(amount)}</span>
        ) : (
          <span style={{ color: '#ccc' }}>-</span>
        ),
    },
    {
      dataIndex: 'running_balance',
      key: 'running_balance',
      title: 'Balance (৳)',
      width: 130,
      align: 'right' as const,
      render: (amount: number) => (
        <span style={{ fontWeight: 700, color: amount >= 0 ? '#1677ff' : '#cf1322' }}>
          ৳ {numberWithComma(amount)}
        </span>
      ),
    },
  ];

  return (
    <ReportContainer
      title='General Ledger'
      options={{ showSearch: true }}
      exportExcel={
        data?.data
          ? {
              data: data.data,
              fileName: 'General_Ledger_Report',
              columns: columns,
              summary: {
                description: 'Closing Balance:',
                debit_amount: summary.total_debit,
                credit_amount: summary.total_credit,
                running_balance: summary.closing_balance,
              },
            }
          : undefined
      }
      additionalFilter={
        <Space wrap>
          <TreeSelectAccountHead
            standalone
            placeholder='All Account Heads'
            value={
              query.head_id
                ? String(query.head_id).startsWith('acc_')
                  ? String(query.head_id)
                  : Number(query.head_id)
                : undefined
            }
            onChange={(val) => setQuery({ head_id: val, page: 1 })}
            style={{ width: 220 }}
          />
          <Select
            placeholder='All Categories'
            allowClear
            value={query.account_category}
            onChange={(val) => setQuery({ account_category: val, page: 1 })}
            style={{ width: 150 }}
            options={[
              { label: 'Asset', value: 'ASSET' },
              { label: 'Liability', value: 'LIABILITY' },
              { label: 'Equity', value: 'EQUITY' },
              { label: 'Revenue', value: 'REVENUE' },
              { label: 'Expense', value: 'EXPENSE' },
            ]}
          />
          <Select
            placeholder='Entry Type'
            allowClear
            value={query.type}
            onChange={(val) => setQuery({ type: val, page: 1 })}
            style={{ width: 120 }}
            options={[
              { label: 'Debit', value: 'DEBIT' },
              { label: 'Credit', value: 'CREDIT' },
            ]}
          />
        </Space>
      }
    >
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Opening Balance'
              value={summary.opening_balance}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 16, color: '#595959' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Total Debit'
              value={summary.total_debit}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 16, color: '#389e0d' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Total Credit'
              value={summary.total_credit}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 16, color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Net Change'
              value={summary.net_change}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 16, color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Closing Balance'
              value={summary.closing_balance}
              precision={2}
              prefix='৳'
              valueStyle={{
                fontSize: 16,
                fontWeight: 700,
                color: summary.closing_balance >= 0 ? '#1677ff' : '#cf1322',
              }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IGeneralLedgerItem>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={columns}
        summary={() => {
          if (!data?.data?.length) return null;
          return (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 600 }}>
                <Table.Summary.Cell index={0} colSpan={5} align='right'>
                  <Typography.Text strong>Period Total:</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <Typography.Text strong style={{ color: '#389e0d' }}>
                    ৳ {numberWithComma(summary.total_debit)}
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align='right'>
                  <Typography.Text strong style={{ color: '#cf1322' }}>
                    ৳ {numberWithComma(summary.total_credit)}
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align='right'>
                  <Typography.Text
                    strong
                    style={{ color: summary.closing_balance >= 0 ? '#1677ff' : '#cf1322' }}
                  >
                    ৳ {numberWithComma(summary.closing_balance)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </ReportContainer>
  );
};

export default GeneralLedgerReport;
