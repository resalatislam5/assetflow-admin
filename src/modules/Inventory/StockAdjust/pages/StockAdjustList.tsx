import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  PlusOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Select, Statistic, Tag } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { ImagePreview } from '../../../../common/components/Image';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import { SelectBranch, SelectWarehouse } from '../../../../common/SelectWithApi';
import { useGetStockAdjustmentsQuery } from '../api/stockAdjustEndpoints';
import CreateStockAdjustModal from '../components/CreateStockAdjustModal';
import type { IStockAdjustment, IStockAdjustmentQuery, TransactionType } from '../types/stockAdjustTypes';

const StockAdjustList = () => {
  const { can_create } = useCheckPermission('INVENTORY');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IStockAdjustmentQuery>();

  const { data, isLoading, isFetching } = useGetStockAdjustmentsQuery(query);

  const adjustments = data?.data || [];
  const totalAdjustments = data?.total || adjustments.length;

  const totalPositive = adjustments
    .filter((a) => Number(a.quantity_change) > 0)
    .reduce((acc, curr) => acc + Number(curr.quantity_change), 0);

  const totalNegative = adjustments
    .filter((a) => Number(a.quantity_change) < 0)
    .reduce((acc, curr) => acc + Math.abs(Number(curr.quantity_change)), 0);

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
      case 'MANUAL_ADJUSTMENT':
        return (
          <Tag color='blue' icon={<SwapOutlined />}>
            MANUAL ADJUSTMENT
          </Tag>
        );
      case 'PURCHASE_RECEIVED':
        return (
          <Tag color='success' icon={<ArrowUpOutlined />}>
            PURCHASE RECEIVED
          </Tag>
        );
      case 'TRANSFER_IN':
        return (
          <Tag color='geekblue' icon={<SwapOutlined />}>
            TRANSFER IN
          </Tag>
        );
      case 'TRANSFER_OUT':
        return (
          <Tag color='orange' icon={<SwapOutlined />}>
            TRANSFER OUT
          </Tag>
        );
      case 'OPENING_STOCK':
        return (
          <Tag color='purple' icon={<ArrowUpOutlined />}>
            OPENING STOCK
          </Tag>
        );
      default:
        return <Tag color='default'>{type}</Tag>;
    }
  };

  return (
    <ContainerLayout
      title='Stock Adjustments'
      options={{
        showButton: can_create,
        showSearch: true,
      }}
      buttonText='New Adjustment'
      onClick={() =>
        dispatch(
          openModal({
            title: 'Record Stock Adjustment',
            content: <CreateStockAdjustModal />,
            open: true,
            width: 700,
          })
        )
      }
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
              placeholder='Filter by Type'
              allowClear
              value={query.transaction_type}
              onChange={handleTypeFilter}
              options={[
                { label: 'All Adjustments', value: '' },
                { label: 'Manual Adjustment', value: 'MANUAL_ADJUSTMENT' },
                { label: 'Damaged / Write-Off', value: 'DAMAGED' },
                { label: 'Expired', value: 'EXPIRED' },
                { label: 'Opening Stock', value: 'OPENING_STOCK' },
              ]}
            />
          </Col>
        </>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Statistic
              title='Total Adjustments'
              value={totalAdjustments}
              prefix={<FileDoneOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#e6f4ff', border: '1px solid #91caff' }}>
            <Statistic
              title='Stock Added (+)'
              value={totalPositive}
              prefix={<PlusOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#fff1f0', border: '1px solid #ffa39e' }}>
            <Statistic
              title='Stock Deducted (-)'
              value={totalNegative}
              prefix={<ArrowDownOutlined style={{ color: '#cf1322' }} />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#fffbe6', border: '1px solid #ffe58f' }}>
            <Statistic
              title='Net Qty Variance'
              value={totalPositive - totalNegative}
              valueStyle={{ color: totalPositive - totalNegative >= 0 ? '#389e0d' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IStockAdjustment>
        dataSource={adjustments}
        rowKey='id'
        loading={isLoading || isFetching}
        total={totalAdjustments}
        columns={[
          {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 170,
            render: (date: string) => dateAndTimeFormat(date),
          },
          {
            title: 'Product Image',
            dataIndex: 'product_image',
            key: 'product_image',
            width: 80,
            align: 'center',
            render: (src?: string) => <ImagePreview src={src || ''} width={40} height={40} />,
          },
          {
            title: 'Product Details',
            dataIndex: 'product_title',
            key: 'product_title',
            render: (title: string, record) => (
              <div>
                <strong>{title}</strong>
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
            title: 'Adjustment Type',
            dataIndex: 'transaction_type',
            key: 'transaction_type',
            width: 160,
            render: (type: TransactionType) => getTransactionTag(type),
          },
          {
            title: 'Quantity Change',
            dataIndex: 'quantity_change',
            key: 'quantity_change',
            width: 130,
            align: 'center',
            render: (val: number) => {
              const num = Number(val);
              const color = num > 0 ? '#52c41a' : num < 0 ? '#cf1322' : '#595959';
              return (
                <span style={{ fontWeight: 700, color, fontSize: '14px' }}>
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
            title: 'Notes / Reason',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes: string) => notes || <span style={{ color: '#999' }}>-</span>,
          },
          {
            title: 'Recorded By',
            dataIndex: 'created_by_user_name',
            key: 'created_by_user_name',
            width: 130,
            render: (name: string) => name || <span style={{ color: '#999' }}>System</span>,
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default StockAdjustList;
