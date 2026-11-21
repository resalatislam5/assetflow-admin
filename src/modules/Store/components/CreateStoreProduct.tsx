import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { sanitizeObjectValue } from '../../../common/utils/sanitizeObjectValue';
import { useCreateStoreProductMutation } from '../api/storeEndpoints';
import type { ICreateStoreProduct } from '../types/storeTypes';
import StoreProductInputs from './StoreProductInputs';

const CreateStoreProduct = () => {
  const [form] = useForm();
  const [create, { isLoading }] = useCreateStoreProductMutation();

  const onFinish = (values: ICreateStoreProduct) => {
    const body = sanitizeObjectValue(values);
    create(body)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <StoreProductInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={false}
      />
    </Card>
  );
};

export default CreateStoreProduct;
