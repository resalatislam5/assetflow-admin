import { Card, Col, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ReportContainer from '../../../../layout/components/ReportContainer';
import AntTable from '../../../../common/Table/AntTable';
import { ImagePreview } from '../../../../common/components/Image';
import {
  SelectBrand,
  SelectCategory,
  SelectWarehouse,
} from '../../../../common/SelectWithApi/Select';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import { useGetDamagedProductReportQuery } from '../api/damagedProductReportEndpoints';
import type {
  IDamagedProductReportItem,
  IDamagedProductReportQuery,
} from '../types/damagedProductReport.types';

const DamagedProductReport = () => {
  const { query, setQuery } = useQueryParams<IDamagedProductReportQuery>();
  const { data, isLoading, isFetching } = useGetDamagedProductReportQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const summary = data?.summary || {
    total_records: 0,
    total_damaged_quantity: 0,
    total_loss_amount: 0,
    total_products_affected: 0,
    total_warehouses_affected: 0,
  };

  const columns = [
    {
      dataIndex: 'damage_date',
      key: 'damage_date',
      title: 'Date',
      width: 120,
      render: (text: string) => dateAndTimeFormat(text),
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
      render: (text: string, record: IDamagedProductReportItem) => (
        <Space direction='vertical' size={0}>
          <span><strong>{text}</strong></span>
          <span style={{ fontSize: 11, color: '#888' }}>
            SKU: {record.product_sku}
            {record.variant_name ? ` (${record.variant_name})` : ''}
          </span>
        </Space>
      ),
    },
    {
      dataIndex: 'category_name',
      key: 'category_name',
      title: 'Category',
      render: (text?: string) => text || '-',
    },
    {
      dataIndex: 'warehouse_name',
      key: 'warehouse_name',
      title: 'Warehouse',
      render: (text: string, record: IDamagedProductReportItem) => (
        <Space direction='vertical' size={0}>
          <span><strong>{text}</strong></span>
          <span style={{ fontSize: 11, color: '#888' }}>{record.warehouse_code}</span>
        </Space>
      ),
    },
    {
      dataIndex: 'damaged_quantity',
      key: 'damaged_quantity',
      title: 'Damaged Qty',
      width: 110,
      align: 'center' as const,
      render: (qty: number) => <Tag color='red'>-{qty} Units</Tag>,
    },
    {
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      title: 'Unit Cost (৳)',
      width: 110,
      align: 'right' as const,
      render: (cost: number) => numberWithComma(cost),
    },
    {
      dataIndex: 'total_loss_amount',
      key: 'total_loss_amount',
      title: 'Total Loss (৳)',
      width: 130,
      align: 'right' as const,
      render: (amount: number) => (
        <Typography.Text strong style={{ color: '#cf1322' }}>
          ৳ {numberWithComma(amount)}
        </Typography.Text>
      ),
    },
    {
      dataIndex: 'previous_stock',
      key: 'stock_change',
      title: 'Stock Change',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: IDamagedProductReportItem) => (
        <span style={{ fontSize: 12 }}>
          {record.previous_stock} &rarr; <strong>{record.current_stock}</strong>
        </span>
      ),
    },
    {
      dataIndex: 'notes',
      key: 'notes',
      title: 'Reason / Notes',
      render: (notes?: string, record?: IDamagedProductReportItem) => (
        <Space direction='vertical' size={0}>
          <span>{notes || '-'}</span>
          {record?.reference_id && (
            <span style={{ fontSize: 11, color: '#888' }}>
              Ref: {record.reference_id}
            </span>
          )}
        </Space>
      ),
    },
    {
      dataIndex: 'created_by_name',
      key: 'created_by_name',
      title: 'Recorded By',
      width: 110,
      render: (name?: string) => name || '-',
    },
  ];

  return (
    <ReportContainer
      title='Damaged Products & Stock Loss Report'
      options={{ showSearch: true }}
      exportExcel={
        data?.data
          ? {
              data: data.data,
              fileName: 'Damaged_Product_Report',
              columns: columns,
              summary: {
                product_title: 'Grand Total:',
                damaged_quantity: summary.total_damaged_quantity,
                total_loss_amount: summary.total_loss_amount,
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
          <SelectCategory
            standalone
            placeholder='All Categories'
            value={query.category_id ? Number(query.category_id) : undefined}
            onChange={(val) => setQuery({ category_id: val, page: 1 })}
            style={{ width: 180 }}
          />
          <SelectBrand
            standalone
            placeholder='All Brands'
            value={query.brand_id ? Number(query.brand_id) : undefined}
            onChange={(val) => setQuery({ brand_id: val, page: 1 })}
            style={{ width: 160 }}
          />
        </Space>
      }
    >
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Total Incidents'
              value={summary.total_records}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Damaged Units'
              value={summary.total_damaged_quantity}
              valueStyle={{ fontSize: 18, color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Total Financial Loss'
              value={summary.total_loss_amount}
              precision={2}
              prefix='৳'
              valueStyle={{ fontSize: 18, color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card size='small'>
            <Statistic
              title='Products Affected'
              value={summary.total_products_affected}
              valueStyle={{ fontSize: 18, color: '#d46b08' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'>
            <Statistic
              title='Warehouses'
              value={summary.total_warehouses_affected}
              valueStyle={{ fontSize: 18, color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IDamagedProductReportItem>
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

export default DamagedProductReport;
