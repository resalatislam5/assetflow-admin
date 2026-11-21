import { Card, Descriptions, Divider, Spin, Tag, Typography, theme } from 'antd';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { CustomImage } from '../../../../common/components/Image';
import { useGetSingleMoneyReceiptQuery } from '../api/moneyReceiptEndpoints';
import type { IMoneyReceiptList } from '../types/moneyReceiptTypes';

const { Title, Text } = Typography;

type Props = {
  id?: number | string;
  record?: IMoneyReceiptList;
};

const ViewMoneyReceipt = ({ id, record }: Props) => {
  const { token } = theme.useToken();
  const receiptId = id || record?.id;
  const { data, isLoading } = useGetSingleMoneyReceiptQuery(receiptId || '', {
    skip: !receiptId,
  });

  const receipt = data?.data || record;

  if (isLoading && !receipt) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!receipt) {
    return (
      <Card style={{ textAlign: 'center', padding: '20px' }}>
        <Text type='secondary'>Money receipt not found</Text>
      </Card>
    );
  }

  const getPaymentStatusTag = (status?: string) => {
    switch (status) {
      case 'PAID':
        return <Tag color='success'>PAID</Tag>;
      case 'PARTIALLY_PAID':
        return <Tag color='warning'>PARTIALLY PAID</Tag>;
      default:
        return <Tag color='error'>{status || 'UNPAID'}</Tag>;
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
            Money Receipt: {receipt.receipt_number}
          </Title>
          <Text type='secondary' style={{ fontSize: 12 }}>
            Date: {dateAndTimeFormat(receipt.payment_date, 'DD MMM YYYY') || '—'}
          </Text>
        </div>
        <Tag color='green' style={{ fontSize: 13, padding: '4px 10px' }}>
          {receipt.payment_type}
        </Tag>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <Descriptions bordered size='small' column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label='Invoice Number'>
          <Text strong style={{ color: token.colorPrimary }}>
            {receipt.invoice_number || receipt.order_number}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label='Invoice Payment Status'>
          {getPaymentStatusTag(receipt.order_payment_status)}
        </Descriptions.Item>

        <Descriptions.Item label='Branch'>
          <Text strong>{receipt.branch_name || 'Central / Default'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label='Deposit Account'>
          {receipt.account_name} ({receipt.account_type})
        </Descriptions.Item>

        <Descriptions.Item label='Customer Name'>
          <Text strong>{receipt.customer_name || 'Guest Customer'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label='Customer Phone'>
          {receipt.customer_phone || '—'}
        </Descriptions.Item>

        <Descriptions.Item label='Account Number'>
          {receipt.account_number || '—'}
        </Descriptions.Item>
        <Descriptions.Item label='Total Received'>
          <Text strong style={{ fontSize: 14, color: token.colorPrimary }}>
            ৳{Number(receipt.amount || 0).toLocaleString()}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label='Service / Gateway Fee'>
          {Number(receipt.charge_amount) > 0 ? (
            <Text style={{ color: token.colorError }}>
              -৳{Number(receipt.charge_amount).toLocaleString()}
            </Text>
          ) : (
            '৳0.00'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Net Deposited'>
          <Text strong style={{ fontSize: 16, color: token.colorSuccess }}>
            ৳{Number(receipt.net_amount || 0).toLocaleString()}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label='Reference / Trx ID' span={2}>
          {receipt.reference || '—'}
        </Descriptions.Item>

        <Descriptions.Item label='Notes' span={2}>
          {receipt.notes || '—'}
        </Descriptions.Item>

        {receipt.image && (
          <Descriptions.Item label='Receipt Attachment' span={2}>
            <CustomImage src={receipt.image} width={120} />
          </Descriptions.Item>
        )}

        <Descriptions.Item label='Recorded By'>
          {receipt.created_by_name || 'System'}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {dateAndTimeFormat(receipt.created_at, 'DD MMM YYYY, hh:mm A') || '—'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewMoneyReceipt;
