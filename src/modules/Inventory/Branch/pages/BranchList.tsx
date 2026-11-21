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
  useDeleteBranchMutation,
  useGetBranchListQuery,
} from '../api/branchEndpoints';
import CreateBranch from '../components/CreateBranch';
import UpdateBranch from '../components/UpdateBranch';
import type { IBranch, IBranchQuery } from '../types/branchTypes';

const BranchList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('INVENTORY');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IBranchQuery>();

  const { data, isLoading, isFetching } = useGetBranchListQuery(query);
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const handleStatusFilter = (value?: string) => {
    setQuery({ is_active: value !== undefined && value !== '' ? value : undefined, page: 1 });
  };

  const handleMainBranchFilter = (value?: string) => {
    setQuery({ is_main_branch: value !== undefined && value !== '' ? value : undefined, page: 1 });
  };

  return (
    <ContainerLayout
      title='Branch Management'
      options={{
        showButton: can_create,
        showSearch: true,
      }}
      buttonText='Create Branch'
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Branch',
            content: <CreateBranch />,
            open: true,
            width: 700,
          })
        )
      }
      additionalFilter={
        <>
          <Col xs={24} sm={8} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Status'
              allowClear
              value={query.is_active !== undefined ? String(query.is_active) : undefined}
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
              value={query.is_main_branch !== undefined ? String(query.is_main_branch) : undefined}
              onChange={handleMainBranchFilter}
              options={[
                { label: 'Headquarters Only', value: 'true' },
                { label: 'Standard Branches', value: 'false' },
              ]}
            />
          </Col>
        </>
      }
    >
      <AntTable<IBranch>
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
            width: 140,
            render: (code: string) => (
              <Tag color='purple' style={{ fontWeight: 600 }}>
                {code}
              </Tag>
            ),
          },
          {
            title: 'Branch Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: IBranch) => (
              <Space orientation='vertical' size={2}>
                <strong>{name}</strong>
                {record.is_main_branch && (
                  <Tag color='gold' style={{ fontSize: '11px' }}>
                    HEADQUARTERS
                  </Tag>
                )}
              </Space>
            ),
          },
          {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            width: 120,
            render: (city: string) => city || '-',
          },
          {
            title: 'Contact Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone: string) => phone || '-',
          },
          {
            title: 'Contact Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => email || '-',
          },
          {
            title: 'Physical Address',
            dataIndex: 'address',
            key: 'address',
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
            render: (_, record: IBranch) => (
              <Space size='small'>
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Branch',
                        content: <UpdateBranch record={record} />,
                        open: true,
                        width: 700,
                      })
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleteBranch(record.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default BranchList;
