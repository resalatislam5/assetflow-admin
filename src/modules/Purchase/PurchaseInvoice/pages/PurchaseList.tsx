import { Popconfirm, Select, Space, Tag } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { openModal } from '../../../../app/features/modalSlice';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import AntTable from '../../../../common/Table/AntTable';
import ViewButton from '../../../../common/Button/ViewButton';
import EditButton from '../../../../common/Button/EditButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import {
  SelectBranch,
  SelectSupplier,
  SelectWarehouse,
} from '../../../../common/SelectWithApi';
import {
  useDeletePurchaseMutation,
  useGetPurchaseListQuery,
} from '../api/purchaseEndpoints';
import type { IPurchaseList } from '../types/purchaseTypes';
import CreatePurchase from '../components/CreatePurchase';
import UpdatePurchase from '../components/UpdatePurchase';
import ViewPurchase from '../components/ViewPurchase';

const PurchaseList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('PURCHASE');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetPurchaseListQuery(query);
  const [deletePurchase, { isLoading: isDeleting }] =
    useDeletePurchaseMutation();

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Tag color='green'>PAID</Tag>;
      case 'PARTIALLY_PAID':
        return <Tag color='orange'>PARTIAL</Tag>;
      case 'UNPAID':
        return <Tag color='red'>UNPAID</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getOrderStatusTag = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return <Tag color='green'>RECEIVED</Tag>;
      case 'PARTIALLY_RECEIVED':
        return <Tag color='orange'>PARTIAL</Tag>;
      case 'ORDERED':
        return <Tag color='blue'>ORDERED</Tag>;
      case 'PENDING':
        return <Tag color='gold'>PENDING</Tag>;
      case 'CANCELLED':
        return <Tag color='red'>CANCELLED</Tag>;
      case 'RETURNED':
        return <Tag color='purple'>RETURNED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Purchase Invoice',
            content: <CreatePurchase />,
            open: true,
            width: 1000,
          }),
        )
      }
      title='Purchase Invoice List'
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
            placeholder='Order Status'
            allowClear
            value={query.status}
            onChange={(val) => setQuery({ status: val, page: 1 })}
            style={{ width: 140 }}
            options={[
              { label: 'Received', value: 'RECEIVED' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Ordered', value: 'ORDERED' },
              { label: 'Partially Received', value: 'PARTIALLY_RECEIVED' },
              { label: 'Cancelled', value: 'CANCELLED' },
              { label: 'Returned', value: 'RETURNED' },
            ]}
          />
          <Select
            placeholder='Payment Status'
            allowClear
            value={query.payment_status}
            onChange={(val) => setQuery({ payment_status: val, page: 1 })}
            style={{ width: 140 }}
            options={[
              { label: 'Paid', value: 'PAID' },
              { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
              { label: 'Unpaid', value: 'UNPAID' },
            ]}
          />
        </Space>
      }
    >
      <AntTable<IPurchaseList>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'purchase_number',
            key: 'purchase_number',
            title: 'Invoice No',
            width: 140,
            render: (text) => (
              <strong style={{ color: '#0958d9' }}>{text}</strong>
            ),
          },
          {
            dataIndex: 'purchase_date',
            key: 'purchase_date',
            title: 'Purchase Date',
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
                {record.supplier_company && (
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {record.supplier_company}
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
            dataIndex: 'grand_total',
            key: 'grand_total',
            title: 'Total (৳)',
            align: 'right',
            width: 120,
            render: (val, record) => {
              const amount = val !== undefined ? val : record.grand_total_amount;
              return Number(amount || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              });
            },
          },
          {
            dataIndex: 'paid_amount',
            key: 'paid_amount',
            title: 'Paid (৳)',
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
            dataIndex: 'due_amount',
            key: 'due_amount',
            title: 'Due (৳)',
            align: 'right',
            width: 120,
            render: (val) => {
              const due = Number(val || 0);
              return (
                <strong style={{ color: due > 0 ? '#ff4d4f' : '#52c41a' }}>
                  ৳ {due.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
              );
            },
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Order Status',
            width: 110,
            render: (status) => getOrderStatusTag(status),
          },
          {
            dataIndex: 'payment_status',
            key: 'payment_status',
            title: 'Payment',
            width: 100,
            render: (status) => getPaymentStatusTag(status),
          },
          {
            title: 'Action',
            key: 'action',
            width: 140,
            align: 'center',
            render: (_text, record) => (
              <Space size='small'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Purchase Invoice',
                        content: <ViewPurchase id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                {can_update && (
                  <EditButton
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: 'Update Purchase Invoice',
                          content: <UpdatePurchase id={record.id} />,
                          open: true,
                          width: 1000,
                        }),
                      )
                    }
                  />
                )}
                {can_delete && (
                  <Popconfirm
                    title='Delete Purchase'
                    description='Are you sure you want to delete this purchase invoice?'
                    onConfirm={() => deletePurchase(record.id)}
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

export default PurchaseList;
