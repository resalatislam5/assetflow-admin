import {
  Badge,
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
import { useGetSinglePaymentQuery } from '../api/paymentEndpoints';
import type { PaymentMethod, PaymentStatus } from '../types/paymentTypes';

const { Text, Title } = Typography;

interface Props {
  id: number | string;
}

const getPaymentStatusTag = (status: PaymentStatus) => {
  switch (status) {
    case 'COMPLETED':
    case 'SUCCESSFUL':
      return <Tag color='green'>{status}</Tag>;
    case 'PENDING':
    case 'AUTHORIZED':
      return <Tag color='orange'>{status}</Tag>;
    case 'REFUNDED':
      return <Tag color='purple'>{status}</Tag>;
    case 'PARTIALLY_REFUNDED':
      return <Tag color='geekblue'>{status}</Tag>;
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
      return <Tag color='red'>{status}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const getMethodTag = (method: PaymentMethod) => {
  switch (method) {
    case 'CASH':
      return <Tag color='blue'>CASH</Tag>;
    case 'CARD':
      return <Tag color='cyan'>CARD</Tag>;
    case 'MOBILE_BANKING':
      return <Tag color='magenta'>MOBILE BANKING</Tag>;
    case 'GATEWAY':
      return <Tag color='purple'>GATEWAY</Tag>;
    case 'LOYALTY_POINTS':
      return <Tag color='gold'>LOYALTY POINTS</Tag>;
    default:
      return <Tag>{method}</Tag>;
  }
};

const ViewPaymentDrawer = ({ id }: Props) => {
  const { token } = theme.useToken();
  const { data, isLoading } = useGetSinglePaymentQuery(id);
  const payment = data?.data;

  if (isLoading || !payment) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const remainingRefundable = Math.max(
    0,
    Number(payment.amount || 0) - Number(payment.refunded_amount || 0),
  );

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
            <Text type='secondary'>Transaction Ref</Text>
            <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
              {payment.transaction_ref}
            </Title>
          </Col>
          <Col>
            <Space>
              {getMethodTag(payment.payment_method)}
              {getPaymentStatusTag(payment.status)}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card size='small' bordered>
            <Statistic
              title='Payment Amount'
              value={payment.amount}
              prefix='৳'
              precision={2}
              valueStyle={{ color: token.colorSuccess, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size='small' bordered>
            <Statistic
              title='Gateway Fee'
              value={payment.gateway_fee || 0}
              prefix='৳'
              precision={2}
              valueStyle={{ color: token.colorWarning }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size='small' bordered>
            <Statistic
              title='Net Received'
              value={payment.net_amount || payment.amount}
              prefix='৳'
              precision={2}
              valueStyle={{ color: token.colorPrimary, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Descriptions title='Transaction Details' bordered size='small' column={2}>
        <Descriptions.Item label='Payment Date'>
          {dateAndTimeFormat(payment.paid_at, 'DD MMM YYYY, hh:mm A') || '—'}
        </Descriptions.Item>
        <Descriptions.Item label='Currency'>{payment.currency}</Descriptions.Item>
        <Descriptions.Item label='Payment Method'>
          {payment.payment_method}
        </Descriptions.Item>
        <Descriptions.Item label='Branch Location'>
          {payment.branch_name || 'Central Head Office'}
        </Descriptions.Item>
        <Descriptions.Item label='Deposited Account'>
          {payment.account_name
            ? `${payment.account_name} (${payment.account_type || ''})`
            : 'Unassigned Account'}
        </Descriptions.Item>
        <Descriptions.Item label='Processed By'>
          {payment.processed_by_name || 'System / Admin'}
        </Descriptions.Item>
      </Descriptions>

      {payment.payment_method === 'CASH' && (
        <Descriptions title='Cash Register Info' bordered size='small' column={2}>
          <Descriptions.Item label='Tendered Cash'>
            ৳{Number(payment.tendered_amount || payment.amount).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label='Change Returned'>
            ৳{Number(payment.change_amount || 0).toFixed(2)}
          </Descriptions.Item>
        </Descriptions>
      )}

      {payment.payment_method === 'CARD' && (
        <Descriptions title='Card & Terminal Info' bordered size='small' column={2}>
          <Descriptions.Item label='Card Type'>
            {payment.card_type || '—'}
          </Descriptions.Item>
          <Descriptions.Item label='Card Last 4'>
            {payment.card_last_four ? `•••• ${payment.card_last_four}` : '—'}
          </Descriptions.Item>
          <Descriptions.Item label='Issuing Bank'>
            {payment.bank_name || '—'}
          </Descriptions.Item>
          <Descriptions.Item label='POS Terminal ID'>
            {payment.terminal_id || '—'}
          </Descriptions.Item>
        </Descriptions>
      )}

      {(payment.payment_method === 'GATEWAY' ||
        payment.payment_method === 'MOBILE_BANKING') && (
        <Descriptions title='Gateway & Online Details' bordered size='small' column={2}>
          <Descriptions.Item label='Gateway Channel'>
            {payment.gateway || '—'}
          </Descriptions.Item>
          <Descriptions.Item label='Gateway Trx ID'>
            <Text copyable={Boolean(payment.gateway_trx_id)}>
              {payment.gateway_trx_id || '—'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label='Gateway Processing Fee'>
            ৳{Number(payment.gateway_fee || 0).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label='Net Amount'>
            ৳{Number(payment.net_amount || 0).toFixed(2)}
          </Descriptions.Item>
        </Descriptions>
      )}

      <Descriptions title='Associated Sales Invoice' bordered size='small' column={2}>
        <Descriptions.Item label='Invoice #'>
          <Text strong style={{ color: token.colorPrimary }}>
            {payment.invoice_number || `INV-${payment.invoice_id}`}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label='Invoice Status'>
          <Badge status='processing' text={payment.invoice_payment_status || '—'} />
        </Descriptions.Item>
        <Descriptions.Item label='Customer Name'>
          {payment.customer_name || 'Walk-in Customer'}
        </Descriptions.Item>
        <Descriptions.Item label='Customer Contact'>
          {payment.customer_phone || '—'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title='Refund Status & Limits' bordered size='small' column={2}>
        <Descriptions.Item label='Total Refunded'>
          <Text style={{ color: token.colorError }}>
            ৳{Number(payment.refunded_amount || 0).toFixed(2)}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label='Remaining Refundable'>
          <Text strong style={{ color: token.colorSuccess }}>
            ৳{remainingRefundable.toFixed(2)}
          </Text>
        </Descriptions.Item>
      </Descriptions>

      {payment.notes && (
        <Descriptions title='Notes & Remarks' bordered size='small' column={1}>
          <Descriptions.Item label='Notes'>{payment.notes}</Descriptions.Item>
        </Descriptions>
      )}

      <Divider style={{ margin: '8px 0' }} />
      <Row justify='space-between'>
        <Text type='secondary' style={{ fontSize: 12 }}>
          Created: {dateAndTimeFormat(payment.created_at, 'DD MMM YYYY, hh:mm A')}
        </Text>
        <Text type='secondary' style={{ fontSize: 12 }}>
          Last Updated: {dateAndTimeFormat(payment.updated_at, 'DD MMM YYYY, hh:mm A')}
        </Text>
      </Row>
    </Space>
  );
};

export default ViewPaymentDrawer;
