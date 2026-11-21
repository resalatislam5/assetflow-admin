import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { useCreatePurchaseReturnMutation } from '../api/purchaseReturnEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import PurchaseReturnInputs from './PurchaseReturnInputs';
import type { ICreatePurchaseReturn } from '../types/purchaseReturnTypes';

const CreatePurchaseReturn = () => {
  const [form] = Form.useForm<ICreatePurchaseReturn>();
  const [createPurchaseReturn, { isLoading }] =
    useCreatePurchaseReturnMutation();

  const onFinish = (values: ICreatePurchaseReturn) => {
    const formattedValues: ICreatePurchaseReturn = {
      ...values,
      return_date: values.return_date
        ? dayjs(values.return_date).toISOString()
        : undefined,
      refund_amount: Number(values.refund_amount || 0),
      items: (values.items || []).map((it) => ({
        purchase_item_id: it.purchase_item_id,
        product_id: it.product_id,
        variant_id: it.variant_id ? it.variant_id : undefined,
        quantity: Number(it.quantity || 1),
        unit_cost: Number(it.unit_cost || 0),
        reason: it.reason ? String(it.reason).trim() : undefined,
      })),
    };

    const sanitized = sanitizeObjectValue(
      formattedValues,
    ) as ICreatePurchaseReturn;

    createPurchaseReturn(sanitized)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <PurchaseReturnInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
      />
    </Card>
  );
};

export default CreatePurchaseReturn;
