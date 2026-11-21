import { Col, Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { openModal } from '../../../../app/features/modalSlice';
import CommonButton from '../../../../common/Button/CommonButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteBonusMutation,
  useGetBonusesQuery,
} from '../api/bonusEndpoints';
import DeleteBonusByMonth from '../components/DeleteBonusByMonth';
import UpdateBonus from '../components/UpdateBonus';
import type { IBonus } from '../types/bonusTypes';

const BonusList = () => {
  const { can_create, can_update, can_delete } = useCheckPermission('BONUS');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetBonusesQuery({ params: query });
  const [deleting, { isLoading: isDeleting }] = useDeleteBonusMutation();

  return (
    <ContainerLayout
      onClick={() => navigate('/payroll/bonus/generate')}
      title='Bonus List'
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
            {can_delete && (
              <CommonButton
                danger
                type='primary'
                onClick={() =>
                  dispatch(
                    openModal({
                      title: 'Delete Bonus by Month',
                      content: <DeleteBonusByMonth />,
                      open: true,
                      width: 500,
                    }),
                  )
                }
                text='Delete Bonus'
                icon='ic:baseline-delete'
              />
            )}
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
          { dataIndex: 'title', key: 'title', title: 'Bonus Title' },
          { dataIndex: 'amount', key: 'amount', title: 'Amount' },
          {
            dataIndex: 'month_year',
            key: 'month_year',
            title: 'Bonus Month & Year',
            render: (month_year: string) =>
              dayjs(month_year, 'YYYY-MM').format('MMMM YYYY'),
          },

          {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_text, record: IBonus) => (
              <Space size='middle'>
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Edit Bonus',
                        content: <UpdateBonus record={record} />,
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

export default BonusList;
