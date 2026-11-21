import { Card, Descriptions, Spin, Tag } from 'antd';
import { useGetSingleSupplierQuery } from '../api/supplierEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';

type Props = {
  id: string | number;
};

const ViewSupplier = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleSupplierQuery(id);
  const supplier = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!supplier) {
    return null;
  }

  const currentBalance = Number(supplier.current_balance || 0);

  return (
    <Card size='small' className='modal-container'>
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Supplier Name' span={2}>
          <strong>{supplier.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Company / Brand'>
          {supplier.company_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={supplier.status === 'ACTIVE' ? 'green' : 'red'}>
            {supplier.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Phone Number'>
          {supplier.phone || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Email'>
          {supplier.email || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Opening Balance'>
          ৳ {Number(supplier.opening_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Descriptions.Item>
        <Descriptions.Item label='Current Balance (Payable)'>
          <strong style={{ color: currentBalance > 0 ? '#ff4d4f' : '#52c41a' }}>
            ৳ {currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Address' span={2}>
          {supplier.address || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {supplier.created_at ? dateAndTimeFormat(supplier.created_at) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Updated At'>
          {supplier.updated_at ? dateAndTimeFormat(supplier.updated_at) : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewSupplier;
