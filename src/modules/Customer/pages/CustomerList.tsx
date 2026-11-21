import { Space, Tag, Typography } from 'antd';
import { openModal } from '../../../app/features/modalSlice';
import { useAppDispatch } from '../../../app/hooks/hooks';
import AntTable from '../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import { ImagePreview } from '../../../common/components/Image';
import DeleteButton from '../../../common/Button/DeleteButton';
import EditButton from '../../../common/Button/EditButton';
import ViewButton from '../../../common/Button/ViewButton';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../layout/components/ContainerLayout';
import useCheckPermission from '../../../common/hooks/useCheckPermission';
import {
  useDeleteCustomerMutation,
  useGetCustomerListQuery,
} from '../api/customerEndpoints';
import CreateCustomer from '../components/CreateCustomer';
import UpdateCustomer from '../components/UpdateCustomer';
import ViewCustomer from '../components/ViewCustomer';
import type { ICustomerList } from '../types/customerTypes';

const CustomerList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('CUSTOMER');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetCustomerListQuery(query);
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'orange';
      case 'BANNED':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CORPORATE':
        return 'purple';
      case 'WHOLESALE':
        return 'blue';
      case 'WALK_IN':
        return 'cyan';
      default:
        return 'geekblue';
    }
  };

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Customer',
            content: <CreateCustomer />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Customer List'
      options={{ showButton: can_create }}
    >
      <AntTable<ICustomerList>
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            dataIndex: 'avatar',
            key: 'avatar',
            title: 'Avatar',
            width: 70,
            render: (avatar: string) => (
              <ImagePreview src={avatar} width={42} height={42} />
            ),
          },
          {
            dataIndex: 'customer_code',
            key: 'customer_code',
            title: 'Customer Code',
            width: 140,
            render: (code: string) => (
              <Tag color='blue' style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {code || '—'}
              </Tag>
            ),
          },
          {
            dataIndex: 'customer_type',
            key: 'customer_type',
            title: 'Type',
            width: 110,
            render: (type: string) => (
              <Tag color={getTypeColor(type)}>{type || 'RETAIL'}</Tag>
            ),
          },
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Customer Name',
            render: (_, record: ICustomerList) => (
              <div>
                <Typography.Text strong>
                  {record.first_name} {record.last_name || ''}
                </Typography.Text>
                {record.company_name && (
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    {record.company_name}
                  </div>
                )}
              </div>
            ),
          },
          {
            dataIndex: 'branch_name',
            key: 'branch_name',
            title: 'Branch',
            width: 140,
            render: (branchName?: string) =>
              branchName ? (
                <Tag color='cyan'>{branchName}</Tag>
              ) : (
                <Tag>Global</Tag>
              ),
          },
          {
            dataIndex: 'phone',
            key: 'phone',
            title: 'Phone',
            render: (phone: string) => phone || '—',
          },
          {
            dataIndex: 'email',
            key: 'email',
            title: 'Email',
            render: (email: string) => email || '—',
          },
          {
            dataIndex: 'current_balance',
            key: 'current_balance',
            title: 'Balance',
            width: 130,
            render: (bal: number) => {
              const num = Number(bal || 0);
              return (
                <Typography.Text style={{ color: num > 0 ? '#cf1322' : '#389e0d', fontWeight: 600 }}>
                  ৳{num.toFixed(2)}
                </Typography.Text>
              );
            },
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 100,
            render: (status: 'ACTIVE' | 'INACTIVE' | 'BANNED') => (
              <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
          },
          {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Registered At',
            width: 160,
            render: (text: string) => (text ? dateAndTimeFormat(text) : '—'),
          },
          {
            title: 'Action',
            key: 'action',
            width: 160,
            render: (_, record) => (
              <Space>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Customer',
                        content: <ViewCustomer id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Customer',
                        content: <UpdateCustomer id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  onClick={() => deleteCustomer(record.id)}
                  loading={isDeleting}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default CustomerList;
