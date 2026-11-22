import React from 'react';
import { Button, Card, Empty, Progress, Typography } from 'antd';
import { Link } from 'react-router';
import { Icon } from '@iconify/react';
import type { ITopProduct } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  products?: ITopProduct[];
  loading?: boolean;
}

const TopProductsList: React.FC<Props> = ({ products = [], loading }) => {
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
      extra={
        <Link to='/products'>
          <Button
            type='link'
            size='small'
            style={{ fontWeight: 600, color: '#10B981' }}
            icon={<Icon icon='solar:arrow-right-bold' />}
            iconPosition='end'
          >
            Catalog
          </Button>
        </Link>
      }
    >
      {products.length === 0 ? (
        <Empty description='No top products data' style={{ padding: '24px 0' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {products.map((item, idx) => {
            const stockPercent = Math.min(100, Math.round(((item.stock || 0) / 100) * 100));
            return (
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
                    <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>
                      ৳{Number(item.price || 0).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>•</span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{item.category || 'General'}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: 90 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    {item.sold_count} sold
                  </div>
                  <div style={{ width: 80, marginLeft: 'auto', marginTop: 2 }}>
                    <Progress
                      percent={stockPercent}
                      showInfo={false}
                      strokeColor={item.stock < 10 ? '#EF4444' : '#10B981'}
                      size='small'
                    />
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>
                    {item.stock} in stock
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default TopProductsList;
