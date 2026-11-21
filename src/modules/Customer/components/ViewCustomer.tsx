import { Card, Descriptions, Spin, Tag, Typography } from 'antd';
import { useGetSingleCustomerQuery } from '../api/customerEndpoints';
import { formatDate } from '../../../common/utils/dateFormat';
import { ImagePreview } from '../../../common/components/Image';

type Props = {
  id: number;
};

const ViewCustomer = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleCustomerQuery(id);
  const customer = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'orange';
      case 'BANNED':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CORPORATE':
        return 'purple';
      case 'WHOLESALE':
        return 'blue';
      case 'WALK_IN':
        return 'cyan';
      default:
        return 'geekblue';
    }
  };

  return (
    <Card className='modal-container'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <ImagePreview src={customer.avatar || ''} width={64} height={64} />
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {customer.first_name} {customer.last_name || ''}
          </Typography.Title>
          {customer.company_name && (
            <Typography.Text type='secondary'>
              {customer.company_name}
            </Typography.Text>
          )}
        </div>
      </div>

      <Descriptions bordered size='small' column={{ xs: 1, sm: 2, md: 3 }}>
        <Descriptions.Item label='Customer Code'>
          <Tag
            color='blue'
            style={{ fontFamily: 'monospace', fontWeight: 600 }}
          >
            {customer.customer_code}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Type'>
          <Tag color={getTypeColor(customer.customer_type || 'RETAIL')}>
            {customer.customer_type || 'RETAIL'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Branch'>
          {customer.branch_name ? (
            <Tag color='cyan'>{customer.branch_name}</Tag>
          ) : (
            <Tag>Global / All Branches</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={getStatusColor(customer.status)}>{customer.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Phone'>{customer.phone}</Descriptions.Item>
        <Descriptions.Item label='Email'>
          {customer.email || '—'}
        </Descriptions.Item>
        <Descriptions.Item label='Current Balance'>
          <Typography.Text
            strong
            style={{
              color:
                Number(customer.current_balance) > 0 ? '#cf1322' : '#389e0d',
            }}
          >
            ৳{Number(customer.current_balance || 0).toFixed(2)}
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label='Credit Limit'>
          ৳{Number(customer.credit_limit || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label='Credit Period'>
          {customer.credit_period_days || 0} Days
        </Descriptions.Item>
        <Descriptions.Item label='Opening Balance'>
          ৳{Number(customer.opening_balance || 0).toFixed(2)} (
          {customer.opening_balance_type})
        </Descriptions.Item>
        <Descriptions.Item label='Address' span={3}>
          {customer.address || '—'}
        </Descriptions.Item>
        {customer.notes && (
          <Descriptions.Item label='Notes' span={3}>
            {customer.notes}
          </Descriptions.Item>
        )}
        <Descriptions.Item label='Created At'>
          {customer.created_at ? formatDate(customer.created_at) : '—'}
        </Descriptions.Item>
        <Descriptions.Item label='Updated At'>
          {customer.updated_at ? formatDate(customer.updated_at) : '—'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewCustomer;
