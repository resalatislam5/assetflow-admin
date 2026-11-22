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

const defaultMonths: ISalesTrend[] = [
  { month: 'Jan', sales: 0, orders: 0 },
  { month: 'Feb', sales: 0, orders: 0 },
  { month: 'Mar', sales: 0, orders: 0 },
  { month: 'Apr', sales: 0, orders: 0 },
  { month: 'May', sales: 0, orders: 0 },
  { month: 'Jun', sales: 0, orders: 0 },
  { month: 'Jul', sales: 0, orders: 0 },
  { month: 'Aug', sales: 0, orders: 0 },
  { month: 'Sep', sales: 0, orders: 0 },
  { month: 'Oct', sales: 0, orders: 0 },
  { month: 'Nov', sales: 0, orders: 0 },
  { month: 'Dec', sales: 0, orders: 0 },
];

const SalesChart: React.FC<Props> = ({ data, loading }) => {
  const [metric, setMetric] = useState<'sales' | 'orders'>('sales');
  const chartData = data && data.length > 0 ? data : defaultMonths;

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
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              tickFormatter={(v: number) =>
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
