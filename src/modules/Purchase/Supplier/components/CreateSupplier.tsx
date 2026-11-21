import { Card, Form } from 'antd';
import { useCreateSupplierMutation } from '../api/supplierEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import SupplierInputs from './SupplierInputs';
import type { ICreateSupplier } from '../types/supplierTypes';

const CreateSupplier = () => {
  const [form] = Form.useForm<ICreateSupplier>();
  const [createSupplier, { isLoading }] = useCreateSupplierMutation();

  const onFinish = (values: ICreateSupplier) => {
    const sanitized = sanitizeObjectValue(values) as ICreateSupplier;

    createSupplier(sanitized)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <SupplierInputs form={form} onFinish={onFinish} loading={isLoading} />
    </Card>
  );
};

export default CreateSupplier;
