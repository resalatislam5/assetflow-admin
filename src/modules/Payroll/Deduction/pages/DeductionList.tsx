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
  useDeleteDeductionMutation,
  useGetDeductionsQuery,
} from '../api/deductionEndpoints';
import DeleteDeductionByMonth from '../components/DeleteDeductionByMonth';
import UpdateDeduction from '../components/UpdateDeduction';
import type { IDeduction } from '../types/deductionTypes';

const DeductionList = () => {
  const { can_create, can_update, can_delete } =
    useCheckPermission('DEDUCTION');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetDeductionsQuery({
    params: query,
  });
  const [deleting, { isLoading: isDeleting }] = useDeleteDeductionMutation();

  return (
    <ContainerLayout
      onClick={() => navigate('/payroll/deduction/generate')}
      title='Deduction List'
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
                    title: 'Delete Deduction by Month',
                    content: <DeleteDeductionByMonth />,
                    open: true,
                    width: 500,
                  }),
                )
              }
              text='Delete Bonus'
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
          { dataIndex: 'title', key: 'title', title: 'Deduction Title' },
          { dataIndex: 'amount', key: 'amount', title: 'Amount' },
          {
            dataIndex: 'month_year',
            key: 'month_year',
            title: 'Deduction Month & Year',
            render: (month_year: string) =>
              dayjs(month_year, 'YYYY-MM').format('MMMM YYYY'),
          },

          {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_text, record: IDeduction) => (
              <Space size='middle'>
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Edit Deduction',
                        content: <UpdateDeduction record={record} />,
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

export default DeductionList;
