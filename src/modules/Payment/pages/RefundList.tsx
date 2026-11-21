import { Select, Space, Tag, Typography, theme } from 'antd';
import type { TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { openModal } from '../../../app/features/modalSlice';
import useCheckPermission from '../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../layout/components/ContainerLayout';
import AntTable from '../../../common/Table/AntTable';
import ViewButton from '../../../common/Button/ViewButton';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import { useGetRefundListQuery } from '../api/paymentEndpoints';
import type {
  IRefundItem,
  IRefundQuery,
  RefundStatus,
  RefundType,
} from '../types/paymentTypes';
import ViewRefundDrawer from '../components/ViewRefundDrawer';

const { Text } = Typography;

const REFUND_TYPE_OPTIONS: { label: string; value: RefundType }[] = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Card', value: 'CARD' },
  { label: 'Mobile Banking', value: 'MOBILE_BANKING' },
  { label: 'Gateway', value: 'GATEWAY' },
  { label: 'Store Credit', value: 'STORE_CREDIT' },
];

const REFUND_STATUS_OPTIONS: { label: string; value: RefundStatus }[] = [
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Processed', value: 'PROCESSED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const RefundList = () => {
  const { token } = theme.useToken();
  useCheckPermission('REFUND');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IRefundQuery>();

  const { data, isLoading, isFetching } = useGetRefundListQuery(query);

  const getRefundTypeTag = (type: RefundType) => {
    switch (type) {
      case 'CASH':
        return <Tag color='blue'>CASH</Tag>;
      case 'CARD':
        return <Tag color='cyan'>CARD</Tag>;
      case 'MOBILE_BANKING':
        return <Tag color='magenta'>MOBILE BANKING</Tag>;
      case 'GATEWAY':
        return <Tag color='purple'>GATEWAY</Tag>;
      case 'STORE_CREDIT':
        return <Tag color='gold'>STORE CREDIT</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  const getRefundStatusTag = (status: RefundStatus) => {
    switch (status) {
      case 'COMPLETED':
      case 'PROCESSED':
        return <Tag color='green'>{status}</Tag>;
      case 'APPROVED':
        return <Tag color='blue'>{status}</Tag>;
      case 'PENDING':
        return <Tag color='orange'>{status}</Tag>;
      case 'FAILED':
      case 'REJECTED':
        return <Tag color='red'>{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns: TableColumnsType<IRefundItem> = useMemo(
    () => [
      {
        title: 'Refund Voucher #',
        dataIndex: 'refund_no',
        key: 'refund_no',
        width: 170,
        render: (text: string) => (
          <Text strong style={{ color: token.colorPrimary }}>
            {text}
          </Text>
        ),
      },
      {
        title: 'Processed Date',
        dataIndex: 'processed_at',
        key: 'processed_at',
        width: 150,
        render: (text: string) =>
          dateAndTimeFormat(text, 'DD MMM YYYY, hh:mm A') || '—',
      },
      {
        title: 'Original Payment',
        dataIndex: 'payment_transaction_ref',
        key: 'payment_transaction_ref',
        width: 160,
        render: (ref: string, record) => (
          <Space direction='vertical' size={0}>
            <Text strong>{ref || `TRX-${record.payment_id}`}</Text>
            <Text type='secondary' style={{ fontSize: 11 }}>
              via {record.payment_method || 'Payment'}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Invoice / Customer',
        key: 'invoice_customer',
        width: 180,
        render: (_, record) => (
          <Space direction='vertical' size={0}>
            <Text strong>{record.invoice_number || `INV-${record.invoice_id}`}</Text>
            <Text type='secondary' style={{ fontSize: 12 }}>
              {record.customer_name || 'Customer'}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Mechanism',
        dataIndex: 'refund_type',
        key: 'refund_type',
        width: 140,
        render: (type: RefundType) => getRefundTypeTag(type),
      },
      {
        title: 'Refund Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 130,
        align: 'right',
        render: (amount: number) => (
          <Text strong style={{ color: token.colorError }}>
            ৳{Number(amount).toFixed(2)}
          </Text>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        align: 'center',
        render: (status: RefundStatus) => getRefundStatusTag(status),
      },
      {
        title: 'Disbursed Account',
        dataIndex: 'account_name',
        key: 'account_name',
        width: 160,
        render: (accName: string, record) => (
          <Space direction='vertical' size={0}>
            <Text style={{ fontSize: 12 }}>{accName || 'Default Account'}</Text>
            <Text type='secondary' style={{ fontSize: 11 }}>
              {record.branch_name || 'Central Head Office'}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        ellipsis: true,
        width: 180,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <ViewButton
            onClick={() =>
              dispatch(
                openModal({
                  title: 'Refund Voucher Details',
                  content: <ViewRefundDrawer id={record.id} />,
                  open: true,
                  width: 700,
                }),
              )
            }
          />
        ),
      },
    ],
    [token, dispatch],
  );

  return (
    <ContainerLayout
      title='Payment Refunds'
      additionalFilter={
        <Space wrap>
          <Select
            placeholder='Filter by Mechanism'
            allowClear
            value={query.refund_type || undefined}
            onChange={(val) => setQuery({ refund_type: val || undefined, page: 1 })}
            options={REFUND_TYPE_OPTIONS}
            style={{ width: 170 }}
          />
          <Select
            placeholder='Filter by Status'
            allowClear
            value={query.status || undefined}
            onChange={(val) => setQuery({ status: val || undefined, page: 1 })}
            options={REFUND_STATUS_OPTIONS}
            style={{ width: 170 }}
          />
        </Space>
      }
    >
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

export default RefundList;
