import {
  Alert,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import { useGetIncomeStatementQuery } from '../api/incomeStatementEndpoints';
import type {
  IIncomeStatementLine,
  IIncomeStatementQuery,
} from '../types/incomeStatementTypes';

const IncomeStatementReport = () => {
  const { query } = useQueryParams<IIncomeStatementQuery>();
  const { data, isLoading, isFetching } = useGetIncomeStatementQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const statement = data?.data;
  const summary = statement?.summary || {
    total_revenue: 0,
    total_cogs: 0,
    gross_profit: 0,
    gross_profit_margin: 0,
    total_operating_expense: 0,
    total_expense: 0,
    net_profit: 0,
    net_profit_margin: 0,
    status: 'BREAK_EVEN',
  };

  const revenueColumns = [
    {
      dataIndex: 'head_code',
      key: 'head_code',
      title: 'Code',
      width: 100,
      render: (code?: string) => (code ? <Tag color='cyan'>{code}</Tag> : '—'),
    },
    {
      dataIndex: 'head_name',
      key: 'head_name',
      title: 'Revenue Stream',
      render: (name: string) => <span style={{ fontWeight: 600 }}>{name}</span>,
    },
    {
      dataIndex: 'total_credit',
      key: 'total_credit',
      title: 'Gross Revenue (৳)',
      align: 'right' as const,
      width: 170,
      render: (val: number) => (
        <span style={{ color: '#595959' }}>৳ {numberWithComma(val || 0)}</span>
      ),
    },
    {
      dataIndex: 'total_debit',
      key: 'total_debit',
      title: 'Returns / Discounts (৳)',
      align: 'right' as const,
      width: 190,
      render: (val: number) => (
        <span style={{ color: val > 0 ? '#cf1322' : '#aaa' }}>
          {val > 0 ? `- ৳ ${numberWithComma(val)}` : '—'}
        </span>
      ),
    },
    {
      dataIndex: 'net_amount',
      key: 'net_amount',
      title: 'Net Revenue (৳)',
      align: 'right' as const,
      width: 180,
      render: (val: number) => (
        <span style={{ color: '#389e0d', fontWeight: 700 }}>
          ৳ {numberWithComma(val || 0)}
        </span>
      ),
    },
  ];

  const expenseColumns = [
    {
      dataIndex: 'head_code',
      key: 'head_code',
      title: 'Code',
      width: 100,
      render: (code?: string) => (code ? <Tag color='gold'>{code}</Tag> : '—'),
    },
    {
      dataIndex: 'head_name',
      key: 'head_name',
      title: 'Expense Item',
      render: (name: string) => <span style={{ fontWeight: 600 }}>{name}</span>,
    },
    {
      dataIndex: 'total_debit',
      key: 'total_debit',
      title: 'Gross Expense (৳)',
      align: 'right' as const,
      width: 170,
      render: (val: number) => (
        <span style={{ color: '#595959' }}>৳ {numberWithComma(val || 0)}</span>
      ),
    },
    {
      dataIndex: 'total_credit',
      key: 'total_credit',
      title: 'Reversals / Credits (৳)',
      align: 'right' as const,
      width: 190,
      render: (val: number) => (
        <span style={{ color: val > 0 ? '#389e0d' : '#aaa' }}>
          {val > 0 ? `- ৳ ${numberWithComma(val)}` : '—'}
        </span>
      ),
    },
    {
      dataIndex: 'net_amount',
      key: 'net_amount',
      title: 'Net Expense (৳)',
      align: 'right' as const,
      width: 180,
      render: (val: number) => (
        <span style={{ color: '#cf1322', fontWeight: 700 }}>
          ৳ {numberWithComma(val || 0)}
        </span>
      ),
    },
  ];

  const exportData = [
    ...(statement?.revenue_heads || []).map((h) => ({
      category: 'REVENUE',
      head_code: h.head_code || '',
      head_name: h.head_name,
      net_amount: h.net_amount,
    })),
    ...(statement?.cogs_heads || []).map((h) => ({
      category: 'COGS',
      head_code: h.head_code || '',
      head_name: h.head_name,
      net_amount: h.net_amount,
    })),
    ...(statement?.operating_expense_heads || []).map((h) => ({
      category: 'EXPENSE',
      head_code: h.head_code || '',
      head_name: h.head_name,
      net_amount: h.net_amount,
    })),
  ];

  return (
    <ReportContainer
      title='Income Statement'
      options={{ showSearch: false }}
      exportExcel={
        exportData.length > 0
          ? {
              data: exportData,
              fileName: 'Income_Statement_Report',
              columns: [
                { dataIndex: 'category', title: 'Category' },
                { dataIndex: 'head_code', title: 'Code' },
                { dataIndex: 'head_name', title: 'Account Head' },
                { dataIndex: 'net_amount', title: 'Net Amount (৳)' },
              ],
              summary: {
                head_name: 'Net Profit:',
                net_amount: summary.net_profit,
              },
            }
          : undefined
      }
    >
      <Alert
        message={
          summary.status === 'PROFIT'
            ? `Net Profit: ৳ ${numberWithComma(summary.net_profit)} (Net Margin: ${summary.net_profit_margin}%)`
            : summary.status === 'LOSS'
              ? `Net Loss: ৳ ${numberWithComma(Math.abs(summary.net_profit))}`
              : 'Operating at Break-Even'
        }
        description={`Period Performance: Net Revenue ৳ ${numberWithComma(summary.total_revenue)} vs Total Expenses ৳ ${numberWithComma(summary.total_expense)}.`}
        type={
          summary.status === 'PROFIT'
            ? 'success'
            : summary.status === 'LOSS'
              ? 'error'
              : 'info'
        }
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
      />

      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Total Revenue'
              value={summary.total_revenue}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#389e0d', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Cost of Goods (COGS)'
              value={summary.total_cogs}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Gross Profit'
              value={summary.gross_profit}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#13c2c2', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Operating Expenses'
              value={summary.total_operating_expense}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title={summary.status === 'LOSS' ? 'Net Loss' : 'Net Profit'}
              value={Math.abs(summary.net_profit)}
              precision={2}
              prefix='৳ '
              valueStyle={{
                fontSize: 16,
                fontWeight: 700,
                color: summary.status === 'PROFIT' ? '#1677ff' : '#cf1322',
              }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Net Margin'
              value={summary.net_profit_margin}
              precision={2}
              suffix='%'
              valueStyle={{
                fontSize: 16,
                color: summary.net_profit_margin >= 0 ? '#52c41a' : '#f5222d',
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        size='small'
        title={
          <Space>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#237804' }}>
              1. Operating Revenue
            </span>
            <Tag color='green'>CREDIT NORMAL</Tag>
          </Space>
        }
        style={{ marginBottom: 20, borderRadius: 8 }}
      >
        <Table<IIncomeStatementLine>
          dataSource={statement?.revenue_heads}
          rowKey='head_id'
          bordered
          size='small'
          loading={isFetching || isLoading}
          pagination={false}
          columns={revenueColumns}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#f6ffed', fontWeight: 700 }}>
                <Table.Summary.Cell index={0} colSpan={4} align='right'>
                  <Typography.Text strong>Total Operating Revenue:</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <Typography.Text strong style={{ color: '#389e0d', fontSize: 15 }}>
                    ৳ {numberWithComma(summary.total_revenue)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      {statement?.cogs_heads && statement.cogs_heads.length > 0 ? (
        <Card
          size='small'
          title={
            <Space>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#d46b08' }}>
                2. Cost of Goods Sold (Direct Costs)
              </span>
              <Tag color='orange'>DIRECT EXPENSE</Tag>
            </Space>
          }
          style={{ marginBottom: 20, borderRadius: 8 }}
        >
          <Table<IIncomeStatementLine>
            dataSource={statement.cogs_heads}
            rowKey='head_id'
            bordered
            size='small'
            loading={isFetching || isLoading}
            pagination={false}
            columns={expenseColumns}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: '#fff7e6', fontWeight: 700 }}>
                  <Table.Summary.Cell index={0} colSpan={4} align='right'>
                    <Typography.Text strong>Total Cost of Goods Sold:</Typography.Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align='right'>
                    <Typography.Text strong style={{ color: '#fa8c16', fontSize: 15 }}>
                      ৳ {numberWithComma(summary.total_cogs)}
                    </Typography.Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>
      ) : null}

      <Card
        size='small'
        title={
          <Space>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#a8071a' }}>
              {statement?.cogs_heads && statement.cogs_heads.length > 0
                ? '3. Operating Expenses'
                : '2. Operating Expenses'}
            </span>
            <Tag color='red'>DEBIT NORMAL</Tag>
          </Space>
        }
        style={{ marginBottom: 20, borderRadius: 8 }}
      >
        <Table<IIncomeStatementLine>
          dataSource={statement?.operating_expense_heads}
          rowKey='head_id'
          bordered
          size='small'
          loading={isFetching || isLoading}
          pagination={false}
          columns={expenseColumns}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#fff1f0', fontWeight: 700 }}>
                <Table.Summary.Cell index={0} colSpan={4} align='right'>
                  <Typography.Text strong>Total Operating Expenses:</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <Typography.Text strong style={{ color: '#cf1322', fontSize: 15 }}>
                    ৳ {numberWithComma(summary.total_operating_expense)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      <Card
        size='small'
        style={{
          borderRadius: 8,
          background: summary.status === 'PROFIT' ? '#f6ffed' : '#fff1f0',
          borderColor: summary.status === 'PROFIT' ? '#b7eb8f' : '#ffa39e',
        }}
      >
        <Row justify='space-between' align='middle'>
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {summary.status === 'PROFIT' ? 'Net Operating Profit' : 'Net Operating Loss'}
            </Typography.Title>
            <Typography.Text type='secondary'>
              Calculation: Total Revenue (৳ {numberWithComma(summary.total_revenue)}) - Total Expenses (৳ {numberWithComma(summary.total_expense)})
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                color: summary.status === 'PROFIT' ? '#389e0d' : '#cf1322',
              }}
            >
              ৳ {numberWithComma(summary.net_profit)}
            </Typography.Title>
          </Col>
        </Row>
      </Card>
    </ReportContainer>
  );
};

export default IncomeStatementReport;
