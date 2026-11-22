import React from 'react';
import { Button, Card, Empty, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router';
import { Icon } from '@iconify/react';
import type { ILowStockAlert } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  items?: ILowStockAlert[];
  loading?: boolean;
}

const LowStockAlertCard: React.FC<Props> = ({ items = [], loading }) => {
  const columns: ColumnsType<ILowStockAlert> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0F172A' }}>{record.product_name}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>SKU: {record.sku}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
      render: (cat) => <span style={{ fontSize: 12, color: '#64748B' }}>{cat || 'General'}</span>,
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <span style={{ fontSize: 12, color: '#475569' }}>
          {record.branch_name || record.warehouse_name || 'All'}
        </span>
      ),
    },
    {
      title: 'Current Stock',
      dataIndex: 'quantity_on_hand',
      key: 'quantity_on_hand',
      render: (qty) => (
        <span style={{ fontWeight: 700, color: Number(qty) <= 0 ? '#DC2626' : '#D97706' }}>
          {Number(qty).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Safety Level',
      dataIndex: 'safety_stock',
      key: 'safety_stock',
      render: (safe) => <span style={{ fontSize: 12, color: '#64748B' }}>{Number(safe).toLocaleString()}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag
          color={Number(record.quantity_on_hand) <= 0 ? 'red' : 'gold'}
          style={{ borderRadius: 10, fontWeight: 600 }}
        >
          {Number(record.quantity_on_hand) <= 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon icon='solar:danger-triangle-bold-duotone' style={{ fontSize: 20, color: '#DC2626' }} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
              Low Stock & Out of Stock Alerts
            </Title>
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>
              Products below safety threshold requiring reorder or replenishment
            </Text>
          </div>
        </div>
      }
      extra={
        <Link to='/inventory/stocks'>
          <Button
            type='link'
            size='small'
            style={{ fontWeight: 600, color: '#10B981' }}
            icon={<Icon icon='solar:arrow-right-bold' />}
            iconPosition='end'
          >
            Manage Inventory
          </Button>
        </Link>
      }
    >
      {items.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='All stock levels are optimal above safety thresholds'
          style={{ padding: '20px 0' }}
        />
      ) : (
        <Table
          dataSource={items}
          columns={columns}
          rowKey='id'
          loading={loading}
          pagination={false}
          size='small'
        />
      )}
    </Card>
  );
};

export default LowStockAlertCard;
