import { Card, Form } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateWarehouseMutation } from '../api/warehouseEndpoints';
import type { ICreateWarehouse } from '../types/warehouseTypes';
import WarehouseInputs from './WarehouseInputs';

const CreateWarehouse = () => {
  const [form] = Form.useForm<ICreateWarehouse>();
  const dispatch = useAppDispatch();
  const [createWarehouse, { isLoading }] = useCreateWarehouseMutation();

  const onFinish = async (values: ICreateWarehouse) => {
    const payload: ICreateWarehouse = {
      ...values,
      branch_id: values.branch_id ? Number(values.branch_id) : null,
      allow_negative_stock: Boolean(values.allow_negative_stock),
    };
    const sanitized = sanitizeObjectValue(payload) as ICreateWarehouse;
    const res = await createWarehouse(sanitized);
    if ('data' in res && res.data?.success) {
      form.resetFields();
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <WarehouseInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
      />
    </Card>
  );
};

export default CreateWarehouse;
