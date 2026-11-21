import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  ShoppingOutlined
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
import { openModal } from '../../../app/features/modalSlice';
import { useAppDispatch } from '../../../app/hooks/hooks';
import DeleteButton from '../../../common/Button/DeleteButton';
import EditButton from '../../../common/Button/EditButton';
import ViewButton from '../../../common/Button/ViewButton';
import useCheckPermission from '../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import AntTable from '../../../common/Table/AntTable';
import ContainerLayout from '../../../layout/components/ContainerLayout';
import {
  useDeleteStoreProductMutation,
  useGetStoreProductsListQuery,
  useGetStoreSummaryQuery,
} from '../api/storeEndpoints';
import CreateStoreProduct from '../components/CreateStoreProduct';
import DamagedModal from '../components/DamagedModal';
import StockInModal from '../components/StockInModal';
import StockOutModal from '../components/StockOutModal';
import UpdateStoreProduct from '../components/UpdateStoreProduct';
import ViewStoreProduct from '../components/ViewStoreProduct';
import type { IStoreProduct, IStoreProductQuery } from '../types/storeTypes';

const StoreList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('STORE');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IStoreProductQuery>();

  const { data, isLoading, isFetching } = useGetStoreProductsListQuery(query);
  const { data: summaryData, isLoading: isSummaryLoading } = useGetStoreSummaryQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteStoreProductMutation();

  const summary = summaryData?.data;

  const handleStatusFilter = (value?: string) => {
    setQuery({ status: (value as 'ACTIVE' | 'INACTIVE') || undefined, page: 1 });
  };

  return (
    <ContainerLayout
      title='Company Store'
      options={{
        showButton: can_create,
        showSearch: true,
      }}
      buttonText='Create'
      onClick={() =>
        dispatch(
          openModal({
            title: 'Add New Store Product',
            content: <CreateStoreProduct />,
            open: true,
            width: 700,
          })
        )
      }
      additionalFilter={
        <Col xs={24} sm={8} lg={4}>
          <Select
            style={{ width: '100%' }}
            placeholder='Filter by Status'
            allowClear
            value={query.status}
            onChange={handleStatusFilter}
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
          />
        </Col>
      }
    >
      {/* Top Statistics Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#f0f5ff',
              borderColor: '#adc6ff',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ color: '#1d39c4', fontSize: 13, fontWeight: 500 }}>Total Products</span>}
              value={summary?.totalProducts ?? 0}
              prefix={<ShoppingOutlined style={{ color: '#2f54eb', marginRight: 4 }} />}
              valueStyle={{ color: '#1d39c4', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#f6ffed',
              borderColor: '#b7eb8f',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ color: '#237804', fontSize: 13, fontWeight: 500 }}>Available Stock</span>}
              value={summary?.totalCurrentStock ?? 0}
              prefix={<InboxOutlined style={{ color: '#389e0d', marginRight: 4 }} />}
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#e6f4ff',
              borderColor: '#91caff',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ color: '#0958d9', fontSize: 13, fontWeight: 500 }}>Total Stock In</span>}
              value={summary?.totalStockIn ?? 0}
              prefix={<ArrowUpOutlined style={{ color: '#1677ff', marginRight: 4 }} />}
              valueStyle={{ color: '#0958d9', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#fffbe6',
              borderColor: '#ffe58f',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ color: '#d46b08', fontSize: 13, fontWeight: 500 }}>Total Stock Out</span>}
              value={summary?.totalStockOut ?? 0}
              prefix={<ArrowDownOutlined style={{ color: '#fa8c16', marginRight: 4 }} />}
              valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#fff1f0',
              borderColor: '#ffa39e',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ color: '#cf1322', fontSize: 13, fontWeight: 500 }}>Damaged / Wasted</span>}
              value={summary?.totalDamaged ?? 0}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d', marginRight: 4 }} />}
              valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{
              background: '#f9f0ff',
              borderColor: '#d3adf7',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ color: '#531dab', fontSize: 13, fontWeight: 500 }}>Total Stock Valuation</span>}
              value={summary?.totalValuation ?? 0}
              prefix='৳'
              precision={2}
              valueStyle={{ color: '#531dab', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <AntTable<IStoreProduct>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            title: 'Product Code',
            dataIndex: 'code',
            key: 'code',
            width: 130,
            render: (code: string) => (
              <Tag color='purple' style={{ fontWeight: 600 }}>
                {code}
              </Tag>
            ),
          },
          {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record) => (
              <div>
                <span style={{ fontWeight: 600 }}>{name}</span>
                {record.description && (
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {record.description.length > 50
                      ? `${record.description.substring(0, 50)}...`
                      : record.description}
                  </div>
                )}
              </div>
            ),
          },
          {
            title: 'Unit Price',
            dataIndex: 'unit_price',
            key: 'unit_price',
            width: 110,
            render: (price: number) => `৳${Number(price || 0).toLocaleString()}`,
          },
          {
            title: 'Stock In',
            dataIndex: 'stock_in',
            key: 'stock_in',
            width: 90,
            align: 'center',
            render: (val: number) => (
              <span style={{ color: '#0958d9', fontWeight: 600 }}>{val ?? 0}</span>
            ),
          },
          {
            title: 'Stock Out',
            dataIndex: 'stock_out',
            key: 'stock_out',
            width: 95,
            align: 'center',
            render: (val: number) => (
              <span style={{ color: '#d46b08', fontWeight: 600 }}>{val ?? 0}</span>
            ),
          },
          {
            title: 'Damaged',
            dataIndex: 'damaged_quantity',
            key: 'damaged_quantity',
            width: 95,
            align: 'center',
            render: (val: number) => (
              <span style={{ color: '#cf1322', fontWeight: 600 }}>{val ?? 0}</span>
            ),
          },
          {
            title: 'Current Stock',
            dataIndex: 'current_stock',
            key: 'current_stock',
            width: 120,
            align: 'center',
            render: (stock: number) => {
              const count = Number(stock || 0);
              let color = '#52c41a';
              let badgeStatus: 'success' | 'warning' | 'error' = 'success';

              if (count === 0) {
                color = '#ff4d4f';
                badgeStatus = 'error';
              } else if (count <= 5) {
                color = '#faad14';
                badgeStatus = 'warning';
              }

              return (
                <Badge
                  status={badgeStatus}
                  text={
                    <span style={{ fontWeight: 700, color, fontSize: '14px' }}>
                      {count}
                    </span>
                  }
                />
              );
            },
          },
          {
            title: 'Total Value',
            key: 'total_value',
            width: 120,
            render: (_, record) => {
              const total = (record.current_stock || 0) * (record.unit_price || 0);
              return <strong>৳{total.toLocaleString()}</strong>;
            },
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 90,
            align: 'center',
            render: (status: string) => (
              <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
                {status}
              </Tag>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            width: 250,
            render: (_, record: IStoreProduct) => (
              <Space size='small' wrap>
                {/* Stock In Quick Button */}
                <Tooltip title='Stock In'>
                  <Button
                    size='small'
                    type='primary'
                    ghost
                    icon={<ArrowUpOutlined />}
                    style={{ borderColor: '#52c41a', color: '#52c41a' }}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Stock In: ${record.name}`,
                          content: <StockInModal record={record} />,
                          open: true,
                          width: 600,
                        })
                      )
                    }
                  />
                </Tooltip>

                {/* Stock Out Quick Button */}
                <Tooltip title='Stock Out'>
                  <Button
                    size='small'
                    type='primary'
                    ghost
                    icon={<ArrowDownOutlined />}
                    disabled={record.current_stock <= 0}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Stock Out: ${record.name}`,
                          content: <StockOutModal record={record} />,
                          open: true,
                          width: 600,
                        })
                      )
                    }
                  />
                </Tooltip>

                {/* Damaged Quick Button */}
                <Tooltip title='Damaged / Wasted'>
                  <Button
                    size='small'
                    danger
                    ghost
                    icon={<CloseCircleOutlined />}
                    disabled={record.current_stock <= 0}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Mark Damaged: ${record.name}`,
                          content: <DamagedModal record={record} />,
                          open: true,
                          width: 600,
                        })
                      )
                    }
                  />
                </Tooltip>

                {/* View Details / History */}
                <Tooltip title='View Stock History'>
                  <ViewButton
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Store Product Details: ${record.name}`,
                          content: <ViewStoreProduct id={record.id} />,
                          open: true,
                          width: 1000,
                        })
                      )
                    }
                  />
                </Tooltip>

                {/* Edit */}
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Store Product',
                        content: <UpdateStoreProduct record={record} />,
                        open: true,
                        width: 700,
                      })
                    )
                  }
                />

                {/* Delete */}
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleteProduct(record.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default StoreList;
