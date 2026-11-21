import { Space } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { getStatusTag } from '../../../../common/utils/status';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteDesignationMutation,
  useGetDesignationsQuery,
} from '../api/designationEndpoints';
import CreateDesignation from '../components/CreateDesignation';
import UpdateDesignation from '../components/UpdateDesignation';
import type { IDesignationList } from '../types/designationTypes';

const DesignationList = () => {
  const { can_create, can_delete, can_update } =
    useCheckPermission('DESIGNATION');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetDesignationsQuery(query);
  const [deleting, { isLoading: isDeleting }] = useDeleteDesignationMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Designation',
            content: <CreateDesignation />,
            open: true,
            width: 500,
          }),
        )
      }
      title='Designation List'
      options={{ showButton: can_create }}
    >
      <AntTable<IDesignationList>
        dataSource={data?.data}
        rowKey={'_id'}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'createdAt',
            key: 'createdAt',
            title: 'Date',
            render: (text) => dateAndTimeFormat(text),
          },
          { dataIndex: 'name', key: 'name', title: 'Designation' },
          {
            dataIndex: 'department_id',
            key: 'department_id',
            title: 'Department',
            render: (dep: { name?: string }) => dep?.name || 'N/A',
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
            width: 150,
            render: (_text, record) => (
              <Space size='middle'>
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Edit Designation',
                        content: <UpdateDesignation record={record} />,
                        open: true,
                        width: 500,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleting(record._id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default DesignationList;
