import { Card, Descriptions, Image, Spin, Tag } from 'antd';
import { useGetSingleSupplierPaymentQuery } from '../api/supplierPaymentEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';

type Props = {
  id: string | number;
};

const ViewSupplierPayment = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleSupplierPaymentQuery(id);
  const payment = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <Card size='small' className='modal-container'>
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Voucher Number'>
          <strong style={{ color: '#0958d9', fontSize: 15 }}>
            {payment.payment_number}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Payment Date'>
          {payment.payment_date ? dateAndTimeFormat(payment.payment_date) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Supplier'>
          <div>
            <strong>{payment.supplier_name}</strong>
            {payment.supplier_phone && (
              <div style={{ color: '#888' }}>{payment.supplier_phone}</div>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Branch'>
          {payment.branch_name || 'Central / All'}
        </Descriptions.Item>
        <Descriptions.Item label='Disbursement Account'>
          <div>
            <strong>{payment.account_name}</strong>
            <div>
              <Tag color='blue'>{payment.account_type}</Tag>
            </div>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Payment Method'>
          <Tag color='purple'>{payment.payment_method || 'CASH'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Disbursed Amount' span={2}>
          <strong style={{ fontSize: 18, color: '#ff4d4f' }}>
            ৳ {Number(payment.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Reference / Cheque'>
          {payment.reference || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {payment.created_at ? dateAndTimeFormat(payment.created_at) : 'N/A'}
        </Descriptions.Item>
        {payment.image && (
          <Descriptions.Item label='Receipt Attachment' span={2}>
            <Image
              src={payment.image}
              alt='Payment Receipt'
              width={160}
              style={{ borderRadius: 6 }}
            />
          </Descriptions.Item>
        )}
        {payment.notes && (
          <Descriptions.Item label='Notes' span={2}>
            {payment.notes}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default ViewSupplierPayment;
