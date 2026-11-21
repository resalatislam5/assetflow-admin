import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Col, Select, Tag } from 'antd';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { SelectBranch, SelectWarehouse } from '../../../../common/SelectWithApi';
import { useGetStockMovementReportQuery } from '../api/stockReportEndpoints';
import type { IStockLog, IStockReportQuery, TransactionType } from '../types/stockReportTypes';

const StockReportList = () => {
  const { query, setQuery } = useQueryParams<IStockReportQuery>();
  const { data, isLoading, isFetching } = useGetStockMovementReportQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const handleBranchFilter = (value?: string | number) => {
    setQuery({ branch_id: value || undefined, page: 1 });
  };

  const handleWarehouseFilter = (value?: string | number) => {
    setQuery({ warehouse_id: value || undefined, page: 1 });
  };

  const handleTypeFilter = (value?: string) => {
    setQuery({ transaction_type: value || undefined, page: 1 });
  };

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
    <ReportContainer
      title='Stock Movement & Audit Logs'
      options={{
        showSearch: true,
      }}
      additionalFilter={
        <>
          <Col xs={24} sm={12} lg={4}>
            <SelectBranch
              standalone
              placeholder='Filter by Branch'
              value={query.branch_id ? Number(query.branch_id) : undefined}
              onChange={handleBranchFilter}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <SelectWarehouse
              standalone
              placeholder='Filter by Warehouse'
              value={query.warehouse_id ? Number(query.warehouse_id) : undefined}
              onChange={handleWarehouseFilter}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Movement Type'
              allowClear
              value={query.transaction_type}
              onChange={handleTypeFilter}
              options={[
                { label: 'Purchase Received', value: 'PURCHASE_RECEIVED' },
                { label: 'Purchase Return', value: 'PURCHASE_RETURN' },
                { label: 'POS Sale', value: 'POS_SALE' },
                { label: 'POS Return', value: 'POS_RETURN' },
                { label: 'Order Shipped', value: 'ORDER_SHIPPED' },
                { label: 'Order Reservation', value: 'ORDER_RESERVATION' },
                { label: 'Order Cancelled', value: 'ORDER_CANCELLED' },
                { label: 'Customer Return', value: 'ORDER_RETURNED' },
                { label: 'Transfer Out', value: 'TRANSFER_OUT' },
                { label: 'Transfer In', value: 'TRANSFER_IN' },
                { label: 'Manual Adjustment', value: 'MANUAL_ADJUSTMENT' },
                { label: 'Damaged / Write Off', value: 'DAMAGED' },
                { label: 'Expired', value: 'EXPIRED' },
                { label: 'Opening Stock', value: 'OPENING_STOCK' },
              ]}
            />
          </Col>
        </>
      }
    >
      <AntTable<IStockLog>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            title: 'Movement Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 170,
            render: (text: string) => dateAndTimeFormat(text),
          },
          {
            title: 'Movement Type',
            dataIndex: 'transaction_type',
            key: 'transaction_type',
            width: 170,
            render: (type: TransactionType) => getTransactionTag(type),
          },
          {
            title: 'Product',
            key: 'product',
            render: (_, record) => (
              <div>
                <strong>{record.product_title}</strong>
                {record.variant_name && (
                  <Tag color='geekblue' style={{ marginLeft: 6 }}>
                    {record.variant_name}
                  </Tag>
                )}
                <div style={{ fontSize: '11px', color: '#999' }}>SKU: {record.product_sku}</div>
              </div>
            ),
          },
          {
            title: 'Branch',
            dataIndex: 'branch_name',
            key: 'branch_name',
            width: 140,
            render: (branch: string) => branch || <span style={{ color: '#999' }}>Central</span>,
          },
          {
            title: 'Warehouse',
            dataIndex: 'warehouse_name',
            key: 'warehouse_name',
            width: 150,
          },
          {
            title: 'Batch Number',
            dataIndex: 'batch_number',
            key: 'batch_number',
            width: 140,
            render: (batch: string) => batch ? <Tag color='geekblue'>{batch}</Tag> : <span style={{ color: '#999' }}>-</span>,
          },
          {
            title: 'Qty Change',
            dataIndex: 'quantity_change',
            key: 'quantity_change',
            width: 120,
            align: 'center',
            render: (val: number) => {
              const num = Number(val);
              const color = num > 0 ? '#52c41a' : num < 0 ? '#cf1322' : '#595959';
              return (
                <span style={{ fontWeight: 700, color, fontSize: 13 }}>
                  {num > 0 ? `+${num}` : num}
                </span>
              );
            },
          },
          {
            title: 'Before Qty',
            dataIndex: 'previous_quantity',
            key: 'previous_quantity',
            width: 100,
            align: 'center',
          },
          {
            title: 'After Qty',
            dataIndex: 'new_quantity',
            key: 'new_quantity',
            width: 100,
            align: 'center',
            render: (val: number) => <strong>{val}</strong>,
          },
          {
            title: 'Reference',
            key: 'reference',
            width: 150,
            render: (_, record) => (
              <div>
                {record.reference_type && (
                  <Tag color='blue' style={{ fontSize: 10 }}>
                    {record.reference_type}
                  </Tag>
                )}
                {record.reference_id && (
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    {record.reference_id}
                  </div>
                )}
              </div>
            ),
          },
          {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes: string) => notes || <span style={{ color: '#999' }}>-</span>,
          },
          {
            title: 'Recorded By',
            dataIndex: 'created_by_name',
            key: 'created_by_name',
            width: 140,
            render: (name: string, record) => (
              <div>
                <div>{name || <span style={{ color: '#999' }}>System</span>}</div>
                {record.created_by_email && (
                  <div style={{ fontSize: 10, color: '#999' }}>{record.created_by_email}</div>
                )}
              </div>
            ),
          },
        ]}
      />
    </ReportContainer>
  );
};

export default StockReportList;
