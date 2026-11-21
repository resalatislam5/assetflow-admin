import { Popconfirm, Select, Space, Tag } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { openModal } from '../../../../app/features/modalSlice';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import AntTable from '../../../../common/Table/AntTable';
import ViewButton from '../../../../common/Button/ViewButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import {
  SelectBranch,
  SelectSupplier,
  SelectWarehouse,
} from '../../../../common/SelectWithApi';
import {
  useDeletePurchaseReturnMutation,
  useGetPurchaseReturnListQuery,
} from '../api/purchaseReturnEndpoints';
import type { IPurchaseReturnList } from '../types/purchaseReturnTypes';
import CreatePurchaseReturn from '../components/CreatePurchaseReturn';
import ViewPurchaseReturn from '../components/ViewPurchaseReturn';

const PurchaseReturnList = () => {
  const { can_create, can_delete } = useCheckPermission('PURCHASE_RETURN');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetPurchaseReturnListQuery(query);
  const [deletePurchaseReturn, { isLoading: isDeleting }] =
    useDeletePurchaseReturnMutation();

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Tag color='green'>COMPLETED</Tag>;
      case 'APPROVED':
        return <Tag color='blue'>APPROVED</Tag>;
      case 'PENDING':
        return <Tag color='gold'>PENDING</Tag>;
      case 'CANCELLED':
        return <Tag color='red'>CANCELLED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Purchase Return',
            content: <CreatePurchaseReturn />,
            open: true,
            width: 1000,
          }),
        )
      }
      title='Purchase Return List'
      options={{ showButton: can_create }}
      additionalFilter={
        <Space wrap>
          <SelectSupplier
            standalone
            placeholder='Filter by Supplier'
            value={query.supplier_id ? Number(query.supplier_id) : undefined}
            onChange={(val) => setQuery({ supplier_id: val, page: 1 })}
            style={{ width: 180 }}
          />
          <SelectBranch
            standalone
            placeholder='Filter by Branch'
            value={query.branch_id ? Number(query.branch_id) : undefined}
            onChange={(val) => setQuery({ branch_id: val, page: 1 })}
            style={{ width: 160 }}
          />
          <SelectWarehouse
            standalone
            placeholder='Filter by Warehouse'
            value={query.warehouse_id ? Number(query.warehouse_id) : undefined}
            onChange={(val) => setQuery({ warehouse_id: val, page: 1 })}
            style={{ width: 170 }}
          />
          <Select
            placeholder='Return Status'
            allowClear
            value={query.status}
            onChange={(val) => setQuery({ status: val, page: 1 })}
            style={{ width: 150 }}
            options={[
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Cancelled', value: 'CANCELLED' },
            ]}
          />
        </Space>
      }
    >
      <AntTable<IPurchaseReturnList>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'return_number',
            key: 'return_number',
            title: 'Return No',
            width: 140,
            render: (text) => (
              <strong style={{ color: '#0958d9' }}>{text}</strong>
            ),
          },
          {
            dataIndex: 'purchase_number',
            key: 'purchase_number',
            title: 'Invoice No',
            width: 130,
            render: (text) => <strong>{text}</strong>,
          },
          {
            dataIndex: 'return_date',
            key: 'return_date',
            title: 'Return Date',
            width: 130,
            render: (text) => dateAndTimeFormat(text),
          },
          {
            dataIndex: 'supplier_name',
            key: 'supplier_name',
            title: 'Supplier',
            render: (text, record) => (
              <Space direction='vertical' size={0}>
                <strong>{text}</strong>
                {record.supplier_phone && (
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {record.supplier_phone}
                  </span>
                )}
              </Space>
            ),
          },
          {
            dataIndex: 'branch_name',
            key: 'branch_name',
            title: 'Branch',
            width: 120,
            render: (text) => text || 'Central',
          },
          {
            dataIndex: 'warehouse_name',
            key: 'warehouse_name',
            title: 'Warehouse',
            width: 130,
          },
          {
            dataIndex: 'total_amount',
            key: 'total_amount',
            title: 'Return Total (৳)',
            align: 'right',
            width: 130,
            render: (val) => (
              <strong style={{ color: '#ff4d4f' }}>
                ৳{' '}
                {Number(val || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </strong>
            ),
          },
          {
            dataIndex: 'refund_amount',
            key: 'refund_amount',
            title: 'Refund (৳)',
            align: 'right',
            width: 110,
            render: (val) => (
              <span style={{ color: '#52c41a' }}>
                ৳{' '}
                {Number(val || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            ),
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 110,
            render: (status) => getStatusTag(status),
          },
          {
            title: 'Action',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_text, record) => (
              <Space size='small'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Purchase Return',
                        content: <ViewPurchaseReturn id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                {can_delete && (
                  <Popconfirm
                    title='Delete Purchase Return'
                    description='Are you sure you want to delete this purchase return?'
                    onConfirm={() => deletePurchaseReturn(record.id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <DeleteButton loading={isDeleting} />
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default PurchaseReturnList;
