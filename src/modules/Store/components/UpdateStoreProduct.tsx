import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { sanitizeObjectValue } from '../../../common/utils/sanitizeObjectValue';
import { useUpdateStoreProductMutation } from '../api/storeEndpoints';
import type { ICreateStoreProduct, IStoreProduct } from '../types/storeTypes';
import StoreProductInputs from './StoreProductInputs';

type Props = {
  record: IStoreProduct;
};

const UpdateStoreProduct = ({ record }: Props) => {
  const [form] = useForm();
  const [update, { isLoading }] = useUpdateStoreProductMutation();

  const onFinish = (values: ICreateStoreProduct) => {
    const body = sanitizeObjectValue(values);
    update({ body, id: record.id })
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        code: record.code,
        unit_price: record.unit_price,
        description: record.description || '',
        status: record.status || 'ACTIVE',
      });
    }
  }, [form, record]);

  return (
    <Card size='small' className='modal-container'>
      <StoreProductInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateStoreProduct;
