import {
  AlertOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  HomeOutlined,
  InboxOutlined,
  PlusOutlined,
  SettingOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import {
  Badge,
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
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import { SelectBranch, SelectWarehouse } from '../../../../common/SelectWithApi';
import {
  useGetInventorySummaryQuery,
  useGetStockListQuery,
} from '../api/stockEndpoints';
import AdjustStockModal from '../components/AdjustStockModal';
import SetSafetyStockModal from '../components/SetSafetyStockModal';
import ViewStockHistory from '../components/ViewStockHistory';
import type { IStock, IStockQuery } from '../types/stockTypes';

const StockList = () => {
  const { can_create, can_update } = useCheckPermission('INVENTORY');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IStockQuery>();

  const { data, isLoading, isFetching } = useGetStockListQuery(query);
  const { data: summaryData, isLoading: isSummaryLoading } = useGetInventorySummaryQuery();

  const summary = summaryData?.data;

  const handleBranchFilter = (value?: string | number) => {
    setQuery({ branch_id: value || undefined, page: 1 });
  };

  const handleWarehouseFilter = (value?: string | number) => {
    setQuery({ warehouse_id: value || undefined, page: 1 });
  };

  const handleStatusFilter = (value?: string) => {
    setQuery({
      stock_status: (value as 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK') || undefined,
      page: 1,
    });
  };

  return (
    <ContainerLayout
      title='Inventory & Stock Overview'
      options={{
        showButton: can_create || can_update,
        showSearch: true,
      }}
      buttonText='Adjust Stock'
      onClick={() =>
        dispatch(
          openModal({
            title: 'New Stock Movement / Adjustment',
            content: <AdjustStockModal />,
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
              placeholder='Filter by Stock Status'
              allowClear
              value={query.stock_status}
              onChange={handleStatusFilter}
              options={[
                { label: 'In Stock', value: 'IN_STOCK' },
                { label: 'Low Stock Alert', value: 'LOW_STOCK' },
                { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button
              icon={<SettingOutlined />}
              disabled={!can_update}
              style={{ width: '100%' }}
              onClick={() =>
                dispatch(
                  openModal({
                    title: 'Set Warehouse Safety Stock',
                    content: <SetSafetyStockModal />,
                    open: true,
                    width: 600,
                  })
                )
              }
            >
              Set Safety Stock
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
            style={{ background: '#f0f5ff', borderColor: '#adc6ff', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#1d39c4', fontSize: 13, fontWeight: 500 }}>Total Warehouses</span>}
              value={summary?.totalWarehouses ?? 0}
              prefix={<HomeOutlined style={{ color: '#2f54eb', marginRight: 4 }} />}
              valueStyle={{ color: '#1d39c4', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#237804', fontSize: 13, fontWeight: 500 }}>Total Stock On Hand</span>}
              value={summary?.totalStockOnHand ?? 0}
              prefix={<InboxOutlined style={{ color: '#389e0d', marginRight: 4 }} />}
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#fffbe6', borderColor: '#ffe58f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#d46b08', fontSize: 13, fontWeight: 500 }}>Total Reserved Stock</span>}
              value={summary?.totalReservedStock ?? 0}
              prefix={<SwapOutlined style={{ color: '#fa8c16', marginRight: 4 }} />}
              valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#fff7e6', borderColor: '#ffd591', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#d4380d', fontSize: 13, fontWeight: 500 }}>Low Stock Alert</span>}
              value={summary?.lowStockCount ?? 0}
              prefix={<AlertOutlined style={{ color: '#fa541c', marginRight: 4 }} />}
              valueStyle={{ color: '#d4380d', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#fff1f0', borderColor: '#ffa39e', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#cf1322', fontSize: 13, fontWeight: 500 }}>Out of Stock</span>}
              value={summary?.outOfStockCount ?? 0}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d', marginRight: 4 }} />}
              valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IStock>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            title: 'Product Title',
            dataIndex: 'product_title',
            key: 'product_title',
            render: (text: string, record) => (
              <div>
                <span style={{ fontWeight: 600 }}>{text}</span>
                {record.variant_name && (
                  <Tag color='geekblue' style={{ marginLeft: 6 }}>
                    {record.variant_name}
                  </Tag>
                )}
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {record.category_name && <span>{record.category_name} &bull; </span>}
                  {record.brand_name && <span>{record.brand_name}</span>}
                </div>
              </div>
            ),
          },
          {
            title: 'Product SKU',
            dataIndex: 'product_sku',
            key: 'product_sku',
            width: 140,
            render: (sku: string) => (
              <Tag color='purple' style={{ fontWeight: 600 }}>
                {sku}
              </Tag>
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
            width: 160,
            render: (name: string, record) => (
              <div>
                <strong>{name}</strong>
                <div style={{ fontSize: '11px', color: '#999' }}>{record.warehouse_code}</div>
              </div>
            ),
          },
          {
            title: 'Bin Location',
            dataIndex: 'bin_location',
            key: 'bin_location',
            width: 110,
            render: (bin: string) => bin ? <Tag color='cyan'>{bin}</Tag> : <span style={{ color: '#999' }}>-</span>,
          },
          {
            title: 'On Hand',
            dataIndex: 'quantity_on_hand',
            key: 'quantity_on_hand',
            width: 100,
            align: 'center',
            render: (val: number, record) => {
              const count = Number(val || 0);
              let color = '#52c41a';
              if (count <= 0) color = '#ff4d4f';
              else if (count <= record.safety_stock) color = '#faad14';
              return <span style={{ fontWeight: 700, color, fontSize: 14 }}>{count}</span>;
            },
          },
          {
            title: 'Reserved',
            dataIndex: 'quantity_reserved',
            key: 'quantity_reserved',
            width: 95,
            align: 'center',
            render: (val: number) => (
              <span style={{ color: '#fa8c16', fontWeight: 600 }}>{val ?? 0}</span>
            ),
          },
          {
            title: 'Available',
            dataIndex: 'available_quantity',
            key: 'available_quantity',
            width: 100,
            align: 'center',
            render: (val: number) => (
              <span style={{ color: '#0958d9', fontWeight: 600 }}>{val ?? 0}</span>
            ),
          },
          {
            title: 'Safety Stock',
            dataIndex: 'safety_stock',
            key: 'safety_stock',
            width: 125,
            align: 'center',
            render: (val: number, record: IStock) => (
              <Space size={4}>
                <span style={{ fontWeight: 600 }}>{val ?? 5}</span>
                <Button
                  size='small'
                  type='text'
                  icon={<SettingOutlined style={{ fontSize: 13, color: '#1677ff' }} />}
                  disabled={!can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: `Set Safety Stock: ${record.product_title}`,
                        content: <SetSafetyStockModal record={record} />,
                        open: true,
                        width: 600,
                      })
                    )
                  }
                />
              </Space>
            ),
          },
          {
            title: 'Status',
            dataIndex: 'stock_status',
            key: 'stock_status',
            width: 120,
            align: 'center',
            render: (status: string) => {
              let badgeStatus: 'success' | 'warning' | 'error' = 'success';
              let label = 'IN STOCK';
              if (status === 'OUT_OF_STOCK') {
                badgeStatus = 'error';
                label = 'OUT OF STOCK';
              } else if (status === 'LOW_STOCK') {
                badgeStatus = 'warning';
                label = 'LOW STOCK';
              }
              return <Badge status={badgeStatus} text={label} />;
            },
          },
          {
            title: 'Action',
            key: 'action',
            width: 130,
            align: 'center',
            render: (_, record: IStock) => (
              <Space size='small'>
                <Tooltip title='Adjust Stock'>
                  <Button
                    size='small'
                    type='primary'
                    ghost
                    icon={<PlusOutlined />}
                    disabled={!can_update}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Adjust Stock: ${record.product_title}`,
                          content: <AdjustStockModal record={record} />,
                          open: true,
                          width: 700,
                        })
                      )
                    }
                  />
                </Tooltip>

                <Tooltip title='Set Safety Stock'>
                  <Button
                    size='small'
                    icon={<SettingOutlined />}
                    disabled={!can_update}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Set Safety Stock: ${record.product_title}`,
                          content: <SetSafetyStockModal record={record} />,
                          open: true,
                          width: 600,
                        })
                      )
                    }
                  />
                </Tooltip>

                <Tooltip title='View Stock History'>
                  <Button
                    size='small'
                    icon={<EyeOutlined />}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Stock History: ${record.product_title} (${record.warehouse_name})`,
                          content: <ViewStockHistory id={record.id} />,
                          open: true,
                          width: 1000,
                        })
                      )
                    }
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default StockList;
