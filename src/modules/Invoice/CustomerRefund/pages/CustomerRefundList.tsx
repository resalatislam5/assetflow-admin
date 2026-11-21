import { Popconfirm, Select, Space, Tag, Typography, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { openModal } from '../../../../app/features/modalSlice';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import AntTable from '../../../../common/Table/AntTable';
import ViewButton from '../../../../common/Button/ViewButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import {
  SelectAccount,
  SelectBranch,
  SelectCustomer,
  SelectOrder,
} from '../../../../common/SelectWithApi';
import {
  useDeleteCustomerRefundMutation,
  useGetCustomerRefundListQuery,
} from '../api/customerRefundEndpoints';
import type {
  CustomerRefundPaymentType,
  CustomerRefundReason,
  ICustomerRefundListItem,
  ICustomerRefundQuery,
} from '../types/customerRefundTypes';
import CreateCustomerRefund from '../components/CreateCustomerRefund';
import ViewCustomerRefund from '../components/ViewCustomerRefund';
import dayjs from 'dayjs';

const { Text } = Typography;

const CustomerRefundList = () => {
  const { token } = theme.useToken();
  const { can_create, can_delete } = useCheckPermission('ORDER');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<ICustomerRefundQuery>();

  const { data, isLoading, isFetching } = useGetCustomerRefundListQuery(query);
  const [deleteRefund] = useDeleteCustomerRefundMutation();

  const handleDelete = async (id: number | string) => {
    await deleteRefund(id);
  };

  const getPaymentTypeTag = (type: CustomerRefundPaymentType) => {
    switch (type) {
      case 'CASH':
        return <Tag color='green'>CASH</Tag>;
      case 'BANK':
        return <Tag color='blue'>BANK</Tag>;
      case 'MOBILE_BANKING':
        return <Tag color='purple'>MOBILE BANKING</Tag>;
      case 'CARD':
        return <Tag color='cyan'>CARD</Tag>;
      case 'CHEQUE':
        return <Tag color='orange'>CHEQUE</Tag>;
      case 'OTHER':
        return <Tag color='default'>OTHER</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  const getReasonTag = (reason: CustomerRefundReason) => {
    switch (reason) {
      case 'ORDER_CANCELLED':
        return <Tag color='red'>CANCELLED</Tag>;
      case 'ORDER_RETURN':
        return <Tag color='orange'>RETURN</Tag>;
      case 'OVERPAYMENT':
        return <Tag color='cyan'>OVERPAYMENT</Tag>;
      case 'PRODUCT_UNAVAILABLE':
        return <Tag color='volcano'>UNAVAILABLE</Tag>;
      default:
        return <Tag>{reason}</Tag>;
    }
  };

  const columns: TableColumnsType<ICustomerRefundListItem> = useMemo(
    () => [
      {
        title: 'Refund Voucher #',
        dataIndex: 'refund_number',
        key: 'refund_number',
        width: 160,
        render: (val: string, record: ICustomerRefundListItem) => (
          <Space direction='vertical' size={2}>
            <Text
              strong
              style={{ color: token.colorPrimary, cursor: 'pointer' }}
              onClick={() =>
                dispatch(
                  openModal({
                    title: `Refund Voucher: ${record.refund_number}`,
                    content: <ViewCustomerRefund record={record} />,
                    open: true,
                    width: 700,
                  }),
                )
              }
            >
              {val}
            </Text>
            <Text type='secondary' style={{ fontSize: 11 }}>
              {dayjs(record.refund_date).format('DD MMM YYYY')}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Customer',
        key: 'customer',
        width: 180,
        render: (_, record) => (
          <Space direction='vertical' size={2}>
            <Text strong>{record.customer_name || 'N/A'}</Text>
            {record.customer_phone && (
              <Text type='secondary' style={{ fontSize: 12 }}>
                {record.customer_phone}
              </Text>
            )}
          </Space>
        ),
      },
      {
        title: 'Branch',
        dataIndex: 'branch_name',
        key: 'branch_name',
        width: 140,
        render: (name?: string) => name || '—',
      },
      {
        title: 'Invoice / Return',
        key: 'order_return',
        width: 150,
        render: (_, record) => {
          const num = record.invoice_number || record.order_number;
          return (
            <Space direction='vertical' size={2}>
              {num ? (
                <Text style={{ fontSize: 12 }}>
                  Invoice: <Text strong>{num}</Text>
                </Text>
              ) : (
                <Text type='secondary' style={{ fontSize: 12 }}>
                  Direct Advance
                </Text>
              )}
              {record.return_number && (
                <Text type='secondary' style={{ fontSize: 11 }}>
                  Ret: {record.return_number}
                </Text>
              )}
            </Space>
          );
        },
      },
      {
        title: 'Account & Method',
        key: 'account',
        width: 170,
        render: (_, record) => (
          <Space direction='vertical' size={2}>
            <Text>{record.account_name}</Text>
            {getPaymentTypeTag(record.payment_type)}
          </Space>
        ),
      },
      {
        title: 'Reason',
        dataIndex: 'refund_reason',
        key: 'refund_reason',
        width: 130,
        render: (reason: CustomerRefundReason) => getReasonTag(reason),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: string) => (
          <Tag color={status === 'COMPLETED' ? 'green' : 'orange'}>{status}</Tag>
        ),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: 130,
        render: (val: number, record: ICustomerRefundListItem) => (
          <Space direction='vertical' size={0} style={{ textAlign: 'right', width: '100%' }}>
            <Text strong style={{ color: '#52c41a' }}>
              ৳{Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
            {Number(record.charge_amount || 0) > 0 && (
              <Text type='secondary' style={{ fontSize: 11 }}>
                Fee: ৳{Number(record.charge_amount).toLocaleString()}
              </Text>
            )}
          </Space>
        ),
      },
      {
        title: 'Net Outflow',
        dataIndex: 'net_amount',
        key: 'net_amount',
        align: 'right',
        width: 130,
        render: (val: number) => (
          <Text strong style={{ color: '#f5222d' }}>
            ৳{Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        ),
      },
      {
        title: 'Processed By',
        dataIndex: 'created_by_name',
        key: 'created_by_name',
        width: 130,
        render: (name?: string) => name || 'System',
      },
      {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 90,
        align: 'center',
        render: (_, record) => (
          <Space size='small'>
            <ViewButton
              onClick={() =>
                dispatch(
                  openModal({
                    title: `Refund Voucher: ${record.refund_number}`,
                    content: <ViewCustomerRefund record={record} />,
                    open: true,
                    width: 700,
                  }),
                )
              }
            />
            {can_delete && (
              <Popconfirm
                title='Void Customer Refund'
                description='Are you sure you want to void this customer refund?'
                onConfirm={() => handleDelete(record.id)}
                okText='Yes, Void'
                cancelText='No'
                okButtonProps={{ danger: true }}
              >
                <DeleteButton />
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ],
    [can_delete, dispatch, token],
  );

  return (
    <ContainerLayout
      title='Customer Refunds'
      options={{ showButton: can_create }}
      onClick={() =>
        dispatch(
          openModal({
            title: 'Issue Customer Refund',
            content: <CreateCustomerRefund />,
            open: true,
            width: 1000,
          }),
        )
      }
      additionalFilter={
        <Space wrap>
          <SelectBranch
            standalone
            placeholder='Filter by Branch'
            value={query.branch_id ? Number(query.branch_id) : undefined}
            onChange={(val) => setQuery({ branch_id: val, page: 1 })}
            style={{ width: 180 }}
          />
          <SelectCustomer
            standalone
            placeholder='Filter by Customer'
            value={query.customer_id ? Number(query.customer_id) : undefined}
            onChange={(val) => setQuery({ customer_id: val, page: 1 })}
            style={{ width: 180 }}
          />
          <SelectOrder
            standalone
            placeholder='Filter by Order'
            value={query.order_id ? Number(query.order_id) : undefined}
            onChange={(val) => setQuery({ order_id: val, page: 1 })}
            style={{ width: 180 }}
          />
          <SelectAccount
            standalone
            placeholder='Filter by Account'
            value={query.account_id ? Number(query.account_id) : undefined}
            onChange={(val) => setQuery({ account_id: val, page: 1 })}
            style={{ width: 180 }}
          />
          <Select
            placeholder='Payment Method'
            allowClear
            value={query.payment_type || undefined}
            onChange={(val) =>
              setQuery({ payment_type: val || undefined, page: 1 })
            }
            style={{ width: 170 }}
            options={[
              { label: 'Cash', value: 'CASH' },
              { label: 'Bank Transfer', value: 'BANK' },
              { label: 'Mobile Banking', value: 'MOBILE_BANKING' },
              { label: 'Card Payment', value: 'CARD' },
              { label: 'Cheque', value: 'CHEQUE' },
              { label: 'Other', value: 'OTHER' },
            ]}
          />
        </Space>
      }
    >
      <AntTable<ICustomerRefundListItem>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        scroll={{ x: 'max-content' }}
        columns={columns}
      />
    </ContainerLayout>
  );
};

export default CustomerRefundList;
