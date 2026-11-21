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
import { useGetBalanceSheetQuery } from '../api/balanceSheetEndpoints';
import type {
  IBalanceSheetItem,
  IBalanceSheetQuery,
} from '../types/balanceSheetTypes';

const BalanceSheetReport = () => {
  const { query } = useQueryParams<IBalanceSheetQuery>();
  const { data, isLoading, isFetching } = useGetBalanceSheetQuery(query, {
    skip: !query?.to_date && !query?.as_of_date && !query?.from_date,
  });

  const sheet = data?.data;
  const summary = sheet?.summary || {
    total_current_assets: 0,
    total_non_current_assets: 0,
    total_assets: 0,
    total_current_liabilities: 0,
    total_non_current_liabilities: 0,
    total_liabilities: 0,
    total_equity: 0,
    total_liabilities_and_equity: 0,
    retained_earnings: 0,
    difference: 0,
    is_balanced: true,
  };

  const columns = [
    {
      dataIndex: 'code',
      key: 'code',
      title: 'Code / Type',
      width: 140,
      render: (code?: string) => (code ? <Tag color='blue'>{code}</Tag> : '—'),
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Account / Particular',
      render: (name: string, record: IBalanceSheetItem) => (
        <Space direction='vertical' size={1}>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.note ? (
            <span style={{ fontSize: 11, color: '#888' }}>{record.note}</span>
          ) : null}
        </Space>
      ),
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      title: 'Amount (৳)',
      align: 'right' as const,
      width: 180,
      render: (val: number) => (
        <span style={{ fontWeight: 600, color: val >= 0 ? '#1f2937' : '#cf1322' }}>
          ৳ {numberWithComma(val || 0)}
        </span>
      ),
    },
  ];

  const exportData = [
    ...(sheet?.current_assets || []).map((i) => ({
      section: 'Current Assets',
      code: i.code || '',
      name: i.name,
      amount: i.amount,
      note: i.note || '',
    })),
    ...(sheet?.non_current_assets || []).map((i) => ({
      section: 'Non-Current Assets',
      code: i.code || '',
      name: i.name,
      amount: i.amount,
      note: i.note || '',
    })),
    ...(sheet?.current_liabilities || []).map((i) => ({
      section: 'Current Liabilities',
      code: i.code || '',
      name: i.name,
      amount: i.amount,
      note: i.note || '',
    })),
    ...(sheet?.non_current_liabilities || []).map((i) => ({
      section: 'Non-Current Liabilities',
      code: i.code || '',
      name: i.name,
      amount: i.amount,
      note: i.note || '',
    })),
    ...(sheet?.equity_items || []).map((i) => ({
      section: 'Equity',
      code: i.code || '',
      name: i.name,
      amount: i.amount,
      note: i.note || '',
    })),
  ];

  return (
    <ReportContainer
      title='Balance Sheet'
      options={{ showSearch: false }}
      exportExcel={
        exportData.length > 0
          ? {
              data: exportData,
              fileName: 'Balance_Sheet_Report',
              columns: [
                { dataIndex: 'section', title: 'Section' },
                { dataIndex: 'code', title: 'Code' },
                { dataIndex: 'name', title: 'Particular' },
                { dataIndex: 'amount', title: 'Amount (৳)' },
                { dataIndex: 'note', title: 'Notes' },
              ],
              summary: {
                name: 'Total Assets:',
                amount: summary.total_assets,
              },
            }
          : undefined
      }
    >
      <Alert
        message={
          summary.is_balanced
            ? 'Balance Sheet in Strict Equilibrium (Assets = Liabilities + Equity)'
            : `Balance Sheet Difference: ৳ ${numberWithComma(summary.difference)}`
        }
        description={`Fundamental Accounting Equation: Total Assets (৳ ${numberWithComma(summary.total_assets)}) = Total Liabilities (৳ ${numberWithComma(summary.total_liabilities)}) + Total Equity (৳ ${numberWithComma(summary.total_equity)}).`}
        type={summary.is_balanced ? 'success' : 'warning'}
        showIcon
        style={{ marginBottom: 16, borderRadius: 8 }}
      />

      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Total Assets'
              value={summary.total_assets}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#389e0d', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Current Assets'
              value={summary.total_current_assets}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Total Liabilities'
              value={summary.total_liabilities}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Total Equity'
              value={summary.total_equity}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#722ed1', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Liabilities & Equity'
              value={summary.total_liabilities_and_equity}
              precision={2}
              prefix='৳ '
              valueStyle={{ fontSize: 16, color: '#1677ff', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Difference'
              value={summary.difference}
              precision={2}
              prefix='৳ '
              valueStyle={{
                fontSize: 16,
                color: summary.is_balanced ? '#52c41a' : '#cf1322',
                fontWeight: 700,
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
              1. Assets
            </span>
            <Tag color='green'>DEBIT NORMAL</Tag>
          </Space>
        }
        style={{ marginBottom: 20, borderRadius: 8 }}
      >
        <Typography.Title level={5} style={{ margin: '8px 0', color: '#13c2c2' }}>
          Current Assets (Cash, Bank, Receivables, Inventory)
        </Typography.Title>
        <Table<IBalanceSheetItem>
          dataSource={sheet?.current_assets}
          rowKey='id'
          bordered
          size='small'
          loading={isFetching || isLoading}
          pagination={false}
          columns={columns}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#e6fffb', fontWeight: 700 }}>
                <Table.Summary.Cell index={0} colSpan={2} align='right'>
                  <Typography.Text strong>Total Current Assets:</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <Typography.Text strong style={{ color: '#08979c', fontSize: 14 }}>
                    ৳ {numberWithComma(summary.total_current_assets)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        {sheet?.non_current_assets && sheet.non_current_assets.length > 0 ? (
          <>
            <Typography.Title level={5} style={{ margin: '16px 0 8px', color: '#1677ff' }}>
              Non-Current Assets (Fixed Assets, Property, Equipment)
            </Typography.Title>
            <Table<IBalanceSheetItem>
              dataSource={sheet.non_current_assets}
              rowKey='id'
              bordered
              size='small'
              loading={isFetching || isLoading}
              pagination={false}
              columns={columns}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row style={{ backgroundColor: '#e6f4ff', fontWeight: 700 }}>
                    <Table.Summary.Cell index={0} colSpan={2} align='right'>
                      <Typography.Text strong>Total Non-Current Assets:</Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align='right'>
                      <Typography.Text strong style={{ color: '#0958d9', fontSize: 14 }}>
                        ৳ {numberWithComma(summary.total_non_current_assets)}
                      </Typography.Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </>
        ) : null}

        <Card
          size='small'
          style={{
            marginTop: 12,
            background: '#f6ffed',
            borderColor: '#b7eb8f',
            borderRadius: 6,
          }}
        >
          <Row justify='space-between' align='middle'>
            <Col>
              <Typography.Text strong style={{ fontSize: 15, color: '#237804' }}>
                TOTAL ASSETS
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Text strong style={{ fontSize: 16, color: '#237804' }}>
                ৳ {numberWithComma(summary.total_assets)}
              </Typography.Text>
            </Col>
          </Row>
        </Card>
      </Card>

      <Card
        size='small'
        title={
          <Space>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#d4380d' }}>
              2. Liabilities
            </span>
            <Tag color='volcano'>CREDIT NORMAL</Tag>
          </Space>
        }
        style={{ marginBottom: 20, borderRadius: 8 }}
      >
        <Typography.Title level={5} style={{ margin: '8px 0', color: '#fa8c16' }}>
          Current Liabilities (Accounts Payable, Short-Term Debt)
        </Typography.Title>
        <Table<IBalanceSheetItem>
          dataSource={sheet?.current_liabilities}
          rowKey='id'
          bordered
          size='small'
          loading={isFetching || isLoading}
          pagination={false}
          columns={columns}
          locale={{ emptyText: 'No current liabilities recorded' }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#fff7e6', fontWeight: 700 }}>
                <Table.Summary.Cell index={0} colSpan={2} align='right'>
                  <Typography.Text strong>Total Current Liabilities:</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <Typography.Text strong style={{ color: '#d46b08', fontSize: 14 }}>
                    ৳ {numberWithComma(summary.total_current_liabilities)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        {sheet?.non_current_liabilities && sheet.non_current_liabilities.length > 0 ? (
          <>
            <Typography.Title level={5} style={{ margin: '16px 0 8px', color: '#cf1322' }}>
              Non-Current Liabilities (Long-Term Loans, Mortgages)
            </Typography.Title>
            <Table<IBalanceSheetItem>
              dataSource={sheet.non_current_liabilities}
              rowKey='id'
              bordered
              size='small'
              loading={isFetching || isLoading}
              pagination={false}
              columns={columns}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row style={{ backgroundColor: '#fff1f0', fontWeight: 700 }}>
                    <Table.Summary.Cell index={0} colSpan={2} align='right'>
                      <Typography.Text strong>Total Non-Current Liabilities:</Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align='right'>
                      <Typography.Text strong style={{ color: '#cf1322', fontSize: 14 }}>
                        ৳ {numberWithComma(summary.total_non_current_liabilities)}
                      </Typography.Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </>
        ) : null}

        <Card
          size='small'
          style={{
            marginTop: 12,
            background: '#fff7e6',
            borderColor: '#ffd591',
            borderRadius: 6,
          }}
        >
          <Row justify='space-between' align='middle'>
            <Col>
              <Typography.Text strong style={{ fontSize: 15, color: '#d4380d' }}>
                TOTAL LIABILITIES
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Text strong style={{ fontSize: 16, color: '#d4380d' }}>
                ৳ {numberWithComma(summary.total_liabilities)}
              </Typography.Text>
            </Col>
          </Row>
        </Card>
      </Card>

      <Card
        size='small'
        title={
          <Space>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#531dab' }}>
              3. Equity
            </span>
            <Tag color='purple'>CREDIT NORMAL</Tag>
          </Space>
        }
        style={{ marginBottom: 20, borderRadius: 8 }}
      >
        <Typography.Title level={5} style={{ margin: '8px 0', color: '#722ed1' }}>
          Owner's Equity & Retained Earnings
        </Typography.Title>
        <Table<IBalanceSheetItem>
          dataSource={sheet?.equity_items}
          rowKey='id'
          bordered
          size='small'
          loading={isFetching || isLoading}
          pagination={false}
          columns={columns}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#f9f0ff', fontWeight: 700 }}>
                <Table.Summary.Cell index={0} colSpan={2} align='right'>
                  <Typography.Text strong>Total Equity:</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <Typography.Text strong style={{ color: '#722ed1', fontSize: 14 }}>
                    ৳ {numberWithComma(summary.total_equity)}
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        <Card
          size='small'
          style={{
            marginTop: 12,
            background: '#f9f0ff',
            borderColor: '#d3adf7',
            borderRadius: 6,
          }}
        >
          <Row justify='space-between' align='middle'>
            <Col>
              <Typography.Text strong style={{ fontSize: 15, color: '#531dab' }}>
                TOTAL EQUITY
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Text strong style={{ fontSize: 16, color: '#531dab' }}>
                ৳ {numberWithComma(summary.total_equity)}
              </Typography.Text>
            </Col>
          </Row>
        </Card>
      </Card>

      <Card
        size='small'
        style={{
          borderRadius: 8,
          background: '#f8fafc',
          borderColor: '#cbd5e1',
        }}
      >
        <Row justify='space-between' align='middle'>
          <Col>
            <Typography.Title level={4} style={{ margin: 0, color: '#1e293b' }}>
              TOTAL LIABILITIES & EQUITY
            </Typography.Title>
            <Typography.Text type='secondary'>
              Total Liabilities (৳ {numberWithComma(summary.total_liabilities)}) + Total Equity (৳ {numberWithComma(summary.total_equity)})
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Title level={3} style={{ margin: 0, color: '#1677ff' }}>
              ৳ {numberWithComma(summary.total_liabilities_and_equity)}
            </Typography.Title>
          </Col>
        </Row>
      </Card>
    </ReportContainer>
  );
};

export default BalanceSheetReport;

