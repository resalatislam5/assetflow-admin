import { Card, Descriptions, Spin, Tag } from 'antd';
import { useGetSingleCouponQuery } from '../api/couponEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';

type Props = {
  id: string | number;
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ViewCoupon = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleCouponQuery(id);
  const coupon = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!coupon) {
    return null;
  }

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label='Coupon Code'>
          <strong style={{ letterSpacing: 1 }}>{coupon.code}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Coupon Title'>
          {coupon.title}
        </Descriptions.Item>
        <Descriptions.Item label='Discount Type'>
          <Tag color={coupon.discount_type === 'PERCENTAGE' ? 'purple' : 'blue'}>
            {coupon.discount_type === 'PERCENTAGE' ? 'PERCENTAGE (%)' : 'FIXED AMOUNT (BDT )'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Discount Value'>
          <strong>
            {coupon.discount_type === 'PERCENTAGE'
              ? `${coupon.discount_value}%`
              : `BDT ${coupon.discount_value}`}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Minimum Order Amount'>
          BDT {coupon.min_order_amount}
        </Descriptions.Item>
        <Descriptions.Item label='Max Discount Cap'>
          {coupon.max_discount_amount ? `BDT ${coupon.max_discount_amount}` : 'Unlimited'}
        </Descriptions.Item>
        <Descriptions.Item label='Min Item Quantity'>
          {coupon.min_item_quantity || 1} units
        </Descriptions.Item>
        <Descriptions.Item label='Branch Scope'>
          {coupon.branch_name ? <Tag color='cyan'>{coupon.branch_name}</Tag> : <Tag>All Branches (Global)</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label='Warehouse Scope'>
          {coupon.warehouse_name ? <Tag color='geekblue'>{coupon.warehouse_name}</Tag> : <Tag>All Warehouses (Global)</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label='Audience'>
          <Tag color={coupon.member_only ? 'gold' : 'green'}>
            {coupon.member_only ? 'Members Only' : 'All Customers'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Manager Approval'>
          <Tag color={coupon.requires_manager_approval ? 'orange' : 'default'}>
            {coupon.requires_manager_approval ? 'Required' : 'Not Required'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Total Usages'>
          <strong>{coupon.usage_count}</strong> / {coupon.usage_limit_total ? coupon.usage_limit_total : 'Unlimited'}
        </Descriptions.Item>
        <Descriptions.Item label='Per Customer Limit'>
          {coupon.usage_limit_per_customer}
        </Descriptions.Item>
        <Descriptions.Item label='Active Time Window'>
          {coupon.start_time || coupon.end_time
            ? `${coupon.start_time || '00:00:00'} - ${coupon.end_time || '23:59:59'}`
            : 'All Day'}
        </Descriptions.Item>
        <Descriptions.Item label='Applicable Days'>
          {coupon.applicable_days && coupon.applicable_days.length > 0
            ? coupon.applicable_days.map((d) => <Tag key={d}>{DAY_NAMES[d] || d}</Tag>)
            : 'All Days'}
        </Descriptions.Item>
        <Descriptions.Item label='Validity'>
          <div>From: {coupon.start_date ? dateAndTimeFormat(coupon.start_date) : 'N/A'}</div>
          <div>To: {coupon.end_date ? dateAndTimeFormat(coupon.end_date) : 'N/A'}</div>
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={coupon.is_active ? 'green' : 'red'}>
            {coupon.is_active ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Created By'>
          {coupon.created_by_name || 'System'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewCoupon;
