import { Card, Descriptions, Divider, Spin, Table, Tag } from 'antd';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useGetSingleOrderReturnQuery } from '../api/invoiceReturnEndpoints';
import type { IOrderReturnItem, ReturnReason, ReturnStatus } from '../types/invoiceReturnTypes';

type Props = {
  id: number | string;
};

const ViewReturnDrawer = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleOrderReturnQuery(id);
  const record = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!record) {
    return <div>Return details not found</div>;
  }

  const getReturnStatusTag = (status: ReturnStatus) => {
    switch (status) {
      case 'PENDING':
        return <Tag color='orange'>PENDING</Tag>;
      case 'REQUESTED':
        return <Tag color='orange'>REQUESTED</Tag>;
      case 'APPROVED':
        return <Tag color='blue'>APPROVED</Tag>;
      case 'PICKED_UP':
        return <Tag color='geekblue'>PICKED UP</Tag>;
      case 'RECEIVED':
        return <Tag color='purple'>RECEIVED</Tag>;
      case 'REFUNDED':
        return <Tag color='cyan'>REFUNDED</Tag>;
      case 'COMPLETED':
        return <Tag color='green'>COMPLETED</Tag>;
      case 'REJECTED':
        return <Tag color='red'>REJECTED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getReasonLabel = (reason: ReturnReason) => {
    switch (reason) {
      case 'DEFECTIVE':
        return 'Defective / Faulty Item';
      case 'WRONG_ITEM':
        return 'Wrong Item Delivered';
      case 'EXCHANGE':
        return 'Exchange Request';
      case 'CUSTOMER_RETURN':
        return 'Customer Return';
      case 'DAMAGED_IN_TRANSIT':
        return 'Damaged During Delivery';
      case 'SIZE_FIT_ISSUE':
        return 'Size / Fit Issue';
      case 'NOT_AS_DESCRIBED':
        return 'Not as Described on Site';
      case 'CHANGE_OF_MIND':
        return 'Customer Changed Mind';
      case 'OTHER':
      default:
        return 'Other';
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <Descriptions bordered size='small' column={{ xs: 1, sm: 2 }} style={{ marginBottom: 16 }}>
        <Descriptions.Item label='Return Number'>
          <Tag color='purple'>{record.return_number}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Invoice Number'>
          <strong>{record.invoice_number || record.order_number}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Branch'>
          <strong>{record.branch_name || 'Central / Default'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Warehouse'>
          <strong>{record.warehouse_name || 'Central Warehouse'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Customer Name'>
          {record.customer_name || 'Customer'}
        </Descriptions.Item>
        <Descriptions.Item label='Customer Phone'>
          {record.customer_phone || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Return Status'>
          {getReturnStatusTag(record.status)}
        </Descriptions.Item>
        <Descriptions.Item label='Refund Status'>
          <Tag
            color={
              record.refund_status === 'PROCESSED' || record.refund_status === 'COMPLETED'
                ? 'green'
                : record.refund_status === 'REJECTED'
                  ? 'red'
                  : 'orange'
            }
          >
            {record.refund_status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Refund Amount'>
          <strong style={{ color: '#0958d9' }}>৳{Number(record.refund_amount || 0).toLocaleString()}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Return Reason'>
          <Tag color='magenta'>{getReasonLabel(record.return_reason)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Date Created'>
          {dateAndTimeFormat(record.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label='Processed By'>
          {record.admin_name || 'Pending assignment'}
        </Descriptions.Item>
        <Descriptions.Item label='Customer Notes' span={2}>
          {record.customer_notes || 'None'}
        </Descriptions.Item>
        <Descriptions.Item label='Admin Notes' span={2}>
          {record.admin_notes || 'None'}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '16px 0 12px' }}>Returned Items</Divider>

      <Table<IOrderReturnItem>
        dataSource={record.items || []}
        rowKey='id'
        size='small'
        pagination={false}
        bordered
        columns={[
          {
            title: 'Product Title',
            dataIndex: 'product_title',
            key: 'product_title',
            render: (title: string, item) => (
              <div>
                <strong>{title}</strong>
                {item.variant_name && (
                  <Tag color='blue' style={{ marginLeft: 6 }}>
                    {item.variant_name}
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
            title: 'Unit Price',
            dataIndex: 'unit_price',
            key: 'unit_price',
            width: 110,
            align: 'right',
            render: (price: number) => `৳${Number(price || 0).toLocaleString()}`,
          },
          {
            title: 'Returned Qty',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 110,
            align: 'center',
            render: (qty: number) => <Tag color='red'>{qty}</Tag>,
          },
          {
            title: 'Refund Amount',
            dataIndex: 'refund_amount',
            key: 'refund_amount',
            width: 130,
            align: 'right',
            render: (amt: number) => (
              <strong style={{ color: '#0958d9' }}>৳{Number(amt || 0).toLocaleString()}</strong>
            ),
          },
          {
            title: 'Specific Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason) => reason || <span style={{ color: '#999' }}>-</span>,
          },
        ]}
      />
    </Card>
  );
};

export default ViewReturnDrawer;
