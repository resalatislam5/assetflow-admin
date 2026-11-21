import { Space } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { getStatusTag } from '../../../../common/utils/status';

import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import ViewButton from '../../../../common/Button/ViewButton';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteRoleMutation,
  useGetRoleListQuery,
} from '../api/roleEndpoints';
import CreateRole from '../components/CreateRole';
import UpdateRole from '../components/UpdateRole';
import ViewRole from '../components/ViewRole';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';

import type { IRoleList } from '../types/roleTypes';

const RoleList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('ROLE');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetRoleListQuery(query);
  const [deleteItem, { isLoading: isDeleting }] = useDeleteRoleMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Role',
            content: <CreateRole />,
            open: true,
            width: 1000,
          }),
        )
      }
      title='Role List'
      options={{ showButton: can_create }}
    >
      <AntTable<IRoleList>
        dataSource={data?.data || []}
        rowKey={'id'}
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Date',
            render: (text: string, record: IRoleList) =>
              dateAndTimeFormat(text || record.createdAt || ''),
            width: 150,
          },
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Name',
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            render: (text) => getStatusTag(text),
          },
          {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (_, record) => (
              <Space>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Role',
                        content: <ViewRole id={record.id} />,
                        open: true,
                        width: 1000,
                      }),
                    )
                  }
                />
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Edit Role',
                        content: <UpdateRole id={record.id} />,
                        open: true,
                        width: 1000,
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

export default RoleList;
