import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { Icon } from '@iconify/react';
import type { IEcommerceSummary } from '../types/dahboardTypes';

const { Title, Text } = Typography;

interface Props {
  summary?: IEcommerceSummary;
  loading?: boolean;
}

const EcommerceKPIs: React.FC<Props> = ({ summary, loading }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `৳${(summary?.total_revenue?.amount ?? 0).toLocaleString()}`,
      badge: `${(summary?.total_revenue?.growth ?? 0) >= 0 ? '+' : ''}${summary?.total_revenue?.growth ?? 0}%`,
      badgeType: (summary?.total_revenue?.growth ?? 0) >= 0 ? 'positive' : 'negative',
      icon: 'solar:dollar-bold-duotone',
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
      subtitle: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: (summary?.total_orders?.count ?? 0).toLocaleString(),
      badge: `${(summary?.total_orders?.growth ?? 0) >= 0 ? '+' : ''}${summary?.total_orders?.growth ?? 0}%`,
      badgeType: (summary?.total_orders?.growth ?? 0) >= 0 ? 'positive' : 'negative',
      icon: 'solar:bag-check-bold-duotone',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      subtitle: 'vs last month',
    },
    {
      title: 'Total Purchases',
      value: `৳${(summary?.total_purchases?.amount ?? 0).toLocaleString()}`,
      badge: `${summary?.total_purchases?.count ?? 0} orders`,
      badgeType: 'neutral',
      icon: 'solar:cart-large-4-bold-duotone',
      iconBg: '#FFFBEB',
      iconColor: '#F59E0B',
      subtitle: 'Procurement bills',
    },
    {
      title: 'Total Expenses',
      value: `৳${(summary?.total_expenses?.amount ?? 0).toLocaleString()}`,
      badge: 'Operational',
      badgeType: 'neutral',
      icon: 'solar:bill-list-bold-duotone',
      iconBg: '#FEF2F2',
      iconColor: '#EF4444',
      subtitle: 'Business costs',
    },
    {
      title: 'Catalog Products',
      value: (summary?.total_products?.count ?? 0).toLocaleString(),
      badge: `${summary?.total_products?.active ?? 0} active`,
      badgeType: 'neutral',
      icon: 'solar:box-bold-duotone',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      subtitle: 'In product catalog',
    },
    {
      title: 'Total Customers',
      value: (summary?.total_customers?.count ?? 0).toLocaleString(),
      badge: `+${summary?.total_customers?.new_this_month ?? 0} new`,
      badgeType: 'positive',
      icon: 'solar:users-group-two-rounded-bold-duotone',
      iconBg: '#FAF5FF',
      iconColor: '#9333EA',
      subtitle: 'This month',
    },
    {
      title: 'Receivables Due',
      value: `৳${(summary?.total_due?.amount ?? 0).toLocaleString()}`,
      badge: 'Unpaid',
      badgeType: (summary?.total_due?.amount ?? 0) > 0 ? 'negative' : 'positive',
      icon: 'solar:hand-money-bold-duotone',
      iconBg: '#FFF1F2',
      iconColor: '#E11D48',
      subtitle: 'Customer invoice dues',
    },
    {
      title: 'Low Stock Alerts',
      value: (summary?.low_stock_count ?? 0).toLocaleString(),
      badge: (summary?.low_stock_count ?? 0) > 0 ? 'Action needed' : 'Optimal',
      badgeType: (summary?.low_stock_count ?? 0) > 0 ? 'negative' : 'positive',
      icon: 'solar:danger-triangle-bold-duotone',
      iconBg: (summary?.low_stock_count ?? 0) > 0 ? '#FEF2F2' : '#F0FDF4',
      iconColor: (summary?.low_stock_count ?? 0) > 0 ? '#DC2626' : '#16A34A',
      subtitle: 'Under safety threshold',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((item, idx) => (
        <Col xs={24} sm={12} md={8} lg={6} key={idx}>
          <Card
            loading={loading}
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease',
              height: '100%',
            }}
            styles={{
              body: { padding: '18px 20px' },
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                <Text style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                  {item.title}
                </Text>
                <Title
                  level={4}
                  style={{
                    margin: '6px 0 8px 0',
                    color: '#0F172A',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
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
                  <span style={{ color: '#94A3B8', fontSize: 11 }}>{item.subtitle}</span>
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon icon={item.icon} style={{ fontSize: 24, color: item.iconColor }} />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EcommerceKPIs;
