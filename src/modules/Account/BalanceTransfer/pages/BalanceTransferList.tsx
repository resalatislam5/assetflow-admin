import { Space, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
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
  useDeleteBalanceTransferMutation,
  useGetBalanceTransferListQuery,
} from '../api/balanceTransferEndpoints';
import type { IBalanceTransferList } from '../types/balanceTransferTypes';
import CreateBalanceTransfer from '../components/CreateBalanceTransfer';
import UpdateBalanceTransfer from '../components/UpdateBalanceTransfer';
import ViewBalanceTransfer from '../components/ViewBalanceTransfer';

const BalanceTransferList = () => {
  const { can_create, can_delete, can_update } =
    useCheckPermission('BALANCE_TRANSFER');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetBalanceTransferListQuery(query);
  const [deleteTransfer, { isLoading: isDeleting }] =
    useDeleteBalanceTransferMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Balance Transfer',
            content: <CreateBalanceTransfer />,
            open: true,
            width: 600,
          }),
        )
      }
      title='Balance Transfer List'
      options={{ showButton: can_create }}
    >
      <AntTable<IBalanceTransferList>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'transfer_date',
            key: 'transfer_date',
            title: 'Date',
            width: 140,
            render: (text) => dateAndTimeFormat(text),
          },
          {
            dataIndex: 'transfer_number',
            key: 'transfer_number',
            title: 'Transfer No',
            width: 150,
            render: (text) => <Tag color='blue'>{text}</Tag>,
          },
          {
            dataIndex: 'from_account_name',
            key: 'from_account_name',
            title: 'From Account',
            render: (text, record) => (
              <Space direction='vertical' size={0}>
                <span><strong>{text || '-'}</strong></span>
                <span style={{ fontSize: 11, color: '#888' }}>
                  {formatLabel(record.from_account_type || '')}
                </span>
              </Space>
            ),
          },
          {
            title: '',
            key: 'arrow',
            width: 40,
            align: 'center',
            render: () => <ArrowRightOutlined style={{ color: '#1890ff' }} />,
          },
          {
            dataIndex: 'to_account_name',
            key: 'to_account_name',
            title: 'To Account',
            render: (text, record) => (
              <Space direction='vertical' size={0}>
                <span><strong>{text || '-'}</strong></span>
                <span style={{ fontSize: 11, color: '#888' }}>
                  {formatLabel(record.to_account_type || '')}
                </span>
              </Space>
            ),
          },
          {
            dataIndex: 'amount',
            key: 'amount',
            title: 'Amount',
            align: 'right',
            width: 130,
            render: (val) => (
              <strong style={{ color: '#52c41a' }}>
                ৳ {Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            ),
          },
          {
            dataIndex: 'charge_amount',
            key: 'charge_amount',
            title: 'Charge',
            align: 'right',
            width: 100,
            render: (val) => (
              Number(val) > 0
                ? `৳ ${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : '-'
            ),
          },
          {
            dataIndex: 'reference',
            key: 'reference',
            title: 'Reference',
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
                        title: 'View Balance Transfer',
                        content: <ViewBalanceTransfer record={record} />,
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
                        title: 'Update Balance Transfer',
                        content: <UpdateBalanceTransfer record={record} />,
                        open: true,
                        width: 600,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleteTransfer(record.id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default BalanceTransferList;
