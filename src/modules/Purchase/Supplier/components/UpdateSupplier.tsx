import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import {
  useGetSingleSupplierQuery,
  useUpdateSupplierMutation,
} from '../api/supplierEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import SupplierInputs from './SupplierInputs';
import type { ICreateSupplier } from '../types/supplierTypes';

type Props = {
  id: string | number;
};

const UpdateSupplier = ({ id }: Props) => {
  const [form] = Form.useForm<ICreateSupplier>();
  const { data, isLoading: isFetching } = useGetSingleSupplierQuery(id);
  const [updateSupplier, { isLoading }] = useUpdateSupplierMutation();

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        name: data.data.name,
        company_name: data.data.company_name,
        phone: data.data.phone,
        email: data.data.email,
        address: data.data.address,
        status: data.data.status,
      });
    }
  }, [data, form]);

  const onFinish = (values: ICreateSupplier) => {
    const sanitized = sanitizeObjectValue(values) as ICreateSupplier;

    updateSupplier({ body: sanitized, id });
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <Card size='small' className='modal-container'>
      <SupplierInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateSupplier;
