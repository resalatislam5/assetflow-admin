import { Card, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputSelect,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  SelectProduct,
  SelectWarehouse,
  useGetProductSelectQuery,
} from '../../../../common/SelectWithApi';
import { useCreateStockAdjustmentMutation } from '../api/stockAdjustEndpoints';
import type { ICreateStockAdjustmentPayload } from '../types/stockAdjustTypes';

const CreateStockAdjustModal = () => {
  const [form] = useForm<ICreateStockAdjustmentPayload>();
  const dispatch = useAppDispatch();
  const [createStockAdjustment, { isLoading }] = useCreateStockAdjustmentMutation();
  const { data: productData } = useGetProductSelectQuery();

  const [selectedProductId, setSelectedProductId] = useState<number | string | undefined>();
  const [transactionType, setTransactionType] = useState<'MANUAL_ADJUSTMENT' | 'DAMAGED'>('MANUAL_ADJUSTMENT');

  const selectedProduct = productData?.data?.find(
    (p) => String(p.id) === String(selectedProductId)
  );

  const variantOptions =
    selectedProduct?.variants?.map((v) => ({
      label: `${v.variant_name} (${v.sku})`,
      value: v.id,
    })) || [];

  const onFinish = async (values: ICreateStockAdjustmentPayload) => {
    let quantityChange = Number(values.quantity_change);
    if (transactionType === 'DAMAGED' && quantityChange > 0) {
      quantityChange = -Math.abs(quantityChange);
    }

    const payload = sanitizeObjectValue({
      warehouse_id: Number(values.warehouse_id),
      product_id: Number(values.product_id),
      variant_id: values.variant_id ? Number(values.variant_id) : undefined,
      transaction_type: values.transaction_type,
      quantity_change: quantityChange,
      notes: values.notes,
    }) as unknown as ICreateStockAdjustmentPayload;

    const res = await createStockAdjustment(payload);
    if ('data' in res && res.data?.success) {
      form.resetFields();
      dispatch(closeModal());
    }
  };

  const getQuantityLabel = () => {
    if (transactionType === 'DAMAGED') {
      return 'Damaged Quantity to Deduct';
    }
    return 'Quantity Change (+ to add, - to deduct)';
  };

  const getQuantityPlaceholder = () => {
    if (transactionType === 'DAMAGED') {
      return 'Enter units damaged / write-off';
    }
    return 'e.g. 50 (to add) or -10 (to deduct)';
  };

  return (
    <Card size='small' className='modal-container'>
      <Form
        onFinish={onFinish}
        form={form}
        layout='vertical'
        initialValues={{
          transaction_type: 'MANUAL_ADJUSTMENT',
        }}
      >
        <Row gutter={[12, 12]}>
          <SelectWarehouse
            name='warehouse_id'
            label='Target Warehouse'
            placeholder='Select warehouse'
            required
            lg={12}
          />

          <SelectProduct
            name='product_id'
            label='Target Product'
            placeholder='Select catalog product'
            required
            lg={12}
            onChange={(val) => {
              setSelectedProductId(val as number | string);
              form.setFieldValue('variant_id', undefined);
            }}
          />

          {variantOptions.length > 0 && (
            <FormInputSelect
              name='variant_id'
              label='Product Variant'
              placeholder='Select variant'
              required={false}
              lg={12}
              options={variantOptions}
            />
          )}

          <FormInputSelect
            name='transaction_type'
            label='Adjustment Type'
            placeholder='Select adjustment type'
            required
            lg={12}
            onChange={(val) => setTransactionType(val as 'MANUAL_ADJUSTMENT' | 'DAMAGED')}
            options={[
              { label: 'Manual Adjustment (+ or -)', value: 'MANUAL_ADJUSTMENT' },
              { label: 'Damaged / Write-Off (-)', value: 'DAMAGED' },
            ]}
          />

          <FormInputNumber
            name='quantity_change'
            label={getQuantityLabel()}
            placeholder={getQuantityPlaceholder()}
            required
            lg={12}
          />

          <FormInputTextArea
            name='notes'
            label='Adjustment Reason / Audit Notes'
            placeholder='Discrepancy reason, physical inventory count variance, damaged unit details...'
            required={false}
            lg={24}
            rows={3}
          />
        </Row>

        <FromSubmit text='Save Stock Adjustment' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default CreateStockAdjustModal;

