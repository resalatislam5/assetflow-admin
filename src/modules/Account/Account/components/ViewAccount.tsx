import { Card, Descriptions } from 'antd';
import { getStatusTag, type StatusType } from '../../../../common/utils/status';
import { dateAndTimeFormat, formatLabel } from '../../../../common/utils/helper.function';
import type { IAccountList } from '../types/accountTypes';

type Props = {
  record: IAccountList;
};

const ViewAccount = ({ record }: Props) => {
  return (
    <Card className='modal-container'>
      <Descriptions
        column={1}
        bordered
        size='small'
        items={[
          {
            key: 'account_type',
            label: 'Account Type',
            children: formatLabel(record.account_type),
          },
          {
            key: 'account_name',
            label: 'Account Name',
            children: record.name,
          },
          ...(record.bank_name
            ? [
                {
                  key: 'bank_name',
                  label: 'Bank Name',
                  children: record.bank_name,
                },
              ]
            : []),
          ...(record.branch_name
            ? [
                {
                  key: 'branch_name',
                  label: 'Branch Name',
                  children: record.branch_name,
                },
              ]
            : []),
          ...(record.account_number
            ? [
                {
                  key: 'account_number',
                  label: 'Account Number',
                  children: record.account_number,
                },
              ]
            : []),
          {
            key: 'current_balance',
            label: 'Current Balance',
            children: `৳ ${Number(record.current_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
          {
            key: 'opening_balance',
            label: 'Opening Balance',
            children: `৳ ${Number(record.opening_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
          {
            key: 'status',
            label: 'Status',
            children: getStatusTag(record.status as StatusType),
          },
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

export default ViewAccount;
