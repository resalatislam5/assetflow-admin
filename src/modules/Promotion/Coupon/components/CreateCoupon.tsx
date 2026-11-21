import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateCouponMutation } from '../api/couponEndpoints';
import type { ICreateCoupon } from '../types/couponTypes';
import CouponInputs from './CouponInputs';

const CreateCoupon = () => {
  const [form] = Form.useForm<ICreateCoupon>();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

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
    await createCoupon(sanitized);
  };

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <CouponInputs
        form={form}
        loading={isLoading}
        onFinish={onFinish}
      />
    </Card>
  );
};

export default CreateCoupon;
