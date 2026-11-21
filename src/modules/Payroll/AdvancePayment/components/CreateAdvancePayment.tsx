import { Card, Form } from 'antd';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateAdvancePaymentMutation } from '../api/advancePaymentEndpoints';
import type { ICreateAdvancePayment } from '../types/advancePaymentTypes';
import AdvancePaymentInputs from './AdvancePaymentInputs';

const CreateAdvancePayment = () => {
  const [form] = Form.useForm();
  const [create, { isLoading }] = useCreateAdvancePaymentMutation();

  const onFinish = async (values: ICreateAdvancePayment) => {
    const body = sanitizeObjectValue(values);

    await create(body)
      .unwrap()
      .then(() => form.resetFields());
  };

  return (
    <Card className='modal-container'>
      <AdvancePaymentInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={false}
      />
    </Card>
  );
};

export default CreateAdvancePayment;
