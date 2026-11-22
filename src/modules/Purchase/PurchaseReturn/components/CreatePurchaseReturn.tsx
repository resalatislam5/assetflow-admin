import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useCreatePurchaseReturnMutation } from '../api/purchaseReturnEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useActiveLocation } from '../../../../common/hooks/useActiveLocation';
import PurchaseReturnInputs from './PurchaseReturnInputs';
import type { ICreatePurchaseReturn } from '../types/purchaseReturnTypes';

const CreatePurchaseReturn = () => {
  const [form] = Form.useForm<ICreatePurchaseReturn>();
  const { isBranch, selectedBranchId, isWarehouse, selectedWarehouseId } = useActiveLocation();
  const [createPurchaseReturn, { isLoading }] =
    useCreatePurchaseReturnMutation();

  useEffect(() => {
    if (selectedBranchId) {
      form.setFieldValue('branch_id', selectedBranchId);
    }
    if (selectedWarehouseId) {
      form.setFieldValue('warehouse_id', selectedWarehouseId);
    }
  }, [selectedBranchId, selectedWarehouseId, form]);

  const onFinish = (values: ICreatePurchaseReturn) => {
    const formattedValues: ICreatePurchaseReturn = {
      ...values,
      branch_id: isBranch && selectedBranchId ? selectedBranchId : values.branch_id ? Number(values.branch_id) : undefined,
      warehouse_id: isWarehouse && selectedWarehouseId ? selectedWarehouseId : values.warehouse_id ? Number(values.warehouse_id) : undefined,
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
