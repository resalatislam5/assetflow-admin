import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  useGetSinglePromotionQuery,
  useUpdatePromotionMutation,
} from '../api/promotionEndpoints';
import type { ICreatePromotion } from '../types/promotionTypes';
import PromotionInputs from './PromotionInputs';

type Props = {
  id: string | number;
};

const UpdatePromotion = ({ id }: Props) => {
  const [form] = Form.useForm<ICreatePromotion>();
  const { data, isLoading: isFetching } = useGetSinglePromotionQuery(id);
  const [updatePromotion, { isLoading }] = useUpdatePromotionMutation();

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      form.setFieldsValue({
        name: p.name,
        promo_type: p.promo_type,
        buy_quantity: p.buy_quantity ? Number(p.buy_quantity) : 1,
        get_quantity: p.get_quantity ? Number(p.get_quantity) : 0,
        discount_percentage: p.discount_percentage
          ? Number(p.discount_percentage)
          : undefined,
        discount_amount: p.discount_amount
          ? Number(p.discount_amount)
          : undefined,
        min_spend_amount: p.min_spend_amount ? Number(p.min_spend_amount) : 0,
        start_date: p.start_date
          ? (dayjs(p.start_date) as unknown as string)
          : undefined,
        end_date: p.end_date
          ? (dayjs(p.end_date) as unknown as string)
          : undefined,
        is_active: Boolean(p.is_active),
      });
    }
  }, [data, form]);

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
    await updatePromotion({ body: sanitized, id });
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <PromotionInputs
        form={form}
        loading={isLoading}
        onFinish={onFinish}
        editMode
      />
    </Card>
  );
};

export default UpdatePromotion;
