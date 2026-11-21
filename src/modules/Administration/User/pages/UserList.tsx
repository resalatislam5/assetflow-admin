import { Space, Tag } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { getStatusTag } from '../../../../common/utils/status';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import { useDeleteUserMutation, useUserListQuery } from '../api/userEndpoints';
import CreateUser from '../components/CreateUser';
import UpdateUser from '../components/UpdateUser';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';

import type { IUserList } from '../types/userTypes';

const UserList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('USER');
  const { query } = useQueryParams();
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching } = useUserListQuery(query);
  const [deleteItem, { isLoading: isDeleting }] = useDeleteUserMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create User',
            content: <CreateUser />,
            open: true,
            width: 600,
          }),
        )
      }
      title='User List'
      options={{ showButton: can_create }}
    >
      <AntTable<IUserList>
        dataSource={data?.data}
        rowKey={'id'}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Date',
            render: (text: string, record: IUserList) =>
              dateAndTimeFormat(text || (record.createdAt ? String(record.createdAt) : '')),
          },
          { dataIndex: 'name', key: 'name', title: 'Name' },
          { dataIndex: 'type', key: 'type', title: 'Type' },
          { dataIndex: 'role_name', key: 'role_name', title: 'Role' },
          {
            dataIndex: 'data_scope',
            key: 'data_scope',
            title: 'Scope',
            render: (scope: string) => {
              const color =
                scope === 'ALL' ? 'purple' : scope === 'BRANCH' ? 'blue' : 'green';
              return <Tag color={color}>{scope || 'BRANCH'}</Tag>;
            },
          },
          {
            title: 'Location',
            key: 'location',
            render: (_, record) =>
              record.branch_name || record.warehouse_name || 'All Locations',
          },
          { dataIndex: 'email', key: 'email', title: 'Email' },
          { dataIndex: 'phone', key: 'phone', title: 'Phone' },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            render: (text) => getStatusTag(text),
          },
          {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_, record) => (
              <Space>
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Edit User',
                        content: <UpdateUser record={record} />,
                        open: true,
                        width: 600,
                      }),
                    )
                  }
                />

                <DeleteButton
                  can_delete={can_delete}
                  onClick={() => deleteItem(record.id)}
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

export default UserList;
