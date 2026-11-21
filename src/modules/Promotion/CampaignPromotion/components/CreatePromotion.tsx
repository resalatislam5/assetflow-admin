import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreatePromotionMutation } from '../api/promotionEndpoints';
import type { ICreatePromotion } from '../types/promotionTypes';
import PromotionInputs from './PromotionInputs';

const CreatePromotion = () => {
  const [form] = Form.useForm<ICreatePromotion>();
  const [createPromotion, { isLoading }] = useCreatePromotionMutation();

  const onFinish = async (values: ICreatePromotion) => {
    const formattedValues: ICreatePromotion = {
      ...values,
      start_date: values.start_date
        ? dayjs(values.start_date).format('YYYY-MM-DD')
        : '',
      end_date: values.end_date
        ? dayjs(values.end_date).format('YYYY-MM-DD')
        : '',
      buy_quantity: values.buy_quantity ? Number(values.buy_quantity) : 1,
      get_quantity: values.get_quantity ? Number(values.get_quantity) : 0,
      discount_percentage: values.discount_percentage
        ? Number(values.discount_percentage)
        : undefined,
      discount_amount: values.discount_amount
        ? Number(values.discount_amount)
        : undefined,
      min_spend_amount: values.min_spend_amount
        ? Number(values.min_spend_amount)
        : 0,
    };
    const sanitized = sanitizeObjectValue(formattedValues) as ICreatePromotion;
    await createPromotion(sanitized);
  };

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <PromotionInputs
        form={form}
        loading={isLoading}
        onFinish={onFinish}
      />
    </Card>
  );
};

export default CreatePromotion;
