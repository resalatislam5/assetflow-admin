import { Col, Select, Space, Tag } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteWarehouseMutation,
  useGetWarehouseListQuery,
} from '../api/warehouseEndpoints';
import CreateWarehouse from '../components/CreateWarehouse';
import UpdateWarehouse from '../components/UpdateWarehouse';
import type {
  IWarehouse,
  IWarehouseQuery,
  TWarehouseType,
} from '../types/warehouseTypes';

const WarehouseList = () => {
  const { can_create, can_delete, can_update } =
    useCheckPermission('INVENTORY');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IWarehouseQuery>();

  const { data, isLoading, isFetching } = useGetWarehouseListQuery(query);
  const [deleteWarehouse, { isLoading: isDeleting }] =
    useDeleteWarehouseMutation();

  const handleStatusFilter = (value?: string) => {
    setQuery({
      is_active: value !== undefined && value !== '' ? value : undefined,
      page: 1,
    });
  };

  const handleTypeFilter = (value?: TWarehouseType) => {
    setQuery({ type: value || undefined, page: 1 });
  };

  return (
    <ContainerLayout
      title='Warehouse Management'
      options={{
        showButton: can_create,
        showSearch: true,
      }}
      buttonText='Create Warehouse'
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Warehouse',
            content: <CreateWarehouse />,
            open: true,
            width: 700,
          }),
        )
      }
      additionalFilter={
        <>
          <Col xs={24} sm={8} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Status'
              allowClear
              value={
                query.is_active !== undefined
                  ? String(query.is_active)
                  : undefined
              }
              onChange={handleStatusFilter}
              options={[
                { label: 'ACTIVE', value: 'true' },
                { label: 'INACTIVE', value: 'false' },
              ]}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Type'
              allowClear
              value={query.type || undefined}
              onChange={handleTypeFilter}
              options={[
                { label: 'OUTLET_STORE', value: 'OUTLET_STORE' },
                { label: 'CENTRAL_WAREHOUSE', value: 'CENTRAL_WAREHOUSE' },
                { label: 'VIRTUAL', value: 'VIRTUAL' },
              ]}
            />
          </Col>
        </>
      }
    >
      <AntTable<IWarehouse>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            title: 'Code',
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
            title: 'Warehouse Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <strong>{name}</strong>,
          },
          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 140,
            render: (type: TWarehouseType) => {
              const color =
                type === 'CENTRAL_WAREHOUSE'
                  ? 'gold'
                  : type === 'VIRTUAL'
                    ? 'cyan'
                    : 'geekblue';
              return <Tag color={color}>{type || 'OUTLET_STORE'}</Tag>;
            },
          },
          {
            title: 'Assigned Branch',
            key: 'branch_name',
            render: (_, record) =>
              record.branch_name ? (
                <Tag color='blue'>{record.branch_name}</Tag>
              ) : (
                <Tag color='default'>Central Distribution Warehouse</Tag>
              ),
          },
          {
            title: 'Contact Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone: string) => phone || '-',
          },
          {
            title: 'Physical Address',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Stocked SKUs',
            dataIndex: 'stocks_count',
            key: 'stocks_count',
            width: 110,
            align: 'center',
            render: (count: number) => <Tag color='blue'>{count ?? 0}</Tag>,
          },
          {
            title: 'Total Items',
            dataIndex: 'total_items',
            key: 'total_items',
            width: 110,
            align: 'center',
            render: (total: number) => (
              <strong style={{ color: '#237804' }}>{total ?? 0}</strong>
            ),
          },
          {
            title: 'Negative Stock',
            dataIndex: 'allow_negative_stock',
            key: 'allow_negative_stock',
            width: 110,
            align: 'center',
            render: (allow: boolean) => (
              <Tag color={allow ? 'orange' : 'default'}>
                {allow ? 'ALLOWED' : 'BLOCKED'}
              </Tag>
            ),
          },
          {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 95,
            align: 'center',
            render: (isActive: boolean) => (
              <Tag color={isActive ? 'green' : 'red'}>
                {isActive ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record: IWarehouse) => (
              <Space size='small'>
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Warehouse',
                        content: <UpdateWarehouse record={record} />,
                        open: true,
                        width: 700,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleteWarehouse(record.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default WarehouseList;
