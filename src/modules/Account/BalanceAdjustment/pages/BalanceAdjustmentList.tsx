import { Space, Tag } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { openModal } from '../../../../app/features/modalSlice';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import AntTable from '../../../../common/Table/AntTable';
import ViewButton from '../../../../common/Button/ViewButton';
import EditButton from '../../../../common/Button/EditButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import {
  dateAndTimeFormat,
  formatLabel,
} from '../../../../common/utils/helper.function';
import {
  useDeleteBalanceAdjustmentMutation,
  useGetBalanceAdjustmentListQuery,
} from '../api/balanceAdjustmentEndpoints';
import type { IBalanceAdjustmentList } from '../types/balanceAdjustmentTypes';
import CreateBalanceAdjustment from '../components/CreateBalanceAdjustment';
import UpdateBalanceAdjustment from '../components/UpdateBalanceAdjustment';
import ViewBalanceAdjustment from '../components/ViewBalanceAdjustment';

const BalanceAdjustmentList = () => {
  const { can_create, can_delete, can_update } =
    useCheckPermission('BALANCE_ADJUSTMENT');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetBalanceAdjustmentListQuery(query);
  const [deleteAdjustment, { isLoading: isDeleting }] =
    useDeleteBalanceAdjustmentMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Balance Adjustment',
            content: <CreateBalanceAdjustment />,
            open: true,
            width: 600,
          }),
        )
      }
      title='Balance Adjustment List'
      options={{ showButton: can_create }}
    >
      <AntTable<IBalanceAdjustmentList>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'adjustment_date',
            key: 'adjustment_date',
            title: 'Date',
            width: 140,
            render: (text) => dateAndTimeFormat(text),
          },
          {
            dataIndex: 'adjustment_number',
            key: 'adjustment_number',
            title: 'Adjustment No',
            width: 150,
            render: (text) => <Tag color='blue'>{text}</Tag>,
          },
          {
            dataIndex: 'account_name',
            key: 'account_name',
            title: 'Account',
            render: (text, record) => (
              <Space direction='vertical' size={0}>
                <span><strong>{text || '-'}</strong></span>
                <span style={{ fontSize: 11, color: '#888' }}>
                  {formatLabel(record.account_type || '')}
                </span>
              </Space>
            ),
          },
          {
            dataIndex: 'type',
            key: 'type',
            title: 'Type',
            width: 120,
            align: 'center',
            render: (val) => (
              <Tag color={val === 'INCREASE' ? 'green' : 'red'}>
                {val}
              </Tag>
            ),
          },
          {
            dataIndex: 'amount',
            key: 'amount',
            title: 'Amount',
            align: 'right',
            width: 130,
            render: (val, record) => (
              <strong style={{ color: record.type === 'INCREASE' ? '#52c41a' : '#ff4d4f' }}>
                {record.type === 'INCREASE' ? '+' : '-'} ৳{' '}
                {Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            ),
          },
          {
            dataIndex: 'reason',
            key: 'reason',
            title: 'Reason',
            render: (val) => val || '-',
          },
          {
            title: 'Action',
            key: 'action',
            width: 160,
            align: 'center',
            render: (_text, record) => (
              <Space size='small'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Balance Adjustment',
                        content: <ViewBalanceAdjustment record={record} />,
                        open: true,
                        width: 600,
                      }),
                    )
                  }
                />
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Balance Adjustment',
                        content: <UpdateBalanceAdjustment record={record} />,
                        open: true,
                        width: 600,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleteAdjustment(record.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default BalanceAdjustmentList;
