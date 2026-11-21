import { Space, Tag, Typography } from 'antd';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { openModal } from '../../../app/features/modalSlice';
import useCheckPermission from '../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../layout/components/ContainerLayout';
import AntTable from '../../../common/Table/AntTable';
import ViewButton from '../../../common/Button/ViewButton';
import DeleteButton from '../../../common/Button/DeleteButton';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import { numberWithComma } from '../../../common/utils/numberFormate';
import {
  useDeleteExpenseMutation,
  useGetExpenseListQuery,
} from '../api/expenseEndpoints';
import type { IExpense, IExpenseQuery } from '../types/expense.types';
import CreateExpenseModal from '../components/CreateExpenseModal';
import ViewExpenseModal from '../components/ViewExpenseModal';

const ExpenseList = () => {
  const { can_create, can_delete } = useCheckPermission('EXPENSE');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams<IExpenseQuery>();
  const { data, isLoading, isFetching } = useGetExpenseListQuery(query);
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Record New Expense',
            content: <CreateExpenseModal />,
            open: true,
            width: 700,
          }),
        )
      }
      title='Expense Voucher List'
      options={{ showButton: can_create }}
    >
      <AntTable<IExpense>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'expense_date',
            key: 'expense_date',
            title: 'Date',
            width: 130,
            render: (text) => dateAndTimeFormat(text),
          },
          {
            dataIndex: 'voucher_no',
            key: 'voucher_no',
            title: 'Voucher No',
            width: 140,
            render: (text) => <Tag color='blue'>{text}</Tag>,
          },
          {
            dataIndex: 'account_name',
            key: 'account_name',
            title: 'Payment Account',
            render: (text, record) => (
              <Space direction='vertical' size={0}>
                <span><strong>{text}</strong></span>
                {record.account_type && (
                  <span style={{ fontSize: 11, color: '#888' }}>
                    {record.account_type}
                  </span>
                )}
              </Space>
            ),
          },
          {
            dataIndex: 'expense_head_names',
            key: 'expense_head_names',
            title: 'Expense Heads',
            render: (heads?: string[]) => (
              <Space wrap size={[0, 4]}>
                {heads?.map((head, idx) => (
                  <Tag key={idx} color='purple'>
                    {head}
                  </Tag>
                ))}
              </Space>
            ),
          },
          {
            dataIndex: 'total_items',
            key: 'total_items',
            title: 'Items',
            width: 80,
            align: 'center',
          },
          {
            dataIndex: 'total_amount',
            key: 'total_amount',
            title: 'Total Amount',
            width: 140,
            align: 'right',
            render: (amount: number) => (
              <Typography.Text strong style={{ color: '#cf1322' }}>
                ৳ {numberWithComma(amount)}
              </Typography.Text>
            ),
          },
          {
            dataIndex: 'created_by_name',
            key: 'created_by_name',
            title: 'Recorded By',
            width: 120,
            render: (name) => name || '-',
          },
          {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
              <Space size='small'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: `Expense Voucher: ${record.voucher_no}`,
                        content: <ViewExpenseModal id={record.id} />,
                        open: true,
                        width: 700,
                      }),
                    )
                  }
                />
                {can_delete && (
                  <DeleteButton
                    onClick={() => deleteExpense(record.id)}
                    loading={isDeleting}
                  />
                )}
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default ExpenseList;
