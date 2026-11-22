import React from 'react';
import { Button, Card, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router';
import { Icon } from '@iconify/react';
import type { IRecentOrder } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  orders?: IRecentOrder[];
  loading?: boolean;
}

const statusColorMap: Record<string, string> = {
  COMPLETED: 'green',
  DELIVERED: 'green',
  PROCESSING: 'orange',
  SHIPPED: 'blue',
  PENDING: 'gold',
  CANCELLED: 'red',
  RETURNED: 'purple',
};

const RecentOrdersTable: React.FC<Props> = ({ orders = [], loading }) => {
  const columns: ColumnsType<IRecentOrder> = [
    {
      title: 'Invoice No',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (text, record) => (
        <Link to={`/invoices`} style={{ fontWeight: 600, color: '#10B981' }}>
          {text || `#${record.id}`}
        </Link>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0F172A' }}>{record.customer_name}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>{record.customer_phone}</div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'branch_name',
      key: 'branch_name',
      render: (branch) => (
        <span style={{ fontSize: 12, color: '#64748B' }}>{branch || 'Global HQ'}</span>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method) => (
        <span style={{ fontSize: 12, color: '#475569' }}>{method}</span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => (
        <span style={{ fontWeight: 700, color: '#0F172A' }}>
          ৳{Number(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColorMap[status] || 'default'} style={{ borderRadius: 10, fontWeight: 600 }}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
      title={
        <div>
          <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
            Recent Sales Invoices
          </Title>
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>
            Latest invoices recorded across active locations
          </Text>
        </div>
      }
      extra={
        <Link to='/invoices'>
          <Button
            type='link'
            size='small'
            style={{ fontWeight: 600, color: '#10B981' }}
            icon={<Icon icon='solar:arrow-right-bold' />}
            iconPosition='end'
          >
            View All
          </Button>
        </Link>
      }
    >
      <Table
        dataSource={orders}
        columns={columns}
        rowKey='id'
        loading={loading}
        pagination={false}
        size='small'
        locale={{ emptyText: 'No recent invoices found' }}
      />
    </Card>
  );
};

export default RecentOrdersTable;
