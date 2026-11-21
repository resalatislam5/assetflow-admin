import { Card, Descriptions, Tag } from 'antd';
import { dateAndTimeFormat, formatLabel } from '../../../../common/utils/helper.function';
import type { IBalanceAdjustmentList } from '../types/balanceAdjustmentTypes';

type Props = {
  record: IBalanceAdjustmentList;
};

const ViewBalanceAdjustment = ({ record }: Props) => {
  return (
    <Card className='modal-container'>
      <Descriptions
        column={1}
        bordered
        size='small'
        items={[
          {
            key: 'adjustment_number',
            label: 'Adjustment No',
            children: <Tag color='blue'>{record.adjustment_number}</Tag>,
          },
          {
            key: 'adjustment_date',
            label: 'Adjustment Date',
            children: dateAndTimeFormat(record.adjustment_date),
          },
          {
            key: 'account',
            label: 'Account',
            children: `${record.account_name || 'N/A'} (${formatLabel(record.account_type || '')})`,
          },
          {
            key: 'type',
            label: 'Adjustment Type',
            children: (
              <Tag color={record.type === 'INCREASE' ? 'green' : 'red'}>
                {record.type}
              </Tag>
            ),
          },
          {
            key: 'amount',
            label: 'Amount',
            children: (
              <strong style={{ color: record.type === 'INCREASE' ? '#52c41a' : '#ff4d4f' }}>
                {record.type === 'INCREASE' ? '+' : '-'} ৳{' '}
                {Number(record.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            ),
          },
          {
            key: 'reason',
            label: 'Reason',
            children: record.reason,
          },
          ...(record.notes
            ? [
                {
                  key: 'notes',
                  label: 'Notes',
                  children: record.notes,
                },
              ]
            : []),
          ...(record.created_by_name
            ? [
                {
                  key: 'created_by',
                  label: 'Adjusted By',
                  children: record.created_by_name,
                },
              ]
            : []),
          {
            key: 'created_at',
            label: 'Created At',
            children: dateAndTimeFormat(record.created_at),
          },
        ]}
      />
    </Card>
  );
};

export default ViewBalanceAdjustment;
