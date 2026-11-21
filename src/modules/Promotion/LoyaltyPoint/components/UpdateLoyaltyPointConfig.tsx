import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  useGetLoyaltyPointConfigQuery,
  useUpdateLoyaltyPointConfigMutation,
} from '../api/loyaltyPointEndpoints';
import type { IUpdateLoyaltyPointConfig } from '../types/loyaltyPointTypes';
import LoyaltyPointConfigInputs from './LoyaltyPointConfigInputs';

const UpdateLoyaltyPointConfig = () => {
  const [form] = Form.useForm<IUpdateLoyaltyPointConfig>();
  const { data, isLoading: isFetching } = useGetLoyaltyPointConfigQuery();
  const [updateConfig, { isLoading }] = useUpdateLoyaltyPointConfigMutation();

  useEffect(() => {
    if (data?.data) {
      const c = data.data;
      form.setFieldsValue({
        is_enabled: Boolean(c.is_enabled),
        earning_spending_amount: Number(c.earning_spending_amount || 100),
        earning_points: Number(c.earning_points || 1),
        min_order_amount_for_earning: Number(c.min_order_amount_for_earning || 0),
        redemption_points: Number(c.redemption_points || 10),
        redemption_amount: Number(c.redemption_amount || 1),
        min_points_to_redeem: Number(c.min_points_to_redeem || 10),
        max_discount_percentage: Number(c.max_discount_percentage || 50),
      });
    }
  }, [data, form]);

  const onFinish = async (values: IUpdateLoyaltyPointConfig) => {
    const sanitized = sanitizeObjectValue(values) as IUpdateLoyaltyPointConfig;
    await updateConfig(sanitized);
  };

  if (isFetching) {
    return (
      <Card size='small' className='modal-container' style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </Card>
    );
  }

  return (
    <Card size='small' className='modal-container'>
      <LoyaltyPointConfigInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
      />
    </Card>
  );
};

export default UpdateLoyaltyPointConfig;
