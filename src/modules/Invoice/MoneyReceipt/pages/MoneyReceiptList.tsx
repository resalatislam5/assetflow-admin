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
import { SelectAccount, SelectBranch, SelectOrder } from '../../../../common/SelectWithApi';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import {
  useDeleteMoneyReceiptMutation,
  useGetMoneyReceiptListQuery,
} from '../api/moneyReceiptEndpoints';
import type {
  IMoneyReceiptList,
  IMoneyReceiptQuery,
  MoneyReceiptPaymentType,
} from '../types/moneyReceiptTypes';
import CreateMoneyReceipt from '../components/CreateMoneyReceipt';
import ViewMoneyReceipt from '../components/ViewMoneyReceipt';

const { Text } = Typography;

const MoneyReceiptList = () => {
  const { token } = theme.useToken();
  const { can_create, can_delete } = useCheckPermission('ORDER');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IMoneyReceiptQuery>();

  const { data, isLoading, isFetching } = useGetMoneyReceiptListQuery(query);
  const [deleteReceipt] = useDeleteMoneyReceiptMutation();

  const handleDelete = async (id: number | string) => {
    await deleteReceipt(id);
  };

  const getPaymentTypeTag = (type: MoneyReceiptPaymentType) => {
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

  const columns: TableColumnsType<IMoneyReceiptList> = useMemo(
    () => [
      {
        title: 'Receipt #',
        dataIndex: 'receipt_number',
        key: 'receipt_number',
        width: 150,
        render: (text: string) => (
          <Text strong style={{ color: token.colorPrimary }}>
            {text}
          </Text>
        ),
      },
      {
        title: 'Receipt Date',
        dataIndex: 'payment_date',
        key: 'payment_date',
        width: 130,
        render: (text: string) => dateAndTimeFormat(text, 'DD MMM YYYY') || '—',
      },
      {
        title: 'Branch',
        dataIndex: 'branch_name',
        key: 'branch_name',
        width: 140,
        render: (name?: string) => name || '—',
      },
      {
        title: 'Invoice #',
        dataIndex: 'invoice_number',
        key: 'invoice_number',
        width: 170,
        render: (_: string, record) => {
          const num = record.invoice_number || record.order_number;
          const total = record.invoice_grand_total ?? record.order_grand_total ?? 0;
          return (
            <Space direction='vertical' size={0}>
              <Text strong style={{ color: token.colorPrimary }}>
                {num}
              </Text>
              <Text type='secondary' style={{ fontSize: 11 }}>
                Total: ৳{Number(total).toLocaleString()}
              </Text>
            </Space>
          );
        },
      },
      {
        title: 'Customer',
        key: 'customer',
        render: (_, record) => (
          <div>
            <Text strong style={{ color: token.colorTextHeading }}>
              {record.customer_name || 'Guest Customer'}
            </Text>
            <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
              {record.customer_phone && <span>{record.customer_phone}</span>}
              {record.customer_phone && record.customer_email && <span> &bull; </span>}
              {record.customer_email && <span>{record.customer_email}</span>}
            </div>
          </div>
        ),
      },
      {
        title: 'Payment Method',
        dataIndex: 'payment_type',
        key: 'payment_type',
        width: 150,
        render: (type: MoneyReceiptPaymentType) => getPaymentTypeTag(type),
      },
      {
        title: 'Deposit Account',
        key: 'account',
        render: (_, record) => (
          <div>
            <Text strong>{record.account_name}</Text>
            {record.account_number && (
              <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                {record.account_number}
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Received Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: 140,
        render: (val: number, record) => (
          <Space direction='vertical' size={0} style={{ textAlign: 'right', width: '100%' }}>
            <Text strong style={{ color: token.colorPrimary }}>
              ৳{Number(val || 0).toLocaleString()}
            </Text>
            {Number(record.charge_amount) > 0 && (
              <Text type='secondary' style={{ fontSize: 11, color: token.colorError }}>
                Fee: -৳{Number(record.charge_amount).toLocaleString()}
              </Text>
            )}
          </Space>
        ),
      },
      {
        title: 'Net Deposited',
        dataIndex: 'net_amount',
        key: 'net_amount',
        align: 'right',
        width: 130,
        render: (val: number) => (
          <Text strong style={{ color: token.colorSuccess }}>
            ৳{Number(val || 0).toLocaleString()}
          </Text>
        ),
      },
      {
        title: 'Reference',
        dataIndex: 'reference',
        key: 'reference',
        width: 130,
        render: (text?: string) => text || '—',
      },
      {
        title: 'Created By',
        dataIndex: 'created_by_name',
        key: 'created_by_name',
        width: 120,
        render: (name?: string) => name || 'System',
      },
      {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <Space size='small'>
            <ViewButton
              onClick={() =>
                dispatch(
                  openModal({
                    title: `Money Receipt: ${record.receipt_number}`,
                    content: <ViewMoneyReceipt record={record} />,
                    open: true,
                    width: 700,
                  }),
                )
              }
            />
            {can_delete && (
              <Popconfirm
                title='Void Money Receipt'
                description='Are you sure you want to void this money receipt? Order paid balance and accounting entries will be reverted.'
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
    [token, can_delete, dispatch],
  );

  return (
    <ContainerLayout
      title='Money Receipts'
      buttonText={can_create ? 'Create Money Receipt' : undefined}
      options={{ showButton: can_create }}
      onClick={() =>
        dispatch(
          openModal({
            title: 'Record Money Receipt',
            content: <CreateMoneyReceipt />,
            open: true,
            width: 700,
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
            style={{ width: 200 }}
          />
          <SelectOrder
            standalone
            placeholder='Filter by Order'
            allowClear
            value={query.order_id ? Number(query.order_id) : undefined}
            onChange={(val) => setQuery({ order_id: val ? Number(val) : undefined, page: 1 })}
            style={{ width: 220 }}
          />
          <Select
            placeholder='Filter by Type'
            allowClear
            value={query.payment_type || undefined}
            onChange={(val) => setQuery({ payment_type: val || undefined, page: 1 })}
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
          <SelectAccount
            standalone
            placeholder='Filter by Account'
            value={query.account_id ? Number(query.account_id) : undefined}
            onChange={(val) => setQuery({ account_id: val, page: 1 })}
            style={{ width: 200 }}
          />
        </Space>
      }
    >
      <AntTable<IMoneyReceiptList>
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

export default MoneyReceiptList;
