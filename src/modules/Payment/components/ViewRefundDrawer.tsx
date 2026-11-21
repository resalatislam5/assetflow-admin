import {
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  theme,
} from 'antd';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import { useGetSingleRefundQuery } from '../api/paymentEndpoints';
import type { RefundStatus, RefundType } from '../types/paymentTypes';

const { Text, Title } = Typography;

interface Props {
  id: number | string;
}

const getRefundStatusTag = (status: RefundStatus) => {
  switch (status) {
    case 'COMPLETED':
    case 'PROCESSED':
      return <Tag color='green'>{status}</Tag>;
    case 'APPROVED':
      return <Tag color='blue'>{status}</Tag>;
    case 'PENDING':
      return <Tag color='orange'>{status}</Tag>;
    case 'FAILED':
    case 'REJECTED':
      return <Tag color='red'>{status}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const getRefundTypeTag = (type: RefundType) => {
  switch (type) {
    case 'CASH':
      return <Tag color='blue'>CASH</Tag>;
    case 'CARD':
      return <Tag color='cyan'>CARD</Tag>;
    case 'MOBILE_BANKING':
      return <Tag color='magenta'>MOBILE BANKING</Tag>;
    case 'GATEWAY':
      return <Tag color='purple'>GATEWAY</Tag>;
    case 'STORE_CREDIT':
      return <Tag color='gold'>STORE CREDIT</Tag>;
    default:
      return <Tag>{type}</Tag>;
  }
};

const ViewRefundDrawer = ({ id }: Props) => {
  const { token } = theme.useToken();
  const { data, isLoading } = useGetSingleRefundQuery(id);
  const refund = data?.data;

  if (isLoading || !refund) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
      <Card
        size='small'
        style={{
          background: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Row justify='space-between' align='middle'>
          <Col>
            <Text type='secondary'>Refund Voucher #</Text>
            <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
              {refund.refund_no}
            </Title>
          </Col>
          <Col>
            <Space>
              {getRefundTypeTag(refund.refund_type)}
              {getRefundStatusTag(refund.status)}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card size='small' bordered>
            <Statistic
              title='Refund Disbursed'
              value={refund.amount}
              prefix='৳'
              precision={2}
              valueStyle={{ color: token.colorError, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size='small' bordered>
            <Statistic
              title='Refund Mechanism'
              value={refund.refund_type}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      <Descriptions title='Refund Details' bordered size='small' column={2}>
        <Descriptions.Item label='Processed Date'>
          {dateAndTimeFormat(refund.processed_at, 'DD MMM YYYY, hh:mm A') || '—'}
        </Descriptions.Item>
        <Descriptions.Item label='Branch Location'>
          {refund.branch_name || 'Central Head Office'}
        </Descriptions.Item>
        <Descriptions.Item label='Disbursed Account'>
          {refund.account_name
            ? `${refund.account_name} (${refund.account_type || ''})`
            : 'Default Account'}
        </Descriptions.Item>
        <Descriptions.Item label='Processed By'>
          {refund.processed_by_name || 'Staff Member'}
        </Descriptions.Item>
        {refund.gateway_refund_trx_id && (
          <Descriptions.Item label='Gateway Refund Trx ID' span={2}>
            <Text copyable>{refund.gateway_refund_trx_id}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Descriptions title='Original Transaction' bordered size='small' column={2}>
        <Descriptions.Item label='Payment Ref'>
          <Text strong style={{ color: token.colorPrimary }}>
            {refund.payment_transaction_ref || `TRX-${refund.payment_id}`}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label='Payment Method'>
          {refund.payment_method || '—'}
        </Descriptions.Item>
        <Descriptions.Item label='Invoice #'>
          {refund.invoice_number || `INV-${refund.invoice_id}`}
        </Descriptions.Item>
        <Descriptions.Item label='Customer Name'>
          {refund.customer_name || 'Customer'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title='Reason & Notes' bordered size='small' column={1}>
        <Descriptions.Item label='Reason'>{refund.reason}</Descriptions.Item>
        {refund.failure_reason && (
          <Descriptions.Item label='Failure Reason'>
            <Text type='danger'>{refund.failure_reason}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider style={{ margin: '8px 0' }} />
      <Row justify='space-between'>
        <Text type='secondary' style={{ fontSize: 12 }}>
          Created: {dateAndTimeFormat(refund.created_at, 'DD MMM YYYY, hh:mm A')}
        </Text>
        <Text type='secondary' style={{ fontSize: 12 }}>
          Updated: {dateAndTimeFormat(refund.updated_at, 'DD MMM YYYY, hh:mm A')}
        </Text>
      </Row>
    </Space>
  );
};

export default ViewRefundDrawer;
