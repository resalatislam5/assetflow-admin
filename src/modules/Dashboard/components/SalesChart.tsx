import React, { useState } from 'react';
import { Card, Segmented, Typography } from 'antd';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ISalesTrend } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  data?: ISalesTrend[];
  loading?: boolean;
}

const defaultSalesData: ISalesTrend[] = [
  { month: 'Jan', sales: 185000, orders: 420 },
  { month: 'Feb', sales: 220000, orders: 510 },
  { month: 'Mar', sales: 210000, orders: 490 },
  { month: 'Apr', sales: 260000, orders: 610 },
  { month: 'May', sales: 295000, orders: 700 },
  { month: 'Jun', sales: 310000, orders: 740 },
  { month: 'Jul', sales: 280000, orders: 660 },
  { month: 'Aug', sales: 330000, orders: 810 },
  { month: 'Sep', sales: 345000, orders: 840 },
  { month: 'Oct', sales: 385450, orders: 920 },
];

const SalesChart: React.FC<Props> = ({ data = defaultSalesData, loading }) => {
  const [metric, setMetric] = useState<'sales' | 'orders'>('sales');

  return (
    <Card
      loading={loading}
      bordered={false}
      style={{
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
      title={
        <div>
          <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
            Sales & Orders Performance
          </Title>
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>
            Monthly revenue breakdown across store channels
          </Text>
        </div>
      }
      extra={
        <Segmented
          options={[
            { label: 'Revenue (৳)', value: 'sales' },
            { label: 'Orders', value: 'orders' },
          ]}
          value={metric}
          onChange={(val) => setMetric(val as 'sales' | 'orders')}
        />
      }
    >
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10B981' stopOpacity={0.35} />
                <stop offset='95%' stopColor='#10B981' stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id='ordersGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#2563EB' stopOpacity={0.35} />
                <stop offset='95%' stopColor='#2563EB' stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#F1F5F9' />
            <XAxis
              dataKey='month'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              tickFormatter={(v) =>
                metric === 'sales'
                  ? `৳${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  : v.toString()
              }
            />
            <Tooltip
              formatter={(value: unknown) => [
                metric === 'sales'
                  ? `৳${Number(value).toLocaleString()}`
                  : `${Number(value).toLocaleString()} Orders`,
                metric === 'sales' ? 'Revenue' : 'Orders',
              ]}
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: 8,
                border: 'none',
                color: '#fff',
                fontSize: 12,
              }}
              itemStyle={{ color: '#fff' }}
            />
            {metric === 'sales' ? (
              <Area
                type='monotone'
                dataKey='sales'
                stroke='#10B981'
                strokeWidth={3}
                fillOpacity={1}
                fill='url(#salesGradient)'
              />
            ) : (
              <Area
                type='monotone'
                dataKey='orders'
                stroke='#2563EB'
                strokeWidth={3}
                fillOpacity={1}
                fill='url(#ordersGradient)'
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesChart;
