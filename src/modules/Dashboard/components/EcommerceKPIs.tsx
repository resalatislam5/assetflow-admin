import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { Icon } from '@iconify/react';
import type { IEcommerceSummary } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  summary?: IEcommerceSummary;
  loading?: boolean;
}

const defaultSummary: IEcommerceSummary = {
  total_revenue: {
    amount: 385450,
    growth: 14.2,
  },
  total_orders: {
    count: 1420,
    growth: 8.5,
  },
  total_products: {
    count: 450,
    active: 412,
  },
  total_customers: {
    count: 2890,
    new_this_month: 125,
  },
};

const EcommerceKPIs: React.FC<Props> = ({ summary = defaultSummary, loading }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `৳${(summary.total_revenue?.amount || 0).toLocaleString()}`,
      badge: `+${summary.total_revenue?.growth || 0}%`,
      badgeType: 'positive',
      icon: 'solar:dollar-bold-duotone',
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
      subtitle: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: (summary.total_orders?.count || 0).toLocaleString(),
      badge: `+${summary.total_orders?.growth || 0}%`,
      badgeType: 'positive',
      icon: 'solar:bag-check-bold-duotone',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      subtitle: 'Completed & active',
    },
    {
      title: 'Catalog Products',
      value: (summary.total_products?.count || 0).toLocaleString(),
      badge: `${summary.total_products?.active || 0} active`,
      badgeType: 'neutral',
      icon: 'solar:box-bold-duotone',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      subtitle: 'Across all categories',
    },
    {
      title: 'Total Customers',
      value: (summary.total_customers?.count || 0).toLocaleString(),
      badge: `+${summary.total_customers?.new_this_month || 0} new`,
      badgeType: 'positive',
      icon: 'solar:users-group-two-rounded-bold-duotone',
      iconBg: '#FAF5FF',
      iconColor: '#9333EA',
      subtitle: 'This month',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((item, idx) => (
        <Col xs={24} sm={12} lg={6} key={idx}>
          <Card
            loading={loading}
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease',
            }}
            styles={{
              body: { padding: '20px 22px' },
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                  {item.title}
                </Text>
                <Title
                  level={3}
                  style={{
                    margin: '6px 0 8px 0',
                    color: '#0F172A',
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontWeight: 600,
                      backgroundColor:
                        item.badgeType === 'positive'
                          ? '#DCFCE7'
                          : item.badgeType === 'negative'
                          ? '#FEE2E2'
                          : '#E2E8F0',
                      color:
                        item.badgeType === 'positive'
                          ? '#15803D'
                          : item.badgeType === 'negative'
                          ? '#B91C1C'
                          : '#475569',
                    }}
                  >
                    {item.badge}
                  </span>
                  <span style={{ color: '#94A3B8' }}>{item.subtitle}</span>
                </div>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon={item.icon} style={{ fontSize: 26, color: item.iconColor }} />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EcommerceKPIs;
