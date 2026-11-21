import {
  ArrowLeftOutlined,
  DollarOutlined,
  EditOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Timeline,
} from 'antd';
import { useNavigate, useParams } from 'react-router';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import { useGetSingleOrderQuery } from '../api/invoiceEndpoints';
import UpdateInvoiceStatusModal from '../components/UpdateInvoiceStatusModal';
import UpdatePaymentStatusModal from '../components/UpdatePaymentStatusModal';
import type {
  IOrderItem,
  IOrderPaymentItem,
  OrderStatus,
  PaymentStatus,
} from '../types/invoiceTypes';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { can_update } = useCheckPermission('INVOICE');

  const { data, isLoading } = useGetSingleOrderQuery(id || '');
  const order = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!order) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px 0' }}>
        <h3>Invoice not found</h3>
        <Button onClick={() => navigate('/invoices')}>Back to Invoices</Button>
      </Card>
    );
  }

  const shippingAddr = order.shipping_address_snapshot;
  const billingAddr = order.billing_address_snapshot;

  const getOrderStatusTag = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Tag color='orange'>PENDING</Tag>;
      case 'CONFIRMED':
        return <Tag color='blue'>CONFIRMED</Tag>;
      case 'PROCESSING':
        return <Tag color='geekblue'>PROCESSING</Tag>;
      case 'PICKED':
        return <Tag color='purple'>PICKED</Tag>;
      case 'SHIPPED':
        return <Tag color='cyan'>SHIPPED</Tag>;
      case 'DELIVERED':
        return <Tag color='green'>DELIVERED</Tag>;
      case 'CANCELLED':
        return <Tag color='red'>CANCELLED</Tag>;
      case 'RETURNED':
        return <Tag color='magenta'>RETURNED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return <Tag color='success'>PAID</Tag>;
      case 'PARTIALLY_PAID':
        return <Tag color='warning'>PARTIALLY PAID</Tag>;
      case 'UNPAID':
        return <Tag color='error'>UNPAID</Tag>;
      case 'REFUNDED':
        return <Tag color='purple'>REFUNDED</Tag>;
      case 'FAILED':
        return <Tag color='red'>FAILED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const customerDisplayName =
    order.customer_name || shippingAddr?.recipient_name || 'Guest Customer';

  const customerDisplayPhone =
    order.customer_phone || shippingAddr?.recipient_phone || 'N/A';

  const customerDisplayEmail = order.customer_email || 'N/A';

  const remainingDue =
    order.due_amount !== undefined
      ? Number(order.due_amount)
      : Math.max(
          0,
          Number(order.grand_total_amount || 0) -
            Number(order.paid_amount || 0),
        );

  const displayNum =
    order.invoice_number || order.order_number || `#${order.id}`;

  return (
    <ContainerLayout
      title={`Invoice: ${displayNum}`}
      options={{ showButton: false, showSearch: false }}
    >
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space wrap>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/invoices')}
          >
            Back to Invoices
          </Button>
          <span>Invoice Status: {getOrderStatusTag(order.status)}</span>
          <span>Payment: {getPaymentStatusTag(order.payment_status)}</span>
        </Space>

        <Space wrap>
          <Button
            icon={<EditOutlined />}
            disabled={!can_update}
            onClick={() => navigate(`/invoices/edit/${order.id}`)}
          >
            Edit Invoice
          </Button>

          <Button
            type='primary'
            icon={<SyncOutlined />}
            disabled={!can_update}
            onClick={() =>
              dispatch(
                openModal({
                  title: `Update Status: ${displayNum}`,
                  content: <UpdateInvoiceStatusModal record={order} />,
                  open: true,
                  width: 600,
                }),
              )
            }
          >
            Update Status
          </Button>

          <Button
            icon={<DollarOutlined />}
            disabled={!can_update}
            onClick={() =>
              dispatch(
                openModal({
                  title: `Record Payment — ${displayNum}`,
                  content: <UpdatePaymentStatusModal record={order} />,
                  open: true,
                  width: 800,
                }),
              )
            }
          >
            Update Payment
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12} lg={8}>
          <Card
            title='Customer Details'
            size='small'
            bordered
            style={{ height: '100%' }}
          >
            <p>
              <strong>Name:</strong> {customerDisplayName}
            </p>
            <p>
              <strong>Phone:</strong> {customerDisplayPhone}
            </p>
            <p>
              <strong>Email:</strong> {customerDisplayEmail}
            </p>
            <p>
              <strong>Branch:</strong>{' '}
              {order.branch_name ? (
                <Tag color='geekblue'>{order.branch_name}</Tag>
              ) : (
                <Tag>Central / Default</Tag>
              )}
            </p>
            <p>
              <strong>Fulfillment Warehouse:</strong>{' '}
              {order.warehouse_name ? (
                <Tag color='cyan'>{order.warehouse_name}</Tag>
              ) : (
                <Tag>Auto-assigned</Tag>
              )}
            </p>
            <p>
              <strong>Account Type:</strong>{' '}
              {order.customer_id ? (
                <Tag color='blue'>
                  Registered Customer (#{order.customer_id})
                </Tag>
              ) : (
                <Tag color='orange'>Guest Checkout</Tag>
              )}
            </p>
            <p>
              <strong>Invoice Date:</strong> {dateAndTimeFormat(order.created_at)}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card
            title='Shipping Address'
            size='small'
            bordered
            style={{ height: '100%' }}
          >
            <p>
              <strong>Recipient:</strong>{' '}
              {shippingAddr?.recipient_name || 'N/A'}
            </p>
            <p>
              <strong>Phone:</strong> {shippingAddr?.recipient_phone || 'N/A'}
            </p>
            <p>
              <strong>Street Address:</strong>{' '}
              {shippingAddr?.street_address || 'N/A'}
            </p>
            <p>
              <strong>Thana / Upazila:</strong>{' '}
              {shippingAddr?.upazila_name || 'N/A'}
            </p>
            <p>
              <strong>District:</strong> {shippingAddr?.district_name || 'N/A'}
            </p>
            <p>
              <strong>Division:</strong> {shippingAddr?.division_name || 'N/A'}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card
            title='Payment & Financial Summary'
            size='small'
            bordered
            style={{ height: '100%' }}
          >
            <p>
              <strong>Payment Method:</strong>{' '}
              <Tag color='geekblue'>{order.payment_method || 'COD'}</Tag>
            </p>
            <p>
              <strong>Subtotal:</strong> ৳
              {Number(order.subtotal_amount || 0).toLocaleString()}
            </p>
            <p>
              <strong>Shipping Fee:</strong> ৳
              {Number(order.shipping_amount || 0).toLocaleString()}
            </p>
            {Number(order.discount_amount || 0) > 0 && (
              <p style={{ color: '#389e0d' }}>
                <strong>Discount:</strong> -৳
                {Number(order.discount_amount).toLocaleString()}
                {order.coupon_code && ` (${order.coupon_code})`}
              </p>
            )}
            {Number(order.points_discount_amount || 0) > 0 && (
              <p style={{ color: '#722ed1' }}>
                <strong>Points Discount:</strong> -৳
                {Number(order.points_discount_amount).toLocaleString()}
                {order.points_redeemed && ` (${order.points_redeemed} pts)`}
              </p>
            )}
            {Number(order.points_earned || 0) > 0 && (
              <p style={{ color: '#fa8c16' }}>
                <strong>Points Earned:</strong> +{order.points_earned} points
              </p>
            )}
            <Divider style={{ margin: '8px 0' }} />
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#0958d9',
                margin: '4px 0',
              }}
            >
              Grand Total: ৳
              {Number(order.grand_total_amount || 0).toLocaleString()}
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Paid Amount:</strong> ৳
              {Number(order.paid_amount || 0).toLocaleString()}
            </p>
            <p
              style={{
                margin: '4px 0',
                color: remainingDue > 0 ? '#cf1322' : '#389e0d',
              }}
            >
              <strong>Due Balance:</strong> ৳{remainingDue.toLocaleString()}
            </p>
          </Card>
        </Col>
      </Row>

      {billingAddr &&
        (billingAddr.street_address !== shippingAddr?.street_address ||
          billingAddr.recipient_name !== shippingAddr?.recipient_name) && (
          <Card
            title='Billing Address'
            size='small'
            bordered
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12} md={6}>
                <strong>Recipient:</strong>{' '}
                {billingAddr.recipient_name || 'N/A'}
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>Phone:</strong> {billingAddr.recipient_phone || 'N/A'}
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>Address:</strong> {billingAddr.street_address || 'N/A'}
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>District:</strong> {billingAddr.district_name || 'N/A'}
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>division:</strong> {billingAddr.division_name || 'N/A'}
              </Col>
            </Row>
          </Card>
        )}

      <Card
        title='Invoice Items'
        size='small'
        bordered
        style={{ marginBottom: 16 }}
      >
        <Table<IOrderItem>
          dataSource={order.items || []}
          rowKey='id'
          size='small'
          pagination={false}
          bordered
          columns={[
            {
              title: 'Product Title',
              dataIndex: 'product_title',
              key: 'product_title',
              render: (title: string, record) => (
                <div>
                  <strong>{title}</strong>
                  {record.variant_name && (
                    <Tag color='blue' style={{ marginLeft: 6 }}>
                      {record.variant_name}
                    </Tag>
                  )}
                </div>
              ),
            },
            {
              title: 'SKU',
              dataIndex: 'sku',
              key: 'sku',
              width: 140,
              render: (sku: string) => <Tag color='purple'>{sku}</Tag>,
            },
            {
              title: 'Warehouse',
              dataIndex: 'warehouse_name',
              key: 'warehouse_name',
              width: 140,
              render: (wh: string) =>
                wh ? <Tag color='cyan'>{wh}</Tag> : <Tag>Auto</Tag>,
            },
            {
              title: 'Unit Price',
              dataIndex: 'unit_price',
              key: 'unit_price',
              width: 120,
              align: 'right',
              render: (price: number) =>
                `৳${Number(price || 0).toLocaleString()}`,
            },
            {
              title: 'Quantity',
              dataIndex: 'quantity',
              key: 'quantity',
              width: 100,
              align: 'center',
              render: (qty: number) => <Tag color='geekblue'>{qty}</Tag>,
            },
            {
              title: 'Total Amount',
              dataIndex: 'total_amount',
              key: 'total_amount',
              width: 130,
              align: 'right',
              render: (total: number) => (
                <strong>৳{Number(total || 0).toLocaleString()}</strong>
              ),
            },
          ]}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title='Status Timeline & History' size='small' bordered>
            {order.status_history && order.status_history.length > 0 ? (
              <Timeline
                items={order.status_history.map((hist) => ({
                  color:
                    hist.to_status === 'DELIVERED'
                      ? 'green'
                      : hist.to_status === 'CANCELLED'
                        ? 'red'
                        : 'blue',
                  children: (
                    <div>
                      <p style={{ margin: 0 }}>
                        <strong>{getOrderStatusTag(hist.to_status)}</strong>
                        <span
                          style={{ fontSize: 11, color: '#999', marginLeft: 8 }}
                        >
                          {dateAndTimeFormat(hist.created_at)}
                        </span>
                      </p>
                      {hist.actor_name && (
                        <p
                          style={{
                            margin: '2px 0',
                            fontSize: 12,
                            color: '#666',
                          }}
                        >
                          By: {hist.actor_name} ({hist.actor_type})
                        </p>
                      )}
                      {hist.comment && (
                        <p
                          style={{
                            margin: '2px 0',
                            fontSize: 12,
                            color: '#444',
                            fontStyle: 'italic',
                          }}
                        >
                          {hist.comment}
                        </p>
                      )}
                    </div>
                  ),
                }))}
              />
            ) : (
              <p style={{ color: '#999' }}>
                No status transitions recorded yet.
              </p>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title='Invoice Notes' size='small' bordered>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Customer Notes'>
                {order.customer_notes || 'None'}
              </Descriptions.Item>
              <Descriptions.Item label='Admin Notes'>
                {order.admin_notes || 'None'}
              </Descriptions.Item>
              {order.cancel_reason && (
                <Descriptions.Item label='Cancellation Reason'>
                  <span style={{ color: '#ff4d4f' }}>
                    {order.cancel_reason}
                  </span>
                </Descriptions.Item>
              )}
              {order.delivered_at && (
                <Descriptions.Item label='Delivered At'>
                  {dateAndTimeFormat(order.delivered_at)}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card
        title='Payment Receipts'
        size='small'
        bordered
        style={{ marginTop: 16 }}
      >
        <Table<IOrderPaymentItem>
          dataSource={order.payments || []}
          rowKey='id'
          size='small'
          pagination={false}
          bordered
          locale={{ emptyText: 'No payment receipts recorded yet' }}
          columns={[
            {
              title: 'Receipt #',
              dataIndex: 'receipt_number',
              key: 'receipt_number',
              width: 130,
              render: (v: string) => <Tag color='geekblue'>{v}</Tag>,
            },
            {
              title: 'Date',
              dataIndex: 'payment_date',
              key: 'payment_date',
              width: 110,
              render: (v: string) => v?.slice(0, 10),
            },
            {
              title: 'Account',
              key: 'account',
              render: (_: unknown, r: IOrderPaymentItem) =>
                r.account_name
                  ? `${r.account_name}${r.account_number ? ` (${r.account_number})` : ''}`
                  : r.account_id,
            },
            {
              title: 'Type',
              dataIndex: 'payment_type',
              key: 'payment_type',
              width: 130,
              render: (v: string) => <Tag color='blue'>{v}</Tag>,
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              key: 'amount',
              align: 'right',
              width: 110,
              render: (v: number) => `৳${Number(v || 0).toLocaleString()}`,
            },
            {
              title: 'Charge',
              key: 'charge',
              align: 'right',
              width: 110,
              render: (_: unknown, r: IOrderPaymentItem) =>
                Number(r.charge_amount) > 0 ? (
                  <span style={{ color: '#cf1322' }}>
                    -৳{Number(r.charge_amount).toLocaleString()}
                  </span>
                ) : (
                  '—'
                ),
            },
            {
              title: 'Net Deposited',
              dataIndex: 'net_amount',
              key: 'net_amount',
              align: 'right',
              width: 120,
              render: (v: number) => (
                <strong style={{ color: '#389e0d' }}>
                  ৳{Number(v || 0).toLocaleString()}
                </strong>
              ),
            },
            {
              title: 'By',
              dataIndex: 'created_by_name',
              key: 'created_by_name',
              render: (v: string) => v || '—',
            },
          ]}
        />
      </Card>
    </ContainerLayout>
  );
};

export default OrderDetailPage;
