import React from 'react';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router';
import { Icon } from '@iconify/react';
import { useAppSelector } from '../../../app/hooks/hooks';
import EcommerceKPIs from '../components/EcommerceKPIs';
import SalesChart from '../components/SalesChart';
import OrderStatusCard from '../components/OrderStatusCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import TopProductsList from '../components/TopProductsList';
import LowStockAlertCard from '../components/LowStockAlertCard';
import { useGetEcommerceDashboardQuery } from '../api/dashboardEndpoints';

const { Title, Text } = Typography;

const Dashboard_V2: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const locationState = useAppSelector((state) => state.location);
  const { data, isLoading, refetch, isFetching } = useGetEcommerceDashboardQuery();

  const dashboardData = data?.data;
  const currentScope = locationState?.currentScope || dashboardData?.location_context?.scope || 'ALL';
  const locationName = locationState?.locationName || dashboardData?.location_context?.location_name || 'All Locations (Global)';

  const scopeBadgeConfig = {
    ALL: { color: 'blue', label: 'GLOBAL SCOPE' },
    BRANCH: { color: 'green', label: 'BRANCH SCOPE' },
    WAREHOUSE: { color: 'purple', label: 'WAREHOUSE SCOPE' },
  }[currentScope] || { color: 'blue', label: 'GLOBAL SCOPE' };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1600, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
              Welcome back, {user?.name || 'Administrator'}!
            </Title>
            <Tag color={scopeBadgeConfig.color} style={{ borderRadius: 12, fontWeight: 700, padding: '2px 10px' }}>
              {scopeBadgeConfig.label}
            </Tag>
          </div>
          <Text style={{ color: '#64748B', fontSize: 14 }}>
            Viewing enterprise data for <strong style={{ color: '#0F172A' }}>{locationName}</strong>
          </Text>
        </div>

        <Space size={10} wrap>
          <Button
            icon={<Icon icon='solar:refresh-bold' className={isFetching ? 'spin' : ''} />}
            onClick={() => refetch()}
            loading={isFetching}
            style={{ borderRadius: 8, height: 38, fontWeight: 600 }}
          >
            Refresh
          </Button>
          <Link to='/invoices/pos'>
            <Button
              type='primary'
              icon={<Icon icon='solar:cart-bold' style={{ fontSize: 18 }} />}
              style={{
                borderRadius: 8,
                height: 38,
                fontWeight: 600,
                backgroundColor: '#10B981',
              }}
            >
              POS Terminal
            </Button>
          </Link>
          <Link to='/invoices/create'>
            <Button
              type='default'
              icon={<Icon icon='solar:document-add-bold' style={{ fontSize: 18 }} />}
              style={{
                borderRadius: 8,
                height: 38,
                fontWeight: 600,
                borderColor: '#10B981',
                color: '#10B981',
              }}
            >
              New Invoice
            </Button>
          </Link>
        </Space>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 24,
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Quick Operations:</span>
        <Link to='/products/create'>
          <Button size='small' icon={<Icon icon='solar:box-minimalistic-bold' />} style={{ borderRadius: 6 }}>
            Add Product
          </Button>
        </Link>
        <Link to='/inventory/stock-transfers'>
          <Button size='small' icon={<Icon icon='solar:transfer-horizontal-bold' />} style={{ borderRadius: 6 }}>
            Stock Transfer
          </Button>
        </Link>
        <Link to='/purchases/invoices'>
          <Button size='small' icon={<Icon icon='solar:bag-3-bold' />} style={{ borderRadius: 6 }}>
            New Purchase
          </Button>
        </Link>
        <Link to='/expenses'>
          <Button size='small' icon={<Icon icon='solar:card-recive-bold' />} style={{ borderRadius: 6 }}>
            Record Expense
          </Button>
        </Link>
        <Link to='/inventory/stocks'>
          <Button size='small' icon={<Icon icon='solar:layers-minimalistic-bold' />} style={{ borderRadius: 6 }}>
            View Inventory
          </Button>
        </Link>
      </div>

      <div style={{ marginBottom: 24 }}>
        <EcommerceKPIs summary={dashboardData?.summary} loading={isLoading} />
      </div>

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

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} xl={15}>
          <RecentOrdersTable orders={dashboardData?.recent_orders} loading={isLoading} />
        </Col>
        <Col xs={24} xl={9}>
          <TopProductsList products={dashboardData?.top_products} loading={isLoading} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <LowStockAlertCard items={dashboardData?.low_stock_items} loading={isLoading} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard_V2;
