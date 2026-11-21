import { Card, Col, Row, Skeleton, Statistic, theme } from 'antd';
import { Icon } from '@iconify/react';
import { useGetPaymentSummaryQuery } from '../api/paymentEndpoints';

const PaymentSummaryCards = () => {
  const { token } = theme.useToken();
  const { data, isLoading } = useGetPaymentSummaryQuery();
  const summary = data?.data;

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card
          size='small'
          bordered={false}
          style={{
            background: token.colorSuccessBg,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorSuccessBorder}`,
          }}
        >
          <Statistic
            title={<span style={{ color: token.colorTextSecondary }}>Total Collected</span>}
            value={summary?.total_collected || 0}
            precision={2}
            prefix='৳'
            valueStyle={{ color: token.colorSuccess, fontWeight: 700 }}
            suffix={
              <Icon
                icon='solar:wallet-money-bold'
                style={{ fontSize: 24, verticalAlign: 'middle', opacity: 0.8 }}
              />
            }
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          size='small'
          bordered={false}
          style={{
            background: token.colorPrimaryBg,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorPrimaryBorder}`,
          }}
        >
          <Statistic
            title={<span style={{ color: token.colorTextSecondary }}>Net Collected</span>}
            value={summary?.total_net_collected || 0}
            precision={2}
            prefix='৳'
            valueStyle={{ color: token.colorPrimary, fontWeight: 700 }}
            suffix={
              <Icon
                icon='solar:hand-money-bold'
                style={{ fontSize: 24, verticalAlign: 'middle', opacity: 0.8 }}
              />
            }
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          size='small'
          bordered={false}
          style={{
            background: token.colorWarningBg,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorWarningBorder}`,
          }}
        >
          <Statistic
            title={<span style={{ color: token.colorTextSecondary }}>Gateway Fees</span>}
            value={summary?.total_gateway_fees || 0}
            precision={2}
            prefix='৳'
            valueStyle={{ color: token.colorWarning, fontWeight: 700 }}
            suffix={
              <Icon
                icon='solar:tag-price-bold'
                style={{ fontSize: 24, verticalAlign: 'middle', opacity: 0.8 }}
              />
            }
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          size='small'
          bordered={false}
          style={{
            background: token.colorErrorBg,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorErrorBorder}`,
          }}
        >
          <Statistic
            title={<span style={{ color: token.colorTextSecondary }}>Total Refunded</span>}
            value={summary?.total_refunded || 0}
            precision={2}
            prefix='৳'
            valueStyle={{ color: token.colorError, fontWeight: 700 }}
            suffix={
              <Icon
                icon='solar:restart-bold'
                style={{ fontSize: 24, verticalAlign: 'middle', opacity: 0.8 }}
              />
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

export default PaymentSummaryCards;
