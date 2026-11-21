import { Card, Descriptions, Spin, Tag } from 'antd';
import { useGetSinglePromotionQuery } from '../api/promotionEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';

type Props = {
  id: string | number;
};

const ViewPromotion = ({ id }: Props) => {
  const { data, isLoading } = useGetSinglePromotionQuery(id);
  const promo = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!promo) {
    return null;
  }

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label='Campaign Name'>
          <strong>{promo.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Strategy Type'>
          <Tag color='purple'>{promo.promo_type}</Tag>
        </Descriptions.Item>

        {promo.promo_type === 'BUY_X_GET_Y' ? (
          <>
            <Descriptions.Item label='Purchase Quantity'>
              Buy {promo.buy_quantity || 1}
            </Descriptions.Item>
            <Descriptions.Item label='Complimentary Quantity'>
              Get {promo.get_quantity || 0} Free
            </Descriptions.Item>
          </>
        ) : (
          <>
            <Descriptions.Item label='Discount Percentage'>
              {promo.discount_percentage ? `${promo.discount_percentage}%` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label='Discount Amount'>
              {promo.discount_amount ? `BDT ${promo.discount_amount}` : 'N/A'}
            </Descriptions.Item>
          </>
        )}

        <Descriptions.Item label='Minimum Spend'>
          BDT {promo.min_spend_amount || 0}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={promo.is_active ? 'green' : 'red'}>
            {promo.is_active ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Start Date'>
          {promo.start_date ? dateAndTimeFormat(promo.start_date) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='End Date'>
          {promo.end_date ? dateAndTimeFormat(promo.end_date) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {promo.created_at ? dateAndTimeFormat(promo.created_at) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Updated At'>
          {promo.updated_at ? dateAndTimeFormat(promo.updated_at) : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewPromotion;
