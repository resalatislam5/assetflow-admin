import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  PrinterOutlined,
  RollbackOutlined,
  ShopOutlined,
  ShoppingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Tooltip,
} from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useGetOrderListQuery,
  useGetOrderSummaryQuery,
  useGetSingleOrderQuery,
  useDeleteOrderMutation,
} from '../api/invoiceEndpoints';
import { SelectBranch, SelectWarehouse } from '../../../../common/SelectWithApi';
import EditButton from '../../../../common/Button/EditButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import UpdateInvoiceStatusModal from '../components/UpdateInvoiceStatusModal';
import UpdatePaymentStatusModal from '../components/UpdatePaymentStatusModal';
import POSThermalReceiptModal from '../../POSTerminal/components/POSThermalReceiptModal';
import type { IPOSCompletedOrder } from '../../POSTerminal/types/posTerminalTypes';
import type {
  IOrder,
  IOrderQuery,
  OrderStatus,
  PaymentStatus,
} from '../types/invoiceTypes';

const InvoiceList = () => {
  const { can_create, can_update, can_delete } = useCheckPermission('INVOICE');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { query, setQuery } = useQueryParams<IOrderQuery>();
  const [printOrderId, setPrintOrderId] = useState<number | string | null>(null);

  const { data, isLoading, isFetching } = useGetOrderListQuery(query);
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetOrderSummaryQuery();
  const { data: singleOrderRes, isFetching: isPrintLoading } =
    useGetSingleOrderQuery(printOrderId || '', {
      skip: !printOrderId,
    });
  const [deleteOrder] = useDeleteOrderMutation();

  const handleDelete = async (id: number | string) => {
    await deleteOrder(id);
  };

  const summary = summaryData?.data;

  const handleStatusFilter = (value?: string) => {
    setQuery({ status: (value as OrderStatus) || undefined, page: 1 });
  };

  const handlePaymentStatusFilter = (value?: string) => {
    setQuery({
      payment_status: (value as PaymentStatus) || undefined,
      page: 1,
    });
  };

  const getOrderStatusTag = (status: OrderStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <Tag color='green'>COMPLETED</Tag>;
      case 'PENDING':
        return <Tag color='orange'>PENDING</Tag>;
      case 'CANCELLED':
        return <Tag color='red'>CANCELLED</Tag>;
      case 'RETURNED':
        return <Tag color='magenta'>RETURNED</Tag>;
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

  const rawOrder = singleOrderRes?.data;
  const completedOrderForPrint: IPOSCompletedOrder | null = rawOrder
    ? {
        id: Number(rawOrder.id),
        invoice_number: rawOrder.invoice_number || rawOrder.order_number || '',
        order_number: rawOrder.order_number,
        invoice_date: rawOrder.invoice_date || rawOrder.created_at,
        subtotal_amount: Number(rawOrder.subtotal_amount || 0),
        discount_amount: Number(rawOrder.discount_amount || 0),
        tax_amount: Number(rawOrder.tax_amount || 0),
        grand_total_amount: Number(rawOrder.grand_total_amount || 0),
        tendered_amount: Number(rawOrder.paid_amount || 0),
        paid_amount: Number(rawOrder.paid_amount || 0),
        change_amount: 0,
        payment_method: rawOrder.payment_method || 'CASH',
        created_at: rawOrder.created_at,
        customer_name: rawOrder.customer_name,
        customer_phone: rawOrder.customer_phone,
        branch_name: rawOrder.branch_name,
        items: (rawOrder.items || []).map((it) => ({
          product_title: it.product_title,
          variant_name: it.variant_name,
          quantity: Number(it.quantity || 1),
          unit_price: Number(it.unit_price || 0),
          total_amount: Number(
            it.total_amount ||
              Number(it.unit_price || 0) * Number(it.quantity || 1),
          ),
        })),
      }
    : null;

  return (
    <ContainerLayout
      title='Customer Invoices'
      onClick={() => navigate('/invoices/create')}
      options={{
        showButton: can_create,
        showSearch: true,
      }}
      additionalFilter={
        <>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Type'
              allowClear
              value={query.invoice_type}
              onChange={(val) =>
                setQuery({
                  invoice_type:
                    (val as 'POS' | 'WHOLESALE' | 'RETURN') || undefined,
                  page: 1,
                })
              }
              options={[
                { label: 'All Invoices', value: '' },
                { label: 'POS Sales', value: 'POS' },
                { label: 'Wholesale Sales', value: 'WHOLESALE' },
                { label: 'Returns', value: 'RETURN' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Status'
              allowClear
              value={query.status}
              onChange={handleStatusFilter}
              options={[
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Pending', value: 'PENDING' },
                { label: 'Cancelled', value: 'CANCELLED' },
                { label: 'Returned', value: 'RETURNED' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Payment'
              allowClear
              value={query.payment_status}
              onChange={handlePaymentStatusFilter}
              options={[
                { label: 'Paid', value: 'PAID' },
                { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
                { label: 'Unpaid', value: 'UNPAID' },
                { label: 'Refunded', value: 'REFUNDED' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <SelectBranch
              standalone
              placeholder='Filter by Branch'
              allowClear
              value={query.branch_id}
              onChange={(val) =>
                setQuery({
                  branch_id: val ? Number(val) : undefined,
                  page: 1,
                })
              }
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <SelectWarehouse
              standalone
              placeholder='Filter by Warehouse'
              allowClear
              value={query.warehouse_id}
              onChange={(val) =>
                setQuery({
                  warehouse_id: val ? Number(val) : undefined,
                  page: 1,
                })
              }
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button
              type='primary'
              icon={<ShopOutlined />}
              onClick={() => navigate('/pos')}
              style={{
                background: '#52c41a',
                borderColor: '#52c41a',
                width: '100%',
              }}
            >
              POS Terminal
            </Button>
          </Col>
        </>
      }
    >
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#f0f5ff',
              borderColor: '#adc6ff',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: '#1d39c4', fontSize: 13, fontWeight: 500 }}
                >
                  Total Invoices
                </span>
              }
              value={summary?.totalInvoices ?? summary?.totalOrders ?? 0}
              prefix={
                <ShoppingOutlined
                  style={{ color: '#2f54eb', marginRight: 4 }}
                />
              }
              valueStyle={{ color: '#1d39c4', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#f6ffed',
              borderColor: '#b7eb8f',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: '#237804', fontSize: 13, fontWeight: 500 }}
                >
                  Completed
                </span>
              }
              value={summary?.completedInvoices ?? summary?.deliveredOrders ?? 0}
              prefix={
                <CheckCircleOutlined
                  style={{ color: '#52c41a', marginRight: 4 }}
                />
              }
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#fffbe6',
              borderColor: '#ffe58f',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: '#d46b08', fontSize: 13, fontWeight: 500 }}
                >
                  Pending
                </span>
              }
              value={summary?.pendingInvoices ?? summary?.pendingOrders ?? 0}
              prefix={
                <ClockCircleOutlined
                  style={{ color: '#fa8c16', marginRight: 4 }}
                />
              }
              valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#fff1f0',
              borderColor: '#ffa39e',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: '#cf1322', fontSize: 13, fontWeight: 500 }}
                >
                  Cancelled
                </span>
              }
              value={summary?.cancelledInvoices ?? summary?.cancelledOrders ?? 0}
              prefix={
                <CloseCircleOutlined
                  style={{ color: '#f5222d', marginRight: 4 }}
                />
              }
              valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#f9f0ff',
              borderColor: '#d3adf7',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: '#531dab', fontSize: 13, fontWeight: 500 }}
                >
                  Returned
                </span>
              }
              value={summary?.returnedInvoices ?? summary?.returnedOrders ?? 0}
              prefix={
                <RollbackOutlined
                  style={{ color: '#722ed1', marginRight: 4 }}
                />
              }
              valueStyle={{ color: '#531dab', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#e6f4ff',
              borderColor: '#91caff',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={
                <span
                  style={{ color: '#0958d9', fontSize: 13, fontWeight: 500 }}
                >
                  Total Revenue
                </span>
              }
              value={summary?.totalRevenue ?? 0}
              prefix={
                <DollarOutlined style={{ color: '#1677ff', marginRight: 4 }} />
              }
              suffix='৳'
              valueStyle={{ color: '#0958d9', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IOrder>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            title: 'Invoice #',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            width: 170,
            render: (_: string, record) => {
              const displayNum =
                record.invoice_number || record.order_number || '—';
              return (
                <div>
                  <Button
                    type='link'
                    style={{ padding: 0, fontWeight: 600 }}
                    onClick={() => navigate(`/invoices/${record.id}`)}
                  >
                    {displayNum}
                  </Button>
                  <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    {dateAndTimeFormat(record.created_at || record.invoice_date)}
                  </div>
                </div>
              );
            },
          },
          {
            title: 'Type',
            dataIndex: 'invoice_type',
            key: 'invoice_type',
            width: 100,
            align: 'center',
            render: (type?: string) => (
              <Tag
                color={
                  type === 'POS'
                    ? 'purple'
                    : type === 'WHOLESALE'
                      ? 'blue'
                      : type === 'RETURN'
                        ? 'orange'
                        : 'default'
                }
              >
                {type || 'POS'}
              </Tag>
            ),
          },
          {
            title: 'Customer',
            key: 'customer',
            render: (_, record) => {
              const name = record.customer_name;
              const phone = record.customer_phone;
              const email = record.customer_email;

              if (!name && !record.customer_id) {
                return <Tag color='default'>Walk-in Customer</Tag>;
              }

              return (
                <div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <strong style={{ color: '#1f1f1f' }}>
                      {name || 'Walk-in Customer'}
                    </strong>
                    {!record.customer_id && (
                      <Tag
                        color='orange'
                        style={{
                          fontSize: 10,
                          padding: '0 4px',
                          lineHeight: '16px',
                        }}
                      >
                        Guest
                      </Tag>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {phone && <span>{phone}</span>}
                    {phone && email && <span> &bull; </span>}
                    {email && <span>{email}</span>}
                  </div>
                </div>
              );
            },
          },
          {
            title: 'Items',
            dataIndex: 'total_items',
            key: 'total_items',
            width: 80,
            align: 'center',
            render: (items: number) => <Tag color='blue'>{items ?? 0}</Tag>,
          },
          {
            title: 'Branch',
            dataIndex: 'branch_name',
            key: 'branch_name',
            width: 140,
            render: (branch: string) =>
              branch ? <Tag color='geekblue'>{branch}</Tag> : <Tag>Central</Tag>,
          },
          {
            title: 'Warehouse',
            dataIndex: 'warehouse_name',
            key: 'warehouse_name',
            width: 140,
            render: (wh: string) =>
              wh ? <Tag color='cyan'>{wh}</Tag> : <Tag>Counter</Tag>,
          },
          {
            title: 'Total Amount',
            dataIndex: 'grand_total_amount',
            key: 'grand_total_amount',
            width: 140,
            align: 'right',
            render: (amt: number, record) => (
              <div>
                <strong style={{ color: '#0958d9', fontSize: 13 }}>
                  ৳{Number(amt || 0).toLocaleString()}
                </strong>
                <div>
                  <Tag color='geekblue' style={{ margin: 0, fontSize: 10 }}>
                    {record.payment_method || 'CASH'}
                  </Tag>
                </div>
              </div>
            ),
          },
          {
            title: 'Paid / Due',
            dataIndex: 'due_amount',
            key: 'due_amount',
            width: 140,
            align: 'right',
            render: (val: number, record) => {
              const due = Number(
                val ??
                  Math.max(
                    0,
                    Number(record.grand_total_amount || 0) -
                      Number(record.paid_amount || 0),
                  ),
              );
              const paid = Number(record.paid_amount || 0);
              const isPaid =
                due === 0 && Number(record.grand_total_amount || 0) > 0;
              return (
                <div>
                  {due > 0 ? (
                    <div>
                      <strong style={{ color: '#cf1322', fontSize: 13 }}>
                        Due: ৳{due.toLocaleString()}
                      </strong>
                      <div style={{ fontSize: 10, color: '#8c8c8c' }}>
                        Paid: ৳{paid.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <strong style={{ color: '#389e0d', fontSize: 13 }}>
                        ৳{paid.toLocaleString()}
                      </strong>
                      {isPaid && (
                        <div>
                          <Tag
                            color='success'
                            style={{ margin: 0, fontSize: 10 }}
                          >
                            PAID
                          </Tag>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            title: 'Payment Status',
            dataIndex: 'payment_status',
            key: 'payment_status',
            width: 130,
            align: 'center',
            render: (status: PaymentStatus) => getPaymentStatusTag(status),
          },
          {
            title: 'Invoice Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            align: 'center',
            render: (status: OrderStatus) => getOrderStatusTag(status),
          },
          {
            title: 'Action',
            key: 'action',
            width: 220,
            align: 'center',
            render: (_, record: IOrder) => {
              const displayNum =
                record.invoice_number || record.order_number || String(record.id);
              const due = Number(
                record.due_amount ??
                  Math.max(
                    0,
                    Number(record.grand_total_amount || 0) -
                      Number(record.paid_amount || 0),
                  ),
              );
              return (
                <Space size='small'>
                  <Tooltip title='View Invoice Details'>
                    <Button
                      size='small'
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/invoices/${record.id}`)}
                    />
                  </Tooltip>

                  <Tooltip title='Print POS Receipt'>
                    <Button
                      size='small'
                      icon={<PrinterOutlined />}
                      loading={isPrintLoading && printOrderId === record.id}
                      onClick={() => setPrintOrderId(record.id)}
                    />
                  </Tooltip>

                  <EditButton
                    can_update={can_update}
                    onClick={() => navigate(`/invoices/edit/${record.id}`)}
                  />

                  <Tooltip title='Change Invoice Status'>
                    <Button
                      size='small'
                      type='primary'
                      ghost
                      icon={<SyncOutlined />}
                      disabled={!can_update}
                      onClick={() =>
                        dispatch(
                          openModal({
                            title: `Update Status: ${displayNum}`,
                            content: <UpdateInvoiceStatusModal record={record} />,
                            open: true,
                            width: 600,
                          }),
                        )
                      }
                    />
                  </Tooltip>

                  <Tooltip title='Record Payment'>
                    <Button
                      size='small'
                      icon={<DollarOutlined />}
                      disabled={!can_update || due <= 0 || record.status === 'CANCELLED'}
                      onClick={() =>
                        dispatch(
                          openModal({
                            title: `Record Payment — ${displayNum}`,
                            content: <UpdatePaymentStatusModal record={record} />,
                            open: true,
                            width: 800,
                          }),
                        )
                      }
                    />
                  </Tooltip>

                  <DeleteButton
                    can_delete={can_delete}
                    onClick={() => handleDelete(record.id)}
                  />
                </Space>
              );
            },
          },
        ]}
      />

      <POSThermalReceiptModal
        open={Boolean(printOrderId && completedOrderForPrint)}
        onClose={() => setPrintOrderId(null)}
        order={completedOrderForPrint}
      />
    </ContainerLayout>
  );
};

export default InvoiceList;