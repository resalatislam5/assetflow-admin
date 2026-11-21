import { Button, Select, Space, Tag, Tooltip, Typography, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { openModal } from '../../../app/features/modalSlice';
import useCheckPermission from '../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../layout/components/ContainerLayout';
import AntTable from '../../../common/Table/AntTable';
import ViewButton from '../../../common/Button/ViewButton';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import { useGetPaymentListQuery } from '../api/paymentEndpoints';
import type {
  IPaymentItem,
  IPaymentQuery,
  PaymentMethod,
  PaymentStatus,
} from '../types/paymentTypes';
import CreatePaymentModal from '../components/CreatePaymentModal';
import ViewPaymentDrawer from '../components/ViewPaymentDrawer';
import UpdatePaymentStatusModal from '../components/UpdatePaymentStatusModal';
import CreateRefundModal from '../components/CreateRefundModal';
import PaymentSummaryCards from '../components/PaymentSummaryCards';

const { Text } = Typography;

const METHOD_FILTER_OPTIONS: { label: string; value: PaymentMethod }[] = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Card', value: 'CARD' },
  { label: 'Mobile Banking', value: 'MOBILE_BANKING' },
  { label: 'Gateway', value: 'GATEWAY' },
  { label: 'Loyalty Points', value: 'LOYALTY_POINTS' },
  { label: 'Other', value: 'OTHER' },
];

const STATUS_FILTER_OPTIONS: { label: string; value: PaymentStatus }[] = [
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Successful', value: 'SUCCESSFUL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Authorized', value: 'AUTHORIZED' },
  { label: 'Refunded', value: 'REFUNDED' },
  { label: 'Partially Refunded', value: 'PARTIALLY_REFUNDED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Expired', value: 'EXPIRED' },
];

