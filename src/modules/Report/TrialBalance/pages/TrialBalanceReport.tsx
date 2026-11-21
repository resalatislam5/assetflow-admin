import {
  Alert,
  Card,
  Col,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import { useGetTrialBalanceQuery } from '../api/trialBalanceEndpoints';
import type {
  ITrialBalanceItem,
  ITrialBalanceQuery,
} from '../types/trialBalanceTypes';

const TrialBalanceReport = () => {
  const { query, setQuery } = useQueryParams<ITrialBalanceQuery>();

  const { data, isLoading, isFetching } = useGetTrialBalanceQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const summary = data?.summary || {
    total_heads: 0,
    total_debits: 0,
    total_credits: 0,
    difference: 0,
    is_balanced: true,
  };

  const getCategoryTag = (category: string) => {
    switch (category) {
      case 'ASSET':
        return <Tag color='green'>ASSET</Tag>;
      case 'LIABILITY':
        return <Tag color='orange'>LIABILITY</Tag>;
      case 'EQUITY':
        return <Tag color='purple'>EQUITY</Tag>;
      case 'REVENUE':
        return <Tag color='cyan'>REVENUE</Tag>;
      case 'EXPENSE':
        return <Tag color='red'>EXPENSE</Tag>;
      default:
        return <Tag>{category}</Tag>;
    }
  };

  const columns = [
    {
      dataIndex: 'head_code',
      key: 'head_code',
      title: 'Code',
      width: 100,
      render: (code?: string) => (code ? <Tag color='blue'>{code}</Tag> : '—'),
    },
    {
      dataIndex: 'head_name',
      key: 'head_name',
      title: 'Account Head',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      dataIndex: 'account_category',
      key: 'account_category',
      title: 'Category',
      width: 140,
      render: (cat: string) => getCategoryTag(cat),
    },
    {
      dataIndex: 'total_debit',
      key: 'total_debit',
      title: 'Total Debit (৳)',
      align: 'right' as const,
      width: 160,
      render: (val: number) => (
        <span style={{ color: '#389e0d', fontWeight: 600 }}>
          ৳ {numberWithComma(val || 0)}
        </span>
      ),
    },
    {
      dataIndex: 'total_credit',
      key: 'total_credit',
      title: 'Total Credit (৳)',
      align: 'right' as const,
      width: 160,
      render: (val: number) => (
        <span style={{ color: '#cf1322', fontWeight: 600 }}>
          ৳ {numberWithComma(val || 0)}
        </span>
      ),
    },
    {
      dataIndex: 'net_change',
      key: 'net_change',
      title: 'Net Balance (৳)',
      align: 'right' as const,
      width: 160,
      render: (val: number) => {
        const num = Number(val || 0);
        return (
          <span style={{ fontWeight: 600, color: num >= 0 ? '#1677ff' : '#eb2f96' }}>
            ৳ {numberWithComma(num)}
          </span>
        );
      },
    },
  ];

  return (
    <ReportContainer
      title='Trial Balance'
      options={{ showSearch: true }}
      exportExcel={
        data?.data
          ? {
              data: data.data,
              fileName: 'Trial_Balance_Report',
              columns: columns,
              summary: {
                head_name: 'Total:',
                total_debit: summary.total_debits,
                total_credit: summary.total_credits,
                net_change: summary.difference,
              },
            }
          : undefined
      }
      additionalFilter={
        <Space wrap>
          <Select
            placeholder='Account Category'
            allowClear
            value={query.account_category}
            onChange={(val) => setQuery({ account_category: val, page: 1 })}
            style={{ width: 180 }}
            options={[
              { label: 'All Categories', value: '' },
              { label: 'Assets', value: 'ASSET' },
              { label: 'Liabilities', value: 'LIABILITY' },
              { label: 'Equity', value: 'EQUITY' },
              { label: 'Revenue', value: 'REVENUE' },
              { label: 'Expenses', value: 'EXPENSE' },
            ]}
          />
        </Space>
      }
    >
      <Alert
        message={
          summary.is_balanced
            ? 'Trial Balance in Strict Equilibrium'
            : 'Trial Balance Out of Balance'
        }
        description='Every financial movement is strictly balanced across hierarchical Chart of Accounts double-entry debits and credits.'
        type={summary.is_balanced ? 'success' : 'error'}
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: '#f8fafc',
              borderColor: '#cbd5e1',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#475569', fontWeight: 600 }}>
                  Active Account Heads
                </span>
              }
              value={summary.total_heads}
              valueStyle={{ color: '#1e293b', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: '#f6ffed',
              borderColor: '#b7eb8f',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#389e0d', fontWeight: 600 }}>
                  Total Debits
                </span>
              }
              value={summary.total_debits}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: '#fff1f0',
              borderColor: '#ffa39e',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#cf1322', fontWeight: 600 }}>
                  Total Credits
                </span>
              }
              value={summary.total_credits}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#a8071a', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: summary.is_balanced ? '#e6f4ff' : '#fff2e8',
              borderColor: summary.is_balanced ? '#91caff' : '#ffbb96',
            }}
          >
            <Statistic
              title={
                <span
                  style={{
                    color: summary.is_balanced ? '#0958d9' : '#d4380d',
                    fontWeight: 600,
                  }}
                >
                  {summary.is_balanced ? 'Difference' : 'Out of Balance'}
                </span>
              }
              value={summary.difference}
              precision={2}
              prefix='৳ '
              valueStyle={{
                color: summary.is_balanced ? '#003eb3' : '#cf1322',
                fontWeight: 700,
                fontSize: 18,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Table<ITrialBalanceItem>
        dataSource={data?.data}
        rowKey='head_id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        pagination={false}
        columns={columns}
        summary={() => {
          if (!data?.data?.length) return null;
          return (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 600 }}>
                <Table.Summary.Cell index={0} colSpan={3} align='right'>
                  <Typography.Text strong>Total:</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <Typography.Text strong style={{ color: '#389e0d' }}>
                    ৳ {numberWithComma(summary.total_debits)}
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align='right'>
                  <Typography.Text strong style={{ color: '#cf1322' }}>
                    ৳ {numberWithComma(summary.total_credits)}
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align='right'>
                  <Typography.Text strong style={{ color: summary.is_balanced ? '#1677ff' : '#cf1322' }}>
                    ৳ {numberWithComma(summary.difference)}
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

export default TrialBalanceReport;
