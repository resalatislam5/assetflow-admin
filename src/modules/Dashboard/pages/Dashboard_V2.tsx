import React from 'react';
import { Button, Col, Row, Space, Typography } from 'antd';
import { Link } from 'react-router';
import { Icon } from '@iconify/react';
import { useAppSelector } from '../../../app/hooks/hooks';
import EcommerceKPIs from '../components/EcommerceKPIs';
import SalesChart from '../components/SalesChart';
import OrderStatusCard from '../components/OrderStatusCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import TopProductsList from '../components/TopProductsList';
import { useGetEcommerceDashboardQuery } from '../api/dashboardEndpoints';

const { Title, Text } = Typography;

const Dashboard_V2: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetEcommerceDashboardQuery();

  const dashboardData = data?.data;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1600, margin: '0 auto' }}>
      {/* ── Welcome Banner ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
            Welcome back, {user?.name || 'Administrator'}! 👋
          </Title>
          <Text style={{ color: '#64748B', fontSize: 14 }}>
            Here is what's happening in your AssetFlow system today.
          </Text>
        </div>

        <Space size={12}>
          <Link to='/store'>
            <Button
              icon={<Icon icon='solar:shop-2-bold-duotone' style={{ fontSize: 18 }} />}
              style={{
                borderRadius: 8,
                height: 40,
                fontWeight: 600,
                color: '#10B981',
                borderColor: '#A7F3D0',
                backgroundColor: '#ECFDF5',
              }}
            >
              Company Store
            </Button>
          </Link>
          <Link to='/administration/user'>
            <Button
              type='primary'
              icon={<Icon icon='solar:user-plus-bold' style={{ fontSize: 18 }} />}
              style={{
                borderRadius: 8,
                height: 40,
                fontWeight: 600,
                backgroundColor: '#10B981',
              }}
            >
              Admin Users
            </Button>
          </Link>
        </Space>
      </div>

      {/* ── Metric Cards ── */}
      <div style={{ marginBottom: 24 }}>
        <EcommerceKPIs summary={dashboardData?.summary} loading={isLoading} />
      </div>

      {/* ── Charts Section ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} xl={16}>
          <SalesChart data={dashboardData?.sales_trend} loading={isLoading} />
        </Col>
        <Col xs={24} xl={8}>
          <OrderStatusCard
            distribution={dashboardData?.order_status_distribution}
            loading={isLoading}
          />
        </Col>
      </Row>

      {/* ── Tables Section ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <RecentOrdersTable orders={dashboardData?.recent_orders} loading={isLoading} />
        </Col>
        <Col xs={24} xl={9}>
          <TopProductsList products={dashboardData?.top_products} loading={isLoading} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard_V2;
