import { Descriptions, Divider, Spin, Tag, Typography } from 'antd';
import { CustomImage } from '../../../../common/components/Image';
import { useGetSingleCustomerRefundQuery } from '../api/customerRefundEndpoints';
import type { ICustomerRefundListItem } from '../types/customerRefundTypes';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

type Props = {
  id?: number | string;
  record?: ICustomerRefundListItem;
};

const ViewCustomerRefund = ({ id, record }: Props) => {
  const refundId = id || record?.id;
  const { data, isLoading } = useGetSingleCustomerRefundQuery(refundId || '', {
    skip: !refundId,
  });

  const refund = data?.data || record;

  if (isLoading && !refund) {
    return (
      <div style={{ textAlign: 'center', padding: 32 }}>
        <Spin />
      </div>
    );
  }

  if (!refund) {
    return <Text type='secondary'>No refund details found.</Text>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {refund.refund_number}
          </Title>
          <Text type='secondary'>
            {dayjs(refund.refund_date).format('DD MMM YYYY')}
          </Text>
        </div>
        <Tag color={refund.status === 'COMPLETED' ? 'green' : 'orange'}>
          {refund.status}
        </Tag>
      </div>

      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Customer Name'>
          {refund.customer_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Customer Phone'>
          {refund.customer_phone || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label='Branch'>
          <Text strong>{refund.branch_name || 'Central / Default'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label='Refunded From Account'>
          {refund.account_name} ({refund.account_type})
        </Descriptions.Item>

        <Descriptions.Item label='Invoice Number'>
          {refund.invoice_number || refund.order_number || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Return Number'>
          {refund.return_number || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label='Payment Method'>
          <Tag color='blue'>{refund.payment_type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Refund Reason'>
          <Tag color='purple'>{refund.refund_reason}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label='Customer Account / Phone'>
          {refund.customer_account_details || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Transaction ID / Reference'>
          {refund.reference || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label='Processed By'>
          {refund.created_by_name || 'System'}
        </Descriptions.Item>
        <Descriptions.Item label='Refund Date'>
          {dayjs(refund.refund_date).format('DD MMM YYYY')}
        </Descriptions.Item>

        <Descriptions.Item label='Refund Amount' span={2}>
          <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
            ৳ {Number(refund.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </Descriptions.Item>

        {Number(refund.charge_amount || 0) > 0 && (
          <Descriptions.Item label='Transfer Charge' span={2}>
            ৳ {Number(refund.charge_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Descriptions.Item>
        )}

        <Descriptions.Item label='Total Company Outflow' span={2}>
          <Text strong style={{ fontSize: 16, color: '#f5222d' }}>
            ৳ {Number(refund.net_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Text>
        </Descriptions.Item>

        {refund.notes && (
          <Descriptions.Item label='Notes' span={2}>
            {refund.notes}
          </Descriptions.Item>
        )}

        {refund.image && (
          <Descriptions.Item label='Receipt / Slip' span={2}>
            <CustomImage src={refund.image} width={120} />
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider style={{ margin: '16px 0' }} />
    </div>
  );
};

export default ViewCustomerRefund;
