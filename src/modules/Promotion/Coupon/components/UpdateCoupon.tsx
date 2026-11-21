import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  useGetSingleCouponQuery,
  useUpdateCouponMutation,
} from '../api/couponEndpoints';
import type { ICreateCoupon } from '../types/couponTypes';
import CouponInputs from './CouponInputs';

type Props = {
  id: string | number;
};

const UpdateCoupon = ({ id }: Props) => {
  const [form] = Form.useForm<ICreateCoupon>();
  const { data, isLoading: isFetching } = useGetSingleCouponQuery(id);
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  useEffect(() => {
    if (data?.data) {
      const c = data.data;
      form.setFieldsValue({
        code: c.code,
        title: c.title,
        discount_type: c.discount_type,
        discount_value: Number(c.discount_value),
        min_order_amount: c.min_order_amount ? Number(c.min_order_amount) : 0,
        max_discount_amount: c.max_discount_amount
          ? Number(c.max_discount_amount)
          : undefined,
        min_item_quantity: c.min_item_quantity ? Number(c.min_item_quantity) : 1,
        branch_id: c.branch_id || undefined,
        warehouse_id: c.warehouse_id || undefined,
        member_only: Boolean(c.member_only),
        requires_manager_approval: Boolean(c.requires_manager_approval),
        usage_limit_total: c.usage_limit_total
          ? Number(c.usage_limit_total)
          : undefined,
        usage_limit_per_customer: Number(c.usage_limit_per_customer || 1),
        start_date: c.start_date
          ? (dayjs(c.start_date) as unknown as string)
          : undefined,
        end_date: c.end_date
          ? (dayjs(c.end_date) as unknown as string)
          : undefined,
        start_time: c.start_time || undefined,
        end_time: c.end_time || undefined,
        applicable_days: c.applicable_days || undefined,
        is_active: Boolean(c.is_active),
      });
    }
  }, [data, form]);

  const onFinish = async (values: ICreateCoupon) => {
    const formattedValues: ICreateCoupon = {
      ...values,
      start_date: values.start_date
        ? dayjs(values.start_date).format('YYYY-MM-DD')
        : '',
      end_date: values.end_date
        ? dayjs(values.end_date).format('YYYY-MM-DD')
        : '',
      branch_id: values.branch_id ? Number(values.branch_id) : undefined,
      warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : undefined,
      min_item_quantity: values.min_item_quantity ? Number(values.min_item_quantity) : 1,
      usage_limit_total: values.usage_limit_total ? Number(values.usage_limit_total) : undefined,
      usage_limit_per_customer: values.usage_limit_per_customer ? Number(values.usage_limit_per_customer) : 1,
      applicable_days:
        values.applicable_days && values.applicable_days.length > 0
          ? values.applicable_days.map(Number)
          : undefined,
    };
    const sanitized = sanitizeObjectValue(formattedValues) as ICreateCoupon;
    await updateCoupon({ body: sanitized, id });
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
      <CouponInputs
        form={form}
        loading={isLoading}
        onFinish={onFinish}
        editMode
      />
    </Card>
  );
};

export default UpdateCoupon;