const PaymentList = () => {
  const { token } = theme.useToken();
  const { can_create, can_update } = useCheckPermission('PAYMENT');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IPaymentQuery>();

  const { data, isLoading, isFetching } = useGetPaymentListQuery(query);

  const getMethodTag = (method: PaymentMethod, gateway?: string | null) => {
    switch (method) {
      case 'CASH':
        return <Tag color='blue'>CASH</Tag>;
      case 'CARD':
        return <Tag color='cyan'>CARD</Tag>;
      case 'MOBILE_BANKING':
        return (
          <Tag color='magenta'>
            {gateway ? `MOBILE (${gateway})` : 'MOBILE BANKING'}
          </Tag>
        );
      case 'GATEWAY':
        return (
          <Tag color='purple'>
            {gateway ? `GATEWAY (${gateway})` : 'GATEWAY'}
          </Tag>
        );
      case 'LOYALTY_POINTS':
        return <Tag color='gold'>POINTS</Tag>;
      default:
        return <Tag>{method}</Tag>;
    }
  };

  const getStatusTag = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCESSFUL':
        return <Tag color='green'>{status}</Tag>;
      case 'PENDING':
      case 'AUTHORIZED':
        return <Tag color='orange'>{status}</Tag>;
      case 'REFUNDED':
        return <Tag color='purple'>{status}</Tag>;
      case 'PARTIALLY_REFUNDED':
        return <Tag color='geekblue'>{status}</Tag>;
      case 'FAILED':
      case 'CANCELLED':
      case 'EXPIRED':
        return <Tag color='red'>{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns: TableColumnsType<IPaymentItem> = useMemo(
    () => [
      {
        title: 'Transaction Ref #',
        dataIndex: 'transaction_ref',
        key: 'transaction_ref',
        width: 170,
        render: (text: string, record) => (
          <Space direction='vertical' size={0}>
            <Text strong style={{ color: token.colorPrimary }}>
              {text}
            </Text>
            {record.gateway_trx_id && (
              <Text type='secondary' style={{ fontSize: 11 }}>
                Trx: {record.gateway_trx_id}
              </Text>
            )}
          </Space>
        ),
      },
      {
        title: 'Paid Date',
        dataIndex: 'paid_at',
        key: 'paid_at',
        width: 150,
        render: (text: string) => dateAndTimeFormat(text, 'DD MMM YYYY, hh:mm A') || '—',
      },
      {
        title: 'Invoice / Customer',
        dataIndex: 'invoice_number',
        key: 'invoice_number',
        width: 200,
        render: (invNum: string, record) => (
          <Space direction='vertical' size={0}>
            <Text strong>{invNum || `INV-${record.invoice_id}`}</Text>
            <Text type='secondary' style={{ fontSize: 12 }}>
              {record.customer_name || 'Walk-in Customer'}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Method',
        dataIndex: 'payment_method',
        key: 'payment_method',
        width: 140,
        render: (method: PaymentMethod, record) =>
          getMethodTag(method, record.gateway),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 130,
        align: 'right',
        render: (amount: number) => (
          <Text strong style={{ color: token.colorSuccess }}>
            ৳{Number(amount).toFixed(2)}
          </Text>
        ),
      },
      {
        title: 'Fee / Net',
        key: 'fee_net',
        width: 140,
        align: 'right',
        render: (_, record) => (
          <Space direction='vertical' size={0} style={{ width: '100%' }}>
            <Text style={{ fontSize: 12 }}>
              Net: ৳{Number(record.net_amount || record.amount).toFixed(2)}
            </Text>
            {Number(record.gateway_fee || 0) > 0 && (
              <Text type='secondary' style={{ fontSize: 11, color: token.colorWarning }}>
                Fee: ৳{Number(record.gateway_fee).toFixed(2)}
              </Text>
            )}
          </Space>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 130,
        align: 'center',
        render: (status: PaymentStatus) => getStatusTag(status),
      },
      {
        title: 'Account / Branch',
        key: 'account_branch',
        width: 170,
        render: (_, record) => (
          <Space direction='vertical' size={0}>
            <Text style={{ fontSize: 12 }}>
              {record.account_name || 'Default Account'}
            </Text>
            <Text type='secondary' style={{ fontSize: 11 }}>
              {record.branch_name || 'Central Head Office'}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 140,
        align: 'center',
        fixed: 'right',
        render: (_, record) => {
          const isEligibleForRefund =
            (record.status === 'COMPLETED' || record.status === 'SUCCESSFUL') &&
            Math.max(0, Number(record.amount || 0) - Number(record.refunded_amount || 0)) > 0;

          return (
            <Space size='small'>
              <ViewButton
                onClick={() =>
                  dispatch(
                    openModal({
                      title: 'Payment Transaction Details',
                      content: <ViewPaymentDrawer id={record.id} />,
                      open: true,
                      width: 800,
                    }),
                  )
                }
              />

              {can_update && (
                <Tooltip title='Update Payment Status'>
                  <Button
                    size='small'
                    icon={<Icon icon='solar:pen-bold' />}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: 'Update Payment Status',
                          content: (
                            <UpdatePaymentStatusModal
                              id={record.id}
                              currentStatus={record.status}
                              currentNotes={record.notes}
                            />
                          ),
                          open: true,
                          width: 500,
                        }),
                      )
                    }
                  />
                </Tooltip>
              )}

              {can_create && isEligibleForRefund && (
                <Tooltip title='Issue Refund'>
                  <Button
                    size='small'
                    danger
                    icon={<Icon icon='solar:restart-bold' />}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: 'Issue Transaction Refund',
                          content: <CreateRefundModal payment={record} />,
                          open: true,
                          width: 700,
                        }),
                      )
                    }
                  />
                </Tooltip>
              )}
            </Space>
          );
        },
      },
    ],
    [token, can_create, can_update, dispatch],
  );

  return (
    <ContainerLayout
      title='Payment Transactions'
      buttonText={can_create ? 'Record Payment' : undefined}
      options={{ showButton: can_create }}
      onClick={() =>
        dispatch(
          openModal({
            title: 'Record Payment Transaction',
            content: <CreatePaymentModal />,
            open: true,
            width: 700,
          }),
        )
      }
      additionalFilter={
        <Space wrap>
          <Select
            placeholder='Filter by Method'
            allowClear
            value={query.payment_method || undefined}
            onChange={(val) =>
              setQuery({ payment_method: val || undefined, page: 1 })
            }
            options={METHOD_FILTER_OPTIONS}
            style={{ width: 170 }}
          />
          <Select
            placeholder='Filter by Status'
            allowClear
            value={query.status || undefined}
            onChange={(val) => setQuery({ status: val || undefined, page: 1 })}
            options={STATUS_FILTER_OPTIONS}
            style={{ width: 170 }}
          />
        </Space>
      }
    >
      <PaymentSummaryCards />
      <AntTable
        columns={columns}
        dataSource={data?.data || []}
        loading={isLoading || isFetching}
        total={data?.total}
        rowKey='id'
      />
    </ContainerLayout>
  );
};

export default PaymentList;
