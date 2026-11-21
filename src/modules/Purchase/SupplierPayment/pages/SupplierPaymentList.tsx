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
  SelectAccount,
  SelectBranch,
  SelectSupplier,
} from '../../../../common/SelectWithApi';
import {
  useDeleteSupplierPaymentMutation,
  useGetSupplierPaymentListQuery,
} from '../api/supplierPaymentEndpoints';
import type { ISupplierPaymentList } from '../types/supplierPaymentTypes';
import CreateSupplierPayment from '../components/CreateSupplierPayment';
import ViewSupplierPayment from '../components/ViewSupplierPayment';

const SupplierPaymentList = () => {
  const { can_create, can_delete } = useCheckPermission('SUPPLIER_PAYMENT');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetSupplierPaymentListQuery(query);
  const [deletePayment, { isLoading: isDeleting }] =
    useDeleteSupplierPaymentMutation();

  const getMethodTag = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Tag color='green'>CASH</Tag>;
      case 'BANK':
        return <Tag color='blue'>BANK</Tag>;
      case 'MOBILE_BANKING':
        return <Tag color='magenta'>MFS</Tag>;
      case 'CHEQUE':
        return <Tag color='orange'>CHEQUE</Tag>;
      default:
        return <Tag>{method || 'OTHER'}</Tag>;
    }
  };

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Disburse Supplier Payment',
            content: <CreateSupplierPayment />,
            open: true,
            width: 700,
          }),
        )
      }
      title='Supplier Payment Disbursals'
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
            value={query.payment_method}
            onChange={(val) => setQuery({ payment_method: val, page: 1 })}
            style={{ width: 160 }}
            options={[
              { label: 'Cash', value: 'CASH' },
              { label: 'Bank Transfer', value: 'BANK' },
              { label: 'Mobile Banking', value: 'MOBILE_BANKING' },
              { label: 'Cheque', value: 'CHEQUE' },
              { label: 'Other', value: 'OTHER' },
            ]}
          />
        </Space>
      }
    >
      <AntTable<ISupplierPaymentList>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'payment_number',
            key: 'payment_number',
            title: 'Voucher No',
            width: 140,
            render: (text) => (
              <strong style={{ color: '#0958d9' }}>{text}</strong>
            ),
          },
          {
            dataIndex: 'payment_date',
            key: 'payment_date',
            title: 'Payment Date',
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
            dataIndex: 'account_name',
            key: 'account_name',
            title: 'Paid From Account',
            render: (text, record) => (
              <Space direction='vertical' size={0}>
                <strong>{text}</strong>
                <span style={{ fontSize: 12, color: '#888' }}>
                  {record.account_type}
                </span>
              </Space>
            ),
          },
          {
            dataIndex: 'payment_method',
            key: 'payment_method',
            title: 'Method',
            width: 110,
            render: (method) => getMethodTag(method),
          },
          {
            dataIndex: 'amount',
            key: 'amount',
            title: 'Disbursed (৳)',
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
            dataIndex: 'reference',
            key: 'reference',
            title: 'Reference',
            width: 140,
            render: (text) => text || '-',
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
                        title: 'View Payment Voucher',
                        content: <ViewSupplierPayment id={record.id} />,
                        open: true,
                        width: 700,
                      }),
                    )
                  }
                />
                {can_delete && (
                  <Popconfirm
                    title='Delete Payment'
                    description='Are you sure you want to delete this payment voucher?'
                    onConfirm={() => deletePayment(record.id)}
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

export default SupplierPaymentList;
