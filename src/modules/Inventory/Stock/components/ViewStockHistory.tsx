import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Card, Col, Descriptions, Divider, Row, Spin, Statistic, Table, Tag } from 'antd';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useGetSingleStockQuery } from '../api/stockEndpoints';
import type { IStockLog, TransactionType } from '../types/stockTypes';

type Props = {
  id: number | string;
};

const ViewStockHistory = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleStockQuery(id);
  const stock = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!stock) {
    return <div>Stock records not found</div>;
  }

  const getTransactionTag = (type: TransactionType) => {
    switch (type) {
      case 'PURCHASE_RECEIVED':
        return (
          <Tag color='success' icon={<ArrowUpOutlined />}>
            PURCHASE RECEIVED
          </Tag>
        );
      case 'PURCHASE_RETURN':
        return (
          <Tag color='volcano' icon={<ArrowDownOutlined />}>
            PURCHASE RETURN
          </Tag>
        );
      case 'POS_SALE':
      case 'ORDER_SHIPPED':
        return (
          <Tag color='processing' icon={<ArrowDownOutlined />}>
            {type === 'POS_SALE' ? 'POS SALE' : 'ORDER SHIPPED'}
          </Tag>
        );
      case 'POS_RETURN':
      case 'ORDER_RETURNED':
        return (
          <Tag color='cyan' icon={<ReloadOutlined />}>
            {type === 'POS_RETURN' ? 'POS RETURN' : 'ORDER RETURNED'}
          </Tag>
        );
      case 'ORDER_RESERVATION':
        return (
          <Tag color='warning' icon={<ArrowDownOutlined />}>
            RESERVED
          </Tag>
        );
      case 'ORDER_CANCELLED':
        return (
          <Tag color='purple' icon={<ReloadOutlined />}>
            ORDER CANCELLED
          </Tag>
        );
      case 'TRANSFER_OUT':
        return (
          <Tag color='orange' icon={<SwapOutlined />}>
            TRANSFER OUT
          </Tag>
        );
      case 'TRANSFER_IN':
        return (
          <Tag color='geekblue' icon={<SwapOutlined />}>
            TRANSFER IN
          </Tag>
        );
      case 'DAMAGED':
        return (
          <Tag color='error' icon={<CloseCircleOutlined />}>
            DAMAGED
          </Tag>
        );
      case 'EXPIRED':
        return (
          <Tag color='magenta' icon={<CloseCircleOutlined />}>
            EXPIRED
          </Tag>
        );
      case 'OPENING_STOCK':
        return (
          <Tag color='blue' icon={<ArrowUpOutlined />}>
            OPENING STOCK
          </Tag>
        );
      case 'MANUAL_ADJUSTMENT':
      default:
        return <Tag color='default'>{type}</Tag>;
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={6}>
          <Card size='small' bordered style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic
              title={<span style={{ color: '#389e0d', fontWeight: 500 }}>Quantity On Hand</span>}
              value={stock.quantity_on_hand}
              valueStyle={{ color: '#389e0d', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size='small' bordered style={{ background: '#fffbe6', borderColor: '#ffe58f' }}>
            <Statistic
              title={<span style={{ color: '#d46b08', fontWeight: 500 }}>Reserved Stock</span>}
              value={stock.quantity_reserved}
              valueStyle={{ color: '#d46b08', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size='small' bordered style={{ background: '#e6f4ff', borderColor: '#91caff' }}>
            <Statistic
              title={<span style={{ color: '#0958d9', fontWeight: 500 }}>Available To Sell</span>}
              value={(stock.quantity_on_hand || 0) - (stock.quantity_reserved || 0)}
              valueStyle={{ color: '#0958d9', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size='small' bordered>
            <Statistic
              title='Safety Stock Alert'
              value={stock.safety_stock}
              valueStyle={{ fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Descriptions bordered size='small' column={{ xs: 1, sm: 2, md: 3 }} style={{ marginBottom: 16 }}>
        <Descriptions.Item label='Product Name'>{stock.product_title}</Descriptions.Item>
        <Descriptions.Item label='Product SKU'>
          <Tag color='blue'>{stock.product_sku}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Branch'>{stock.branch_name || 'Central'}</Descriptions.Item>
        <Descriptions.Item label='Warehouse'>
          <strong>{stock.warehouse_name}</strong> ({stock.warehouse_code})
        </Descriptions.Item>
        {stock.bin_location && (
          <Descriptions.Item label='Bin Location'>
            <Tag color='cyan'>{stock.bin_location}</Tag>
          </Descriptions.Item>
        )}
        {stock.variant_name && (
          <Descriptions.Item label='Variant'>{stock.variant_name}</Descriptions.Item>
        )}
        {stock.category_name && (
          <Descriptions.Item label='Category'>{stock.category_name}</Descriptions.Item>
        )}
        <Descriptions.Item label='Status'>
          <Tag
            color={
              stock.stock_status === 'IN_STOCK'
                ? 'green'
                : stock.stock_status === 'LOW_STOCK'
                ? 'orange'
                : 'red'
            }
          >
            {stock.stock_status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '16px 0 12px' }}>Stock Movement Logs</Divider>

      <Table<IStockLog>
        dataSource={stock.stock_logs || []}
        rowKey={(record, index) => record.id || String(index)}
        size='small'
        bordered
        pagination={{ pageSize: 5 }}
        columns={[
          {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => dateAndTimeFormat(text),
          },
          {
            title: 'Movement Type',
            dataIndex: 'transaction_type',
            key: 'transaction_type',
            render: (type: TransactionType) => getTransactionTag(type),
          },
          {
            title: 'Change',
            dataIndex: 'quantity_change',
            key: 'quantity_change',
            render: (change: number) => (
              <span
                style={{
                  fontWeight: 600,
                  color: change > 0 ? '#52c41a' : change < 0 ? '#ff4d4f' : '#666',
                }}
              >
                {change > 0 ? `+${change}` : change}
              </span>
            ),
          },
          {
            title: 'Previous Qty',
            dataIndex: 'previous_quantity',
            key: 'previous_quantity',
            align: 'center',
          },
          {
            title: 'New Qty',
            dataIndex: 'new_quantity',
            key: 'new_quantity',
            align: 'center',
            render: (val: number) => <strong>{val}</strong>,
          },
          {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || <span style={{ color: '#999' }}>-</span>,
          },
          {
            title: 'Recorded By',
            dataIndex: 'created_by_name',
            key: 'created_by_name',
            render: (name) => name || <span style={{ color: '#999' }}>System</span>,
          },
        ]}
      />
    </Card>
  );
};

export default ViewStockHistory;
