import React from 'react';
import { Card, Progress, Typography } from 'antd';
import type { ITopProduct } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  products?: ITopProduct[];
  loading?: boolean;
}

const defaultProducts: ITopProduct[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds Pro',
    category: 'Electronics',
    price: 1850,
    sold_count: 342,
    stock: 85,
  },
  {
    id: '2',
    name: 'Premium Cotton Polo Shirt',
    category: 'Fashion',
    price: 890,
    sold_count: 280,
    stock: 120,
  },
  {
    id: '3',
    name: 'Smart Fitness Band Watch',
    category: 'Gadgets',
    price: 2450,
    sold_count: 215,
    stock: 35,
  },
  {
    id: '4',
    name: 'Organic Honey 500g',
    category: 'Groceries',
    price: 650,
    sold_count: 198,
    stock: 64,
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Living',
    price: 490,
    sold_count: 174,
    stock: 18,
  },
];

const TopProductsList: React.FC<Props> = ({ products = defaultProducts, loading }) => {
  return (
    <Card
      loading={loading}
      bordered={false}
      style={{
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        height: '100%',
      }}
      title={
        <div>
          <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
            Top Selling Products
          </Title>
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>
            Best performers by unit volume
          </Text>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {products.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: idx === products.length - 1 ? 0 : 12,
              borderBottom: idx === products.length - 1 ? 'none' : '1px solid #F1F5F9',
            }}
          >
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>
                  ৳{item.price.toLocaleString()}
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>•</span>
                <span style={{ fontSize: 11, color: '#64748B' }}>{item.category}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right', minWidth: 90 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                {item.sold_count} sold
              </div>
              <div style={{ width: 80, marginLeft: 'auto', marginTop: 2 }}>
                <Progress
                  percent={Math.min(100, Math.round((item.stock / 150) * 100))}
                  showInfo={false}
                  strokeColor={item.stock < 25 ? '#EF4444' : '#10B981'}
                  size='small'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopProductsList;
