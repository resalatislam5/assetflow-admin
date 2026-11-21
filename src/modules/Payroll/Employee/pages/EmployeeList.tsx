import { Space } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from '../api/employeeEndpoints';
import CreateEmployee from '../components/CreateEmployee';
import UpdateEmployee from '../components/UpdateEmployee';
import ViewEmployee from '../components/ViewEmployee';
import ViewButton from '../../../../common/Button/ViewButton';
import type { IEmployee } from '../types/employeeTypes';
import { getStatusTag } from '../../../../common/utils/status';

const EmployeeList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('EMPLOYEE');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetEmployeesQuery({
    params: query,
  });
  const [deleting, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Employee',
            content: <CreateEmployee />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Employee List'
      options={{ showButton: can_create }}
    >
      <AntTable
        dataSource={data?.data}
        rowKey={'_id'}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'joining_date',
            key: 'joining_date',
            title: 'Joining Date',
            render: (text) => dateAndTimeFormat(text),
            width: 130,
          },
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Name',
          },
          { dataIndex: 'code', key: 'code', title: 'Emp ID' },
          {
            dataIndex: 'department_name',
            key: 'department_name',
            title: 'Department',
          },
          {
            dataIndex: 'designation_name',
            key: 'designation_name',
            title: 'Designation',
          },
          {
            dataIndex: 'basic_salary',
            key: 'basic_salary',
            title: 'Basic Salary',
          },
          {
            dataIndex: 'user_name',
            key: 'user_name',
            title: 'Linked User',
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
            width: 120,
            render: (_text, record: IEmployee) => (
              <Space size='middle'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Employee Details',
                        content: <ViewEmployee _id={record?._id} />,
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
                        title: 'Update Employee',
                        content: <UpdateEmployee record={record} />,
                        open: true,
                        width: 800,
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

export default EmployeeList;
