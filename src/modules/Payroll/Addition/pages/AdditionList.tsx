import { Col, Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import CommonButton from '../../../../common/Button/CommonButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteAdditionMutation,
  useGetAdditionsQuery,
} from '../api/additionEndpoints';
import DeleteAdditionByMonth from '../components/DeleteAdditionByMonth';
import UpdateAddition from '../components/UpdateAddition';
import type { IAddition } from '../types/additionTypes';

const AdditionList = () => {
  const { can_create, can_update, can_delete } =
    useCheckPermission('ADDITION');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetAdditionsQuery({
    params: query,
  });
  const [deleting, { isLoading: isDeleting }] = useDeleteAdditionMutation();

  return (
    <ContainerLayout
      onClick={() => navigate('/payroll/addition/generate')}
      title='Addition List'
      options={{ showButton: can_create }}
      additionalFilter={
        <>
          <Col>
            <DatePicker
              picker='month'
              allowClear
              placeholder='Filter by Month'
              onChange={(date) =>
                setQuery({ month_year: date ? date.format('YYYY-MM') : '' })
              }
              value={query.month_year ? dayjs(query.month_year as string, 'YYYY-MM') : undefined}
            />
          </Col>
          <Col>
            <CommonButton
              danger
              type='primary'
              disabled={!can_delete}
              onClick={() =>
                dispatch(
                  openModal({
                    title: 'Delete Addition by Month',
                    content: <DeleteAdditionByMonth />,
                    open: true,
                    width: 500,
                  }),
                )
              }
              text='Delete Addition'
              icon='ic:baseline-delete'
            />
          </Col>
        </>
      }
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
            dataIndex: 'employee_name',
            key: 'employee_name',
            title: 'Employee Name',
          },
          {
            dataIndex: 'employee_code',
            key: 'employee_code',
            title: 'Employee ID',
          },
          { dataIndex: 'title', key: 'title', title: 'Addition Title' },
          { dataIndex: 'amount', key: 'amount', title: 'Amount' },
          {
            dataIndex: 'month_year',
            key: 'month_year',
            title: 'Addition Month & Year',
            render: (month_year: string) =>
              dayjs(month_year, 'YYYY-MM').format('MMMM YYYY'),
          },

          {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_text, record: IAddition) => (
              <Space size='middle'>
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Edit Addition',
                        content: <UpdateAddition record={record} />,
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

export default AdditionList;
