import { Card, Col, Row, Select, Space, Statistic, Tag } from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import AntTable from '../../../../common/Table/AntTable';
import { ImagePreview } from '../../../../common/components/Image';
import {
  SelectBranch,
  SelectBrand,
  SelectCategory,
  SelectSupplier,
  SelectWarehouse,
} from '../../../../common/SelectWithApi/Select';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import { useGetStockBatchReportQuery } from '../api/stockBatchReportEndpoints';
import type {
  IStockBatchReportItem,
  IStockBatchReportQuery,
} from '../types/stockBatchReport.types';

const StockBatchReport = () => {
  const { query, setQuery } = useQueryParams<IStockBatchReportQuery>();
  const { data, isLoading, isFetching } = useGetStockBatchReportQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const summary = data?.summary || {
    total_batches: 0,
    total_initial_quantity: 0,
    total_remaining_quantity: 0,
    total_consumed_quantity: 0,
    total_inventory_value: 0,
    total_batch_cost: 0,
    active_batches: 0,
    depleted_batches: 0,
  };

  const columns = [
    {
      dataIndex: 'batch_number',
      key: 'batch_number',
      title: 'Batch Info',
      width: 150,
      render: (text: string, record: IStockBatchReportItem) => (
        <Space direction='vertical' size={2}>
          <Tag color='geekblue' style={{ fontWeight: 600 }}>
            {text}
          </Tag>
          <span style={{ fontSize: 11, color: '#888' }}>
            {dateAndTimeFormat(record.created_at)}
          </span>
          {record.is_opening_stock && (
            <Tag color='purple' style={{ fontSize: 10 }}>Opening Stock</Tag>
          )}
        </Space>
      ),
    },
    {
      dataIndex: 'product_image',
      key: 'product_image',
      title: 'Image',
      width: 60,
      align: 'center' as const,
      render: (src?: string) => <ImagePreview src={src || ''} width={38} height={38} />,
    },
    {
      dataIndex: 'product_title',
      key: 'product_title',
      title: 'Product',
      render: (text: string, record: IStockBatchReportItem) => (
        <Space direction='vertical' size={0}>
          <span><strong>{text}</strong></span>
          <span style={{ fontSize: 11, color: '#888' }}>
            SKU: {record.product_sku}
            {record.variant_name ? ` (${record.variant_name})` : ''}
          </span>
          {record.category_name && (
            <span style={{ fontSize: 11, color: '#1677ff' }}>
              {record.category_name} {record.brand_name ? `• ${record.brand_name}` : ''}
            </span>
          )}
        </Space>
      ),
    },
    {
      dataIndex: 'branch_name',
      key: 'branch_name',
      title: 'Branch',
      width: 130,
      render: (branch?: string) => branch || <span style={{ color: '#999' }}>Central</span>,
    },
    {
      dataIndex: 'warehouse_name',
      key: 'warehouse_name',
      title: 'Warehouse',
      width: 140,
      render: (text: string, record: IStockBatchReportItem) => (
        <Space direction='vertical' size={0}>
          <span><strong>{text}</strong></span>
          <span style={{ fontSize: 11, color: '#888' }}>{record.warehouse_code}</span>
        </Space>
      ),
    },
    {
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      title: 'Source / Supplier',
      width: 150,
      render: (text?: string, record?: IStockBatchReportItem) => (
        <Space direction='vertical' size={0}>
          <span>{text || (record?.is_opening_stock ? 'Opening Stock' : '-')}</span>
          {record?.purchase_number && (
            <span style={{ fontSize: 11, color: '#888' }}>
              PO: {record.purchase_number}
            </span>
          )}
        </Space>
      ),
    },
    {
      dataIndex: 'purchase_price',
      key: 'purchase_price',
      title: 'Unit Cost',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `৳ ${numberWithComma(price)}`,
    },
    {
      dataIndex: 'mrp',
      key: 'mrp',
      title: 'MRP',
      width: 100,
      align: 'right' as const,
      render: (mrp?: number) => (mrp !== undefined && mrp !== null ? `৳ ${numberWithComma(mrp)}` : '-'),
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: 'Initial Qty',
      width: 90,
      align: 'center' as const,
      render: (qty: number) => `${numberWithComma(qty)}`,
    },
    {
      dataIndex: 'remaining_quantity',
      key: 'remaining_quantity',
      title: 'Remaining Qty',
      width: 110,
      align: 'center' as const,
      render: (qty: number) => (
        <Tag color={qty > 0 ? 'green' : 'default'} style={{ fontWeight: 600 }}>
          {numberWithComma(qty)}
        </Tag>
      ),
    },
    {
      dataIndex: 'consumed_quantity',
      key: 'consumed_quantity',
      title: 'Consumed Qty',
      width: 100,
      align: 'center' as const,
      render: (qty: number) => `${numberWithComma(qty)}`,
    },
    {
      dataIndex: 'remaining_value',
      key: 'remaining_value',
      title: 'Remaining Value',
      width: 120,
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ fontWeight: 600, color: '#389e0d' }}>
          ৳ {numberWithComma(val)}
        </span>
      ),
    },
    {
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      title: 'Expiry Date',
      width: 110,
      render: (date?: string) => (date ? dateAndTimeFormat(date) : '-'),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Status',
      width: 90,
      align: 'center' as const,
      render: (status: 'ACTIVE' | 'DEPLETED') => (
        <Tag color={status === 'ACTIVE' ? 'processing' : 'default'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <ReportContainer
      title='Stock Batch Report'
      options={{
        showSearch: true,
      }}
      additionalFilter={
        <Space wrap>
          <SelectBranch
            standalone
            placeholder='All Branches'
            value={query.branch_id ? Number(query.branch_id) : undefined}
            onChange={(val) => setQuery({ branch_id: val, page: 1 })}
            style={{ width: 160 }}
          />
          <SelectWarehouse
            standalone
            placeholder='All Warehouses'
            value={query.warehouse_id ? Number(query.warehouse_id) : undefined}
            onChange={(val) => setQuery({ warehouse_id: val, page: 1 })}
            style={{ width: 160 }}
          />
          <SelectCategory
            standalone
            placeholder='All Categories'
            value={query.category_id ? Number(query.category_id) : undefined}
            onChange={(val) => setQuery({ category_id: val, page: 1 })}
            style={{ width: 170 }}
          />
          <SelectBrand
            standalone
            placeholder='All Brands'
            value={query.brand_id ? Number(query.brand_id) : undefined}
            onChange={(val) => setQuery({ brand_id: val, page: 1 })}
            style={{ width: 150 }}
          />
          <SelectSupplier
            standalone
            placeholder='All Suppliers'
            value={query.supplier_id ? Number(query.supplier_id) : undefined}
            onChange={(val) => setQuery({ supplier_id: val, page: 1 })}
            style={{ width: 170 }}
          />
          <Select
            placeholder='Batch Status'
            allowClear
            value={query.status}
            onChange={(val) => setQuery({ status: val, page: 1 })}
            style={{ width: 130 }}
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Depleted', value: 'DEPLETED' },
            ]}
          />
          <Select
            placeholder='Stock Source'
            allowClear
            value={query.is_opening_stock}
            onChange={(val) => setQuery({ is_opening_stock: val, page: 1 })}
            style={{ width: 150 }}
            options={[
              { label: 'Opening Stock', value: 'true' },
              { label: 'Purchased Stock', value: 'false' },
            ]}
          />
        </Space>
      }
    >
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Total Batches'
              value={summary.total_batches}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Active Batches'
              value={summary.active_batches}
              valueStyle={{ fontSize: 18, color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Remaining Units'
              value={summary.total_remaining_quantity}
              valueStyle={{ fontSize: 18, color: '#389e0d' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Consumed Units'
              value={summary.total_consumed_quantity}
              valueStyle={{ fontSize: 18, color: '#d46b08' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Inventory Valuation'
              value={summary.total_inventory_value}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 18, color: '#1d39c4' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Depleted Batches'
              value={summary.depleted_batches}
              valueStyle={{ fontSize: 18, color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IStockBatchReportItem>
        columns={columns}
        dataSource={data?.data}
        loading={isLoading || isFetching}
        total={data?.total}
        rowKey='id'
        size='small'
      />
    </ReportContainer>
  );
};

export default StockBatchReport;
