import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useCreatePurchaseMutation } from '../api/purchaseEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useActiveLocation } from '../../../../common/hooks/useActiveLocation';
import PurchaseInputs from './PurchaseInputs';
import type { ICreatePurchase } from '../types/purchaseTypes';

const CreatePurchase = () => {
  const [form] = Form.useForm<ICreatePurchase>();
  const { isBranch, selectedBranchId, isWarehouse, selectedWarehouseId } = useActiveLocation();
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  useEffect(() => {
    if (selectedBranchId) {
      form.setFieldValue('branch_id', selectedBranchId);
    }
    if (selectedWarehouseId) {
      form.setFieldValue('warehouse_id', selectedWarehouseId);
    }
  }, [selectedBranchId, selectedWarehouseId, form]);

  const onFinish = (values: ICreatePurchase) => {
    const formattedValues: ICreatePurchase = {
      ...values,
      branch_id: isBranch && selectedBranchId ? selectedBranchId : values.branch_id ? Number(values.branch_id) : undefined,
      warehouse_id: isWarehouse && selectedWarehouseId ? selectedWarehouseId : values.warehouse_id ? Number(values.warehouse_id) : undefined,
      purchase_date: values.purchase_date
        ? dayjs(values.purchase_date).toISOString()
        : undefined,
      discount_amount: Number(values.discount_amount || 0),
      shipping_cost: Number(values.shipping_cost || 0),
      paid_amount: Number(values.paid_amount || 0),
      status: values.status || 'RECEIVED',
      items: (values.items || []).map((it) => {
        const cost = Number(
          it.unit_cost !== undefined && it.unit_cost !== null
            ? it.unit_cost
            : it.purchase_price || 0,
        );
        return {
          product_id: it.product_id,
          variant_id: it.variant_id ? it.variant_id : undefined,
          quantity: Number(it.quantity || 1),
          unit_cost: cost,
          purchase_price: cost,
          base_price:
            it.base_price !== undefined &&
            it.base_price !== null &&
            String(it.base_price) !== ''
              ? Number(it.base_price)
              : undefined,
          special_price:
            it.special_price !== undefined &&
            it.special_price !== null &&
            String(it.special_price) !== ''
              ? Number(it.special_price)
              : undefined,
          batch_number: it.batch_number ? String(it.batch_number).trim() : undefined,
          expiry_date: it.expiry_date ? dayjs(it.expiry_date).toISOString() : undefined,
        };
      }),
    };

    const sanitized = sanitizeObjectValue(formattedValues) as ICreatePurchase;

    createPurchase(sanitized)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <PurchaseInputs form={form} onFinish={onFinish} loading={isLoading} />
    </Card>
  );
};

export default CreatePurchase;
