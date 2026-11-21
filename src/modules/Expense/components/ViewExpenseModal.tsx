import { Card, Descriptions, Divider, Skeleton, Table, Tag } from 'antd';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import { numberWithComma } from '../../../common/utils/numberFormate';
import { useGetSingleExpenseQuery } from '../api/expenseEndpoints';
import type { IExpenseVoucherItem } from '../types/expense.types';

interface Props {
  id: number | string;
}

const ViewExpenseModal = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleExpenseQuery(id);
  const expense = data?.data;

  if (isLoading || !expense) {
    return <Skeleton active />;
  }

  const columns = [
    {
      title: 'Expense Head',
      dataIndex: 'head_name',
      key: 'head_name',
      render: (text: string) => <strong>{text || '-'}</strong>,
    },
    {
      title: 'Item Note',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Amount (৳)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number) => numberWithComma(amount),
    },
  ];

  return (
    <Card size='small' className='modal-container'>
      <Descriptions bordered size='small' column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label='Voucher No'>
          <Tag color='blue'>{expense.voucher_no}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Expense Date'>
          {dateAndTimeFormat(expense.expense_date)}
        </Descriptions.Item>
        <Descriptions.Item label='Payment Account'>
          <strong>{expense.account_name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Recorded By'>
          {expense.created_by_name || 'Admin'}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {dateAndTimeFormat(expense.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label='Notes' span={2}>
          {expense.notes || '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '16px 0 8px 0' }}>Voucher Items</Divider>

      <Table<IExpenseVoucherItem>
        dataSource={expense.items}
        rowKey='id'
        columns={columns}
        pagination={false}
        size='small'
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <strong>Grand Total</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align='right'>
              <strong>৳ {numberWithComma(expense.total_amount)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Card>
  );
};

export default ViewExpenseModal;

