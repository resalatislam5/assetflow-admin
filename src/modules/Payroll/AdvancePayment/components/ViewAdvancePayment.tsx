import { Descriptions, Skeleton } from 'antd';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useGetSingleAdvancePaymentQuery } from '../api/advancePaymentEndpoints';

const ViewAdvancePayment = ({ _id }: { _id: string }) => {
  const { data, isLoading } = useGetSingleAdvancePaymentQuery(_id, {
    skip: !_id,
  });

  if (isLoading) return <Skeleton active />;

  const {
    employee_code,
    employee_name,
    date,
    amount,
    deduction_per_month,
    remaining_amount,
    reason,
  } = data?.data || {};

  return (
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Employee Name'>
          {employee_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Employee Code'>
          {employee_code || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Date Issued'>
          {dateAndTimeFormat(date)}
        </Descriptions.Item>
        <Descriptions.Item label='Total Amount'>
          {amount || '0'}
        </Descriptions.Item>
        <Descriptions.Item label='Monthly Deduction'>
          {deduction_per_month || '0'}
        </Descriptions.Item>
        <Descriptions.Item label='Remaining Balance'>
          {remaining_amount || '0'}
        </Descriptions.Item>
        <Descriptions.Item label='Transaction Charge'>
          {data?.data?.transaction_charge || '0'}
        </Descriptions.Item>
        <Descriptions.Item label='Reason' span={2}>
          {reason || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
  );
};

export default ViewAdvancePayment;
