import React from 'react';
import { Card, Typography } from 'antd';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { IOrderStatusDistribution } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  distribution?: IOrderStatusDistribution[];
  loading?: boolean;
}

const defaultDistribution: IOrderStatusDistribution[] = [
  { status: 'COMPLETED', count: 0, color: '#10B981' },
  { status: 'PENDING', count: 0, color: '#F59E0B' },
  { status: 'RETURNED', count: 0, color: '#6366F1' },
  { status: 'CANCELLED', count: 0, color: '#EF4444' },
];

const OrderStatusCard: React.FC<Props> = ({ distribution, loading }) => {
  const chartData = distribution && distribution.length > 0 ? distribution : defaultDistribution;
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

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
            Invoice Fulfillment
          </Title>
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>
            Current sales pipeline breakdown
          </Text>
        </div>
      }
    >
      <div style={{ width: '100%', height: 210, position: 'relative' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='status'
              cx='50%'
              cy='50%'
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value = 0, name = '') => [
                `${Number(value).toLocaleString()} invoices (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : '0'}%)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: 8,
                border: 'none',
                color: '#fff',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
            {total.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Invoices</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        {chartData.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                }}
              />
              <span style={{ color: '#475569', fontWeight: 500 }}>{item.status}</span>
            </div>
            <div style={{ color: '#0F172A', fontWeight: 600 }}>
              {item.count}{' '}
              <span style={{ color: '#94A3B8', fontWeight: 400 }}>
                ({total > 0 ? ((item.count / total) * 100).toFixed(0) : '0'}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OrderStatusCard;
