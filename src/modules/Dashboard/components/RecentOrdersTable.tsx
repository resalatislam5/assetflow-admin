import React from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { IRecentOrder } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  orders?: IRecentOrder[];
  loading?: boolean;
}

const defaultOrders: IRecentOrder[] = [
  {
    id: '1',
    order_number: 'SM-2026-9041',
    customer_name: 'Tanvir Hossain',
    customer_phone: '+8801712345678',
    total_amount: 3450,
    payment_method: 'bKash',
    status: 'DELIVERED',
    created_at: '2026-10-18T16:20:00Z',
  },
  {
    id: '2',
    order_number: 'SM-2026-9042',
    customer_name: 'Farhana Akter',
    customer_phone: '+8801819876543',
    total_amount: 1890,
    payment_method: 'Cash On Delivery',
    status: 'PROCESSING',
    created_at: '2026-10-18T17:45:00Z',
  },
  {
    id: '3',
    order_number: 'SM-2026-9043',
    customer_name: 'Mahmudul Hasan',
    customer_phone: '+8801911223344',
    total_amount: 5200,
    payment_method: 'Nagad',
    status: 'SHIPPED',
    created_at: '2026-10-18T18:10:00Z',
  },
  {
    id: '4',
    order_number: 'SM-2026-9044',
    customer_name: 'Sabrina Rahman',
    customer_phone: '+8801615566778',
    total_amount: 870,
    payment_method: 'bKash',
    status: 'PENDING',
    created_at: '2026-10-18T19:30:00Z',
  },
  {
    id: '5',
    order_number: 'SM-2026-9045',
    customer_name: 'Kazi Ashraf',
    customer_phone: '+8801519988776',
    total_amount: 4100,
    payment_method: 'Visa / MC',
    status: 'DELIVERED',
    created_at: '2026-10-18T20:15:00Z',
  },
];

const statusColorMap: Record<string, string> = {
  DELIVERED: 'green',
  PROCESSING: 'orange',
  SHIPPED: 'blue',
  PENDING: 'gold',
  CANCELLED: 'red',
};

const RecentOrdersTable: React.FC<Props> = ({ orders = defaultOrders, loading }) => {
  const columns: ColumnsType<IRecentOrder> = [
    {
      title: 'Order ID',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (text) => (
        <span style={{ fontWeight: 600, color: '#10B981' }}>{text}</span>
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
          ৳{amount.toLocaleString()}
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
            Recent Customer Orders
          </Title>
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>
            Latest orders placed on AssetFlow
          </Text>
        </div>
      }
    >
      <Table
        dataSource={orders}
        columns={columns}
        rowKey='id'
        loading={loading}
        pagination={false}
        size='small'
      />
    </Card>
  );
};

export default RecentOrdersTable;
