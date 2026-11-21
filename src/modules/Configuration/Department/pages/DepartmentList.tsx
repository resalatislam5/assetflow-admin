import { Space } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import AntTable from '../../../../common/Table/AntTable';
import { getStatusTag } from '../../../../common/utils/status';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from '../api/departmentEndpoints';
import CreateDepartment from '../components/CreateDepartment';
import UpdateDepartment from '../components/UpdateDepartment';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import type { IDepartmentList } from '../types/departmentTypes';

const DepartmentList = () => {
  const { can_create, can_delete, can_update } =
    useCheckPermission('DEPARTMENT');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetDepartmentsQuery(query);
  const [deleting, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Department',
            content: <CreateDepartment />,
            open: true,
            width: 500,
          }),
        )
      }
      title='Department List'
      options={{ showButton: can_create }}
    >
      <AntTable<IDepartmentList>
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
          { dataIndex: 'name', key: 'name', title: 'Department' },
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
                        title: 'Edit Department',
                        content: <UpdateDepartment record={record} />,
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

export default DepartmentList;
