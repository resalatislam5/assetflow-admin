import { Card, Col, Row, Select, Space, Statistic, Tag } from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import AntTable from '../../../../common/Table/AntTable';
import { SelectWarehouse } from '../../../../common/SelectWithApi/Select';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import { useGetOrderReportQuery } from '../api/invoiceReportEndpoints';
import type { IOrderReportItem, IOrderReportQuery } from '../types/invoiceReport.types';

const OrderReport = () => {
  const { query, setQuery } = useQueryParams<IOrderReportQuery>();
  const { data, isLoading, isFetching } = useGetOrderReportQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const summary = {
    total_orders: data?.summary?.total_orders || 0,
    total_revenue: data?.summary?.total_revenue ?? data?.summary?.total_grand_amount ?? 0,
    total_subtotal: data?.summary?.total_subtotal ?? data?.summary?.total_subtotal_amount ?? 0,
    total_discount: data?.summary?.total_discount ?? data?.summary?.total_discount_amount ?? 0,
    total_coupon_discount: data?.summary?.total_coupon_discount || 0,
    total_delivery_charge:
      data?.summary?.total_delivery_charge ?? data?.summary?.total_shipping_amount ?? 0,
    total_paid: data?.summary?.total_paid ?? data?.summary?.total_paid_amount ?? 0,
    total_due: data?.summary?.total_due ?? data?.summary?.total_due_amount ?? 0,
    total_items_sold: data?.summary?.total_items_sold || 0,
  };

  const getOrderStatusTag = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Tag color='green'>DELIVERED</Tag>;
      case 'SHIPPED':
        return <Tag color='blue'>SHIPPED</Tag>;
      case 'PROCESSING':
        return <Tag color='orange'>PROCESSING</Tag>;
      case 'PENDING':
        return <Tag color='gold'>PENDING</Tag>;
      case 'CANCELLED':
        return <Tag color='red'>CANCELLED</Tag>;
      case 'RETURNED':
        return <Tag color='purple'>RETURNED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Tag color='green'>PAID</Tag>;
      case 'PARTIAL':
        return <Tag color='orange'>PARTIAL</Tag>;
      case 'UNPAID':
        return <Tag color='red'>UNPAID</Tag>;
      case 'REFUNDED':
        return <Tag color='purple'>REFUNDED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      title: 'Invoice No',
      width: 140,
      render: (text: string, record: IOrderReportItem) => (
        <Tag color='blue'>{record.invoice_number || record.order_number || text}</Tag>
      ),
    },
    {
      dataIndex: 'created_at',
      key: 'created_at',
      title: 'Date',
      width: 140,
      render: (text: string) => dateAndTimeFormat(text),
    },
    {
      dataIndex: 'customer_name',
      key: 'customer_name',
      title: 'Customer',
      render: (text: string, record: IOrderReportItem) => (
        <Space direction='vertical' size={0}>
          <span><strong>{text}</strong></span>
          <span style={{ fontSize: 11, color: '#888' }}>{record.customer_phone}</span>
        </Space>
      ),
    },
    {
      dataIndex: 'warehouse_name',
      key: 'warehouse_name',
      title: 'Warehouse',
      render: (text?: string) => text || '-',
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Invoice Status',
      width: 120,
      align: 'center' as const,
      render: (status: string) => getOrderStatusTag(status),
    },
    {
      dataIndex: 'payment_status',
      key: 'payment_status',
      title: 'Payment Status',
      width: 120,
      align: 'center' as const,
      render: (status: string) => getPaymentStatusTag(status),
    },
    {
      dataIndex: 'total_items',
      key: 'total_items',
      title: 'Items',
      width: 70,
      align: 'center' as const,
    },
    {
      dataIndex: 'total_amount',
      key: 'total_amount',
      title: 'Total (৳)',
      width: 120,
      align: 'right' as const,
      render: (amount: number, record: IOrderReportItem) => (
        <strong>৳ {numberWithComma(amount ?? record.grand_total_amount ?? 0)}</strong>
      ),
    },
    {
      dataIndex: 'paid_amount',
      key: 'paid_amount',
      title: 'Paid (৳)',
      width: 110,
      align: 'right' as const,
      render: (amount: number) => (
        <span style={{ color: '#389e0d' }}>৳ {numberWithComma(amount)}</span>
      ),
    },
    {
      dataIndex: 'due_amount',
      key: 'due_amount',
      title: 'Due (৳)',
      width: 110,
      align: 'right' as const,
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? '#cf1322' : '#888' }}>
          ৳ {numberWithComma(amount)}
        </span>
      ),
    },
  ];

  return (
    <ReportContainer
      title='Sales & Invoice Report'
      options={{ showSearch: true }}
      exportExcel={
        data?.data
          ? {
              data: data.data,
              fileName: 'Invoice_Sales_Report',
              columns: columns,
              summary: {
                invoice_number: 'Grand Total:',
                order_number: 'Grand Total:',
                total_amount: summary.total_revenue,
                paid_amount: summary.total_paid,
                due_amount: summary.total_due,
              },
            }
          : undefined
      }
      additionalFilter={
        <Space wrap>
          <SelectWarehouse
            standalone
            placeholder='All Warehouses'
            value={query.warehouse_id ? Number(query.warehouse_id) : undefined}
            onChange={(val) => setQuery({ warehouse_id: val, page: 1 })}
            style={{ width: 180 }}
          />
          <Select
            placeholder='Invoice Status'
            allowClear
            value={query.status}
            onChange={(val) => setQuery({ status: val, page: 1 })}
            style={{ width: 140 }}
            options={[
              { label: 'Pending', value: 'PENDING' },
              { label: 'Processing', value: 'PROCESSING' },
              { label: 'Shipped', value: 'SHIPPED' },
              { label: 'Delivered', value: 'DELIVERED' },
              { label: 'Cancelled', value: 'CANCELLED' },
              { label: 'Returned', value: 'RETURNED' },
            ]}
          />
          <Select
            placeholder='Payment Status'
            allowClear
            value={query.payment_status}
            onChange={(val) => setQuery({ payment_status: val, page: 1 })}
            style={{ width: 140 }}
            options={[
              { label: 'Paid', value: 'PAID' },
              { label: 'Unpaid', value: 'UNPAID' },
              { label: 'Partial', value: 'PARTIAL' },
              { label: 'Refunded', value: 'REFUNDED' },
            ]}
          />
        </Space>
      }
    >
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Total Invoices'
              value={summary.total_orders}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Total Revenue'
              value={summary.total_revenue}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 18, color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Total Paid'
              value={summary.total_paid}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 18, color: '#389e0d' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Total Due'
              value={summary.total_due}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 18, color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Items Sold'
              value={summary.total_items_sold}
              valueStyle={{ fontSize: 18, color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IOrderReportItem>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={columns}
      />
    </ReportContainer>
  );
};

export default OrderReport;
