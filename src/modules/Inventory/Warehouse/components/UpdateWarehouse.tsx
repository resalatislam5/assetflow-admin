import { useEffect } from 'react';
import { Card, Form } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateWarehouseMutation } from '../api/warehouseEndpoints';
import type { ICreateWarehouse, IWarehouse } from '../types/warehouseTypes';
import WarehouseInputs from './WarehouseInputs';

type Props = {
  record: IWarehouse;
};

const UpdateWarehouse = ({ record }: Props) => {
  const [form] = Form.useForm<ICreateWarehouse>();
  const dispatch = useAppDispatch();
  const [updateWarehouse, { isLoading }] = useUpdateWarehouseMutation();

  useEffect(() => {
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      branch_id: record.branch_id ?? undefined,
      type: record.type,
      allow_negative_stock: record.allow_negative_stock ?? false,
      phone: record.phone,
      email: record.email,
      address: record.address,
      is_active: record.is_active,
    });
  }, [record, form]);

  const onFinish = async (values: ICreateWarehouse) => {
    const payload: ICreateWarehouse = {
      ...values,
      branch_id: values.branch_id ? Number(values.branch_id) : null,
      allow_negative_stock: Boolean(values.allow_negative_stock),
    };
    const sanitized = sanitizeObjectValue(payload) as ICreateWarehouse;
    const res = await updateWarehouse({ id: record.id, body: sanitized });
    if ('data' in res && res.data?.success) {
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <WarehouseInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateWarehouse;
