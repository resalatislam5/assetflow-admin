import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { useCreateSupplierPaymentMutation } from '../api/supplierPaymentEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import SupplierPaymentInputs from './SupplierPaymentInputs';
import type { ICreateSupplierPayment } from '../types/supplierPaymentTypes';

type Props = {
  supplierId?: number | string;
};

const CreateSupplierPayment = ({ supplierId }: Props) => {
  const [form] = Form.useForm<ICreateSupplierPayment>();
  const [createPayment, { isLoading }] = useCreateSupplierPaymentMutation();

  const onFinish = (values: ICreateSupplierPayment) => {
    const formattedValues: ICreateSupplierPayment = {
      ...values,
      amount: Number(values.amount),
      payment_date: values.payment_date
        ? dayjs(values.payment_date).toISOString()
        : undefined,
    };

    const sanitized = sanitizeObjectValue(
      formattedValues,
    ) as ICreateSupplierPayment;

    createPayment(sanitized)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <SupplierPaymentInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        initialSupplierId={supplierId}
      />
    </Card>
  );
};

export default CreateSupplierPayment;
