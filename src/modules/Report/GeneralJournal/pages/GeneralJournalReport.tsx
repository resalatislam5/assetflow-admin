import { useMemo } from 'react';
import {
  Card,
  Col,
  Row,
  Select,
  Space,
  Statistic,
} from 'antd';
import dayjs from 'dayjs';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import AntTable from '../../../../common/Table/AntTable';
import { SelectAccount, TreeSelectAccountHead } from '../../../../common/SelectWithApi';
import { useGetGeneralJournalQuery } from '../api/generalJournalEndpoints';
import type {
  IGeneralJournalItem,
  IGeneralJournalQuery,
} from '../types/generalJournalTypes';

interface IJournalEntryLine {
  id: number;
  head_id: number;
  head_name: string;
  head_code?: string;
  account_category?: string;
  account_name?: string;
  account_type?: string;
  account_number?: string;
  customer_name?: string;
  customer_code?: string;
  supplier_name?: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
}

interface IJournalVoucherGroup {
  voucher_no: string;
  transaction_date: string;
  description: string;
  source_type: string;
  source_id?: string;
  created_by_name?: string;
  created_at: string;
  entries: IJournalEntryLine[];
}

const GeneralJournalReport = () => {
  const { query, setQuery } = useQueryParams<IGeneralJournalQuery>();
  const { data, isLoading, isFetching } = useGetGeneralJournalQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const summary = data?.summary || {
    total_debit: 0,
    total_credit: 0,
    net_flow: 0,
  };

  const voucherGroups: IJournalVoucherGroup[] = useMemo(() => {
    if (!data?.data?.length) return [];

    const map = new Map<string, IJournalVoucherGroup>();

    data.data.forEach((item: IGeneralJournalItem) => {
      const vKey = item.voucher_no || `VOUCHER-${item.id}`;
      if (!map.has(vKey)) {
        map.set(vKey, {
          voucher_no: item.voucher_no || '—',
          transaction_date: item.transaction_date || item.created_at,
          description: item.description || '—',
          source_type: item.source_type,
          source_id: item.source_id,
          created_by_name: item.created_by_name,
          created_at: item.created_at,
          entries: [],
        });
      }

      const group = map.get(vKey)!;
      group.entries.push({
        id: item.id,
        head_id: item.head_id,
        head_name: item.head_name,
        head_code: item.head_code,
        account_category: item.account_category,
        account_name: item.account_name,
        account_type: item.account_type,
        account_number: item.account_number,
        customer_name: item.customer_name,
        customer_code: item.customer_code,
        supplier_name: item.supplier_name,
        type: item.type,
        amount: Number(item.amount),
      });
    });

    const groups = Array.from(map.values());
    groups.forEach((g) => {
      g.entries.sort((a, b) => {
        if (a.type === 'DEBIT' && b.type === 'CREDIT') return -1;
        if (a.type === 'CREDIT' && b.type === 'DEBIT') return 1;
        return 0;
      });
    });

    return groups;
  }, [data?.data]);

  return (
    <ReportContainer
      title='General Journal Report'
      additionalFilter={
        <Space wrap>
          <TreeSelectAccountHead
            standalone
            placeholder='All Account Heads'
            value={query.head_id ? (String(query.head_id).startsWith('acc_') ? String(query.head_id) : Number(query.head_id)) : undefined}
            onChange={(val) => setQuery({ head_id: val, page: 1 })}
            style={{ width: 220 }}
          />
          <SelectAccount
            standalone
            placeholder='All Liquid Accounts'
            value={query.account_id ? Number(query.account_id) : undefined}
            onChange={(val) => setQuery({ account_id: val, page: 1 })}
            style={{ width: 200 }}
          />
          <Select
            placeholder='Debit / Credit'
            allowClear
            value={query.type}
            onChange={(val) => setQuery({ type: val, page: 1 })}
            style={{ width: 140 }}
            options={[
              { label: 'Debit (Inflow)', value: 'DEBIT' },
              { label: 'Credit (Outflow)', value: 'CREDIT' },
            ]}
          />
          <Select
            placeholder='Source Voucher'
            allowClear
            value={query.source_type}
            onChange={(val) => setQuery({ source_type: val, page: 1 })}
            style={{ width: 180 }}
            options={[
              { label: 'Sales Invoice', value: 'ORDER_SALES' },
              { label: 'Customer Order Payment', value: 'ORDER_PAYMENT' },
              { label: 'Purchase Bill', value: 'PURCHASE_PAYMENT' },
              { label: 'Supplier Payment', value: 'SUPPLIER_PAYMENT' },
              { label: 'Transfer In', value: 'TRANSFER_IN' },
              { label: 'Transfer Out', value: 'TRANSFER_OUT' },
              { label: 'Balance Adjustment', value: 'ADJUSTMENT_INCREASE' },
            ]}
          />
        </Space>
      }
    >
      <style>{`
        .general-journal-table .ant-table-thead > tr > th {
          background-color: #f7f3ec !important;
          font-weight: 600 !important;
          color: #374151 !important;
        }
      `}</style>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
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
              value={summary.total_debit}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
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
              value={summary.total_credit}
              precision={2}
              prefix='৳ '
              valueStyle={{ color: '#a8071a', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            size='small'
            bordered
            style={{
              borderRadius: 8,
              background: summary.net_flow >= 0 ? '#e6f4ff' : '#fffbe6',
              borderColor: summary.net_flow >= 0 ? '#91caff' : '#ffe58f',
            }}
          >
            <Statistic
              title={
                <span
                  style={{
                    color: summary.net_flow >= 0 ? '#0958d9' : '#d48806',
                    fontWeight: 600,
                  }}
                >
                  Net Equilibrium Flow
                </span>
              }
              value={summary.net_flow}
              precision={2}
              prefix='৳ '
              valueStyle={{
                color: summary.net_flow >= 0 ? '#003eb3' : '#ad6800',
                fontWeight: 700,
                fontSize: 18,
              }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IJournalVoucherGroup>
        className='general-journal-table'
        dataSource={voucherGroups}
        rowKey='voucher_no'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        showSL={false}
        columns={[
          {
            title: 'SL',
            key: 'sl',
            width: 60,
            align: 'center',
            render: (_val, _rec, index) => index + 1,
          },
          {
            dataIndex: 'transaction_date',
            key: 'transaction_date',
            title: 'Date',
            width: 130,
            render: (d: string) => dayjs(d).format('DD MMM YYYY'),
          },
          {
            dataIndex: 'voucher_no',
            key: 'voucher_no',
            title: 'Voucher No',
            width: 140,
            render: (v: string) => (
              <span style={{ fontWeight: 500, color: '#1f2937' }}>{v}</span>
            ),
          },
          {
            dataIndex: 'description',
            key: 'description',
            title: 'Description',
            render: (desc: string) => (
              <span style={{ color: '#374151', fontSize: 13 }}>{desc}</span>
            ),
          },
          {
            key: 'acc_head_name',
            title: 'Acc Head Name',
            render: (_t, record) => (
              <div>
                {record.entries.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    style={{
                      minHeight: 36,
                      display: 'flex',
                      alignItems: 'center',
                      padding: entry.type === 'CREDIT' ? '4px 0 4px 16px' : '4px 0',
                      borderBottom:
                        idx < record.entries.length - 1 ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    <span style={{ fontWeight: 500, color: '#111827' }}>
                      {entry.account_name
                        ? `${entry.account_name} [${entry.head_code || entry.head_id}]`
                        : (entry.head_code === '1120' || entry.head_name.includes('Accounts Receivable')) &&
                          entry.customer_name
                        ? `${entry.customer_name}${entry.customer_code ? ` [${entry.customer_code}]` : ''}`
                        : (entry.head_code === '2110' || entry.head_name.includes('Accounts Payable')) &&
                          entry.supplier_name
                        ? entry.supplier_name
                        : entry.head_name + (entry.head_code ? ` [${entry.head_code}]` : '')}
                    </span>
                  </div>
                ))}
              </div>
            ),
          },
          {
            key: 'debit',
            title: 'Debit',
            align: 'right',
            width: 120,
            render: (_t, record) => (
              <div>
                {record.entries.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    style={{
                      minHeight: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '4px 0',
                      borderBottom:
                        idx < record.entries.length - 1 ? '1px solid #e5e7eb' : 'none',
                      color: entry.type === 'DEBIT' ? '#111827' : '#9ca3af',
                      fontWeight: entry.type === 'DEBIT' ? 500 : 400,
                    }}
                  >
                    {entry.type === 'DEBIT'
                      ? Number(entry.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })
                      : '-'}
                  </div>
                ))}
              </div>
            ),
          },
          {
            key: 'credit',
            title: 'Credit',
            align: 'right',
            width: 120,
            render: (_t, record) => (
              <div>
                {record.entries.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    style={{
                      minHeight: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '4px 0',
                      borderBottom:
                        idx < record.entries.length - 1 ? '1px solid #e5e7eb' : 'none',
                      color: entry.type === 'CREDIT' ? '#111827' : '#9ca3af',
                      fontWeight: entry.type === 'CREDIT' ? 500 : 400,
                    }}
                  >
                    {entry.type === 'CREDIT'
                      ? Number(entry.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })
                      : '-'}
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </ReportContainer>
  );
};

export default GeneralJournalReport;
