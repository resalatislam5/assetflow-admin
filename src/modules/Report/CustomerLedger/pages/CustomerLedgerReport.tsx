import { useMemo } from 'react';
import { Card, Col, Row, Select, Space, Statistic, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import AntTable from '../../../../common/Table/AntTable';
import { SelectBranch, SelectCustomer } from '../../../../common/SelectWithApi/Select';
import { formatDate } from '../../../../common/utils/dateFormat';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import { useGetCustomerLedgerQuery } from '../api/customerLedgerEndpoints';
import type {
  CustomerLedgerTransactionType,
  ICustomerLedgerItem,
  ICustomerLedgerQuery,
} from '../types/customerLedgerTypes';

const { Text } = Typography;

const getTransactionTag = (type: CustomerLedgerTransactionType) => {
  switch (type) {
    case 'ORDER_INVOICE':
      return <Tag color='blue'>Order Invoice</Tag>;
    case 'ORDER_PAYMENT':
      return <Tag color='green'>Payment Received</Tag>;
    case 'ORDER_RETURN':
      return <Tag color='orange'>Order Return</Tag>;
    case 'ORDER_REFUND':
      return <Tag color='purple'>Order Refund</Tag>;
    case 'CUSTOMER_REFUND':
      return <Tag color='magenta'>Customer Refund</Tag>;
    case 'BALANCE_ADJUSTMENT':
      return <Tag color='cyan'>Adjustment</Tag>;
    case 'OPENING_BALANCE':
      return <Tag color='gold'>Opening Balance</Tag>;
    case 'MANUAL':
    default:
      return <Tag>Manual</Tag>;
  }
};

const CustomerLedgerReport = () => {
  const { query, setQuery } = useQueryParams<ICustomerLedgerQuery>();
  const { data, isLoading, isFetching } = useGetCustomerLedgerQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const summary = data?.summary || {
    total_debit: 0,
    total_credit: 0,
    current_balance: 0,
  };

  const columns: ColumnsType<ICustomerLedgerItem> = useMemo(
    () => [
      {
        dataIndex: 'transaction_date',
        key: 'transaction_date',
        title: 'Date',
        width: 110,
        render: (date: string) => formatDate(date),
      },
      {
        dataIndex: 'voucher_no',
        key: 'voucher_no',
        title: 'Voucher / Ref',
        width: 140,
        render: (text: string) => <Text strong>{text || '—'}</Text>,
      },
      {
        dataIndex: 'customer_name',
        key: 'customer_name',
        title: 'Customer',
        render: (name: string, record) => (
          <Space direction='vertical' size={0}>
            <Text strong>{name || 'Walk-in Customer'}</Text>
            <Text type='secondary' style={{ fontSize: 12 }}>
              {record.customer_phone || record.customer_code || ''}
            </Text>
          </Space>
        ),
      },
      {
        dataIndex: 'branch_name',
        key: 'branch_name',
        title: 'Branch',
        width: 130,
        render: (branchName?: string) =>
          branchName ? <Tag color='cyan'>{branchName}</Tag> : <Tag>Global</Tag>,
      },
      {
        dataIndex: 'transaction_type',
        key: 'transaction_type',
        title: 'Transaction Type',
        width: 150,
        render: (type: CustomerLedgerTransactionType) => getTransactionTag(type),
      },
      {
        dataIndex: 'invoice_number',
        key: 'invoice_number',
        title: 'Document Ref',
        width: 140,
        render: (_: unknown, record) =>
          record.invoice_number || record.order_number || record.receipt_number || '—',
      },
      {
        dataIndex: 'amount',
        key: 'debit',
        title: 'Debit (+)',
        width: 120,
        align: 'right',
        render: (_: unknown, record) =>
          record.type === 'DEBIT' ? (
            <Text type='danger' strong>
              ৳{numberWithComma(record.amount)}
            </Text>
          ) : (
            '—'
          ),
      },
      {
        dataIndex: 'amount',
        key: 'credit',
        title: 'Credit (-)',
        width: 120,
        align: 'right',
        render: (_: unknown, record) =>
          record.type === 'CREDIT' ? (
            <Text type='success' strong>
              ৳{numberWithComma(record.amount)}
            </Text>
          ) : (
            '—'
          ),
      },
      {
        dataIndex: 'balance',
        key: 'balance',
        title: 'Running Balance',
        width: 140,
        align: 'right',
        render: (balance: number) => {
          const num = Number(balance || 0);
          return (
            <Text strong style={{ color: num > 0 ? '#cf1322' : '#3f8600' }}>
              ৳{numberWithComma(num)}
            </Text>
          );
        },
      },
      {
        dataIndex: 'description',
        key: 'description',
        title: 'Description',
        render: (desc?: string) => desc || '—',
      },
    ],
    [],
  );

  return (
    <ReportContainer
      title='Customer Ledger Report'
      options={{ showSearch: true, showDateRange: true }}
      exportExcel={
        data?.data
          ? {
              data: data.data,
              fileName: 'Customer_Ledger_Report',
              columns: columns,
              summary: {
                customer_name: 'Grand Total:',
                debit: `৳${numberWithComma(summary.total_debit)}`,
                credit: `৳${numberWithComma(summary.total_credit)}`,
                balance: `৳${numberWithComma(summary.current_balance)}`,
              },
            }
          : undefined
      }
      additionalFilter={
        <Space wrap>
          <SelectCustomer
            standalone
            placeholder='Filter by Customer'
            style={{ width: 220 }}
            value={query.customer_id}
            onChange={(val) => setQuery({ customer_id: val })}
          />
          <SelectBranch
            standalone
            placeholder='Filter by Branch'
            style={{ width: 180 }}
            value={query.branch_id}
            onChange={(val) => setQuery({ branch_id: val })}
          />
          <Select
            allowClear
            placeholder='Filter by Type'
            style={{ width: 130 }}
            value={query.type}
            onChange={(val) => setQuery({ type: val })}
            options={[
              { label: 'Debit (+)', value: 'DEBIT' },
              { label: 'Credit (-)', value: 'CREDIT' },
            ]}
          />
          <Select
            allowClear
            placeholder='Transaction Type'
            style={{ width: 170 }}
            value={query.transaction_type}
            onChange={(val) => setQuery({ transaction_type: val })}
            options={[
              { label: 'Order Invoice', value: 'ORDER_INVOICE' },
              { label: 'Payment Received', value: 'ORDER_PAYMENT' },
              { label: 'Order Return', value: 'ORDER_RETURN' },
              { label: 'Order Refund', value: 'ORDER_REFUND' },
              { label: 'Customer Refund', value: 'CUSTOMER_REFUND' },
              { label: 'Balance Adjustment', value: 'BALANCE_ADJUSTMENT' },
              { label: 'Opening Balance', value: 'OPENING_BALANCE' },
              { label: 'Manual', value: 'MANUAL' },
            ]}
          />
        </Space>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card size='small'>
            <Statistic
              title='Total Invoiced (Debit)'
              value={numberWithComma(summary.total_debit)}
              prefix='৳'
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size='small'>
            <Statistic
              title='Total Received (Credit)'
              value={numberWithComma(summary.total_credit)}
              prefix='৳'
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size='small'>
            <Statistic
              title='Net Customer Due / Balance'
              value={numberWithComma(summary.current_balance)}
              prefix='৳'
              valueStyle={{
                color: summary.current_balance > 0 ? '#cf1322' : '#3f8600',
              }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<ICustomerLedgerItem>
        columns={columns}
        dataSource={data?.data || []}
        loading={isLoading || isFetching}
        total={data?.total || 0}
        rowKey='id'
      />
    </ReportContainer>
  );
};

export default CustomerLedgerReport;
