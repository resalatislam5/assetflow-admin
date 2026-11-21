import { Card, Descriptions, Divider, Spin, Table, Tag, Typography } from 'antd';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useGetSingleStockTransferQuery } from '../api/stockTransferEndpoints';
import type { IStockTransferItem, StockTransferStatus } from '../types/stockTransferTypes';

const { Text } = Typography;

type Props = {
  id: number | string;
};

const ViewStockTransferModal = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleStockTransferQuery(id);
  const transfer = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!transfer) {
    return <div>Stock transfer record not found</div>;
  }

  const getStatusTag = (status: StockTransferStatus) => {
    switch (status) {
      case 'DRAFT':
        return <Tag color='default'>DRAFT</Tag>;
      case 'PENDING':
        return <Tag color='warning'>REQUESTED / PENDING</Tag>;
      case 'SENT':
      case 'IN_TRANSIT':
        return <Tag color='processing'>IN TRANSIT</Tag>;
      case 'RECEIVED':
        return <Tag color='success'>RECEIVED IN FULL</Tag>;
      case 'PARTIALLY_RECEIVED':
        return <Tag color='orange'>PARTIALLY RECEIVED</Tag>;
      case 'CANCELLED':
        return <Tag color='error'>CANCELLED</Tag>;
      default:
        return <Tag color='default'>{status}</Tag>;
    }
  };

  const items = transfer.items || [];

  return (
    <Card size='small' className='modal-container'>
      <Descriptions bordered size='small' column={{ xs: 1, sm: 2, md: 3 }} style={{ marginBottom: 16 }}>
        <Descriptions.Item label='Transfer Number'>
          <Text strong style={{ color: '#1677ff' }}>{transfer.transfer_number}</Text>
        </Descriptions.Item>
        <Descriptions.Item label='Transfer Status'>
          {getStatusTag(transfer.status)}
        </Descriptions.Item>
        <Descriptions.Item label='Total Items'>
          <strong>{transfer.items_count ?? items.length}</strong> product lines
        </Descriptions.Item>
        <Descriptions.Item label='Source Branch'>
          {transfer.from_branch_name || 'Central'}
        </Descriptions.Item>
        <Descriptions.Item label='Source Warehouse'>
          <strong>{transfer.from_warehouse_name}</strong> ({transfer.from_warehouse_code})
        </Descriptions.Item>
        <Descriptions.Item label='Sent At'>
          {transfer.sent_at ? dateAndTimeFormat(transfer.sent_at) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label='Destination Branch'>
          {transfer.to_branch_name || 'Central'}
        </Descriptions.Item>
        <Descriptions.Item label='Destination Warehouse'>
          <strong>{transfer.to_warehouse_name}</strong> ({transfer.to_warehouse_code})
        </Descriptions.Item>
        <Descriptions.Item label='Received At'>
          {transfer.received_at ? dateAndTimeFormat(transfer.received_at) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label='Created By'>
          {transfer.created_by_name || 'System'}
        </Descriptions.Item>
        <Descriptions.Item label='Received By'>
          {transfer.received_by_name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='Created Date'>
          {dateAndTimeFormat(transfer.created_at)}
        </Descriptions.Item>
      </Descriptions>

      {transfer.notes && (
        <div style={{ marginBottom: 16, background: '#fafafa', padding: '8px 12px', borderRadius: 6, border: '1px solid #f0f0f0' }}>
          <Text type='secondary'><strong>Notes: </strong>{transfer.notes}</Text>
        </div>
      )}

      <Divider style={{ margin: '12px 0' }}>Dispatched Line Items</Divider>

      <Table<IStockTransferItem>
        dataSource={items}
        rowKey='id'
        pagination={false}
        size='small'
        bordered
        columns={[
          {
            title: 'Product Title',
            dataIndex: 'product_title',
            key: 'product_title',
            render: (title: string, item) => (
              <div>
                <strong>{title}</strong>
                {item.variant_name && <Tag color='geekblue' style={{ marginLeft: 6 }}>{item.variant_name}</Tag>}
                <div style={{ fontSize: 11, color: '#999' }}>SKU: {item.product_sku}</div>
              </div>
            ),
          },
          {
            title: 'Dispatched Qty',
            dataIndex: 'quantity_sent',
            key: 'quantity_sent',
            width: 130,
            align: 'center',
            render: (qty: number) => <Text strong style={{ color: '#1677ff', fontSize: 13 }}>{qty}</Text>,
          },
          {
            title: 'Received Qty',
            dataIndex: 'quantity_received',
            key: 'quantity_received',
            width: 130,
            align: 'center',
            render: (qty: number, item) => {
              const sent = Number(item.quantity_sent);
              const rec = Number(qty || 0);
              const isMatch = rec === sent;
              return (
                <Text strong style={{ color: isMatch ? '#389e0d' : rec > 0 ? '#fa8c16' : '#999', fontSize: 13 }}>
                  {rec}
                </Text>
              );
            },
          },
          {
            title: 'Variance',
            key: 'variance',
            width: 120,
            align: 'center',
            render: (_, item) => {
              const sent = Number(item.quantity_sent);
              const rec = Number(item.quantity_received || 0);
              const diff = rec - sent;
              if (transfer.status !== 'RECEIVED' && transfer.status !== 'PARTIALLY_RECEIVED') {
                return <span style={{ color: '#999' }}>Pending</span>;
              }
              if (diff === 0) {
                return <Tag color='success'>Exact</Tag>;
              }
              return <Tag color='error'>{diff}</Tag>;
            },
          },
        ]}
      />
    </Card>
  );
};

export default ViewStockTransferModal;
