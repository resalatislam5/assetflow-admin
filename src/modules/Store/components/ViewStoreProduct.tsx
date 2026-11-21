import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Card, Col, Descriptions, Divider, Row, Spin, Statistic, Table, Tag } from 'antd';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import { useGetSingleStoreProductQuery } from '../api/storeEndpoints';
import type { IStockLog, StockMovementType } from '../types/storeTypes';

type Props = {
  id: number | string;
};

const ViewStoreProduct = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleStoreProductQuery(id);
  const product = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!product) {
    return <div>Product details not found</div>;
  }

  const getMovementTag = (type: StockMovementType) => {
    switch (type) {
      case 'STOCK_IN':
        return (
          <Tag color='success' icon={<ArrowUpOutlined />}>
            STOCK IN
          </Tag>
        );
      case 'STOCK_OUT':
        return (
          <Tag color='processing' icon={<ArrowDownOutlined />}>
            STOCK OUT
          </Tag>
        );
      case 'DAMAGED':
        return (
          <Tag color='error' icon={<CloseCircleOutlined />}>
            DAMAGED / WASTED
          </Tag>
        );
      default:
        return <Tag>{type}</Tag>;
    }
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Metric Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card size='small' bordered style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic
              title={<span style={{ color: '#389e0d', fontWeight: 500 }}>Current Stock</span>}
              value={product.current_stock}
              valueStyle={{ color: '#389e0d', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small' bordered style={{ background: '#e6f4ff', borderColor: '#91caff' }}>
            <Statistic
              title={<span style={{ color: '#0958d9', fontWeight: 500 }}>Total Stock In</span>}
              value={product.stock_in}
              valueStyle={{ color: '#0958d9', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small' bordered style={{ background: '#fff7e6', borderColor: '#ffd591' }}>
            <Statistic
              title={<span style={{ color: '#d46b08', fontWeight: 500 }}>Total Stock Out</span>}
              value={product.stock_out}
              valueStyle={{ color: '#d46b08', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small' bordered style={{ background: '#fff1f0', borderColor: '#ffa39e' }}>
            <Statistic
              title={<span style={{ color: '#cf1322', fontWeight: 500 }}>Damaged Quantity</span>}
              value={product.damaged_quantity}
              valueStyle={{ color: '#cf1322', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small' bordered>
            <Statistic
              title='Unit Price'
              value={product.unit_price}
              prefix='৳'
              precision={2}
              valueStyle={{ fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small' bordered>
            <Statistic
              title='Total Stock Value'
              value={product.current_stock * product.unit_price}
              prefix='৳'
              precision={2}
              valueStyle={{ color: '#1677ff', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Product Details Descriptions */}
      <Descriptions
        bordered
        size='small'
        column={{ xs: 1, sm: 2, md: 3 }}
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label='Product Name'>{product.name}</Descriptions.Item>
        <Descriptions.Item label='Product Code'>
          <Tag color='purple'>{product.code}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={product.status === 'ACTIVE' ? 'green' : 'red'}>
            {product.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Created At' span={2}>
          {dateAndTimeFormat(product.created_at || product.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label='Last Updated'>
          {dateAndTimeFormat(product.updated_at || product.updatedAt)}
        </Descriptions.Item>
        {product.description && (
          <Descriptions.Item label='Description / Notes' span={3}>
            {product.description}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider style={{ margin: '16px 0 12px' }}>
        Stock Movement & Transaction History
      </Divider>

      <Table<IStockLog>
        dataSource={product.stock_logs || []}
        rowKey={(record, index) => record.id || String(index)}
        size='small'
        bordered
        pagination={{ pageSize: 5 }}
        columns={[
          {
            title: 'Movement Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => dateAndTimeFormat(text),
          },
          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: StockMovementType) => getMovementTag(type),
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty: number, record) => (
              <span
                style={{
                  fontWeight: 600,
                  color:
                    record.type === 'STOCK_IN'
                      ? '#52c41a'
                      : record.type === 'STOCK_OUT'
                      ? '#1677ff'
                      : '#ff4d4f',
                }}
              >
                {record.type === 'STOCK_IN' ? `+${qty}` : `-${qty}`}
              </span>
            ),
          },
          {
            title: 'Unit Price',
            dataIndex: 'unit_price',
            key: 'unit_price',
            render: (price) => (price ? `৳${price}` : '-'),
          },
          {
            title: 'Amount / Total',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (amount ? `৳${amount}` : '-'),
          },
          {
            title: 'Remarks / Notes',
            dataIndex: 'remarks',
            key: 'remarks',
            render: (remarks) => remarks || <span style={{ color: '#999' }}>-</span>,
          },
        ]}
      />
    </div>
  );
};

export default ViewStoreProduct;
