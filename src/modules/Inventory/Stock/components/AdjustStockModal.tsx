import { Alert, Card, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
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
import { useAdjustStockMutation } from '../api/stockEndpoints';
import type { IAdjustStockPayload, IStock, TransactionType } from '../types/stockTypes';

type Props = {
  record?: IStock;
};

const AdjustStockModal = ({ record }: Props) => {
  const [form] = useForm<IAdjustStockPayload>();
  const dispatch = useAppDispatch();
  const [adjustStock, { isLoading }] = useAdjustStockMutation();
  const { data: productData } = useGetProductSelectQuery();

  const [selectedProductId, setSelectedProductId] = useState<number | string | undefined>(
    record?.product_id
  );
  const [currentTransactionType, setCurrentTransactionType] = useState<TransactionType>(
    'MANUAL_ADJUSTMENT'
  );

  const selectedProduct = productData?.data?.find(
    (p) => String(p.id) === String(selectedProductId)
  );

  const variantOptions =
    selectedProduct?.variants?.map((v) => ({
      label: `${v.variant_name} (${v.sku})`,
      value: v.id,
    })) || [];

  const onFinish = async (values: IAdjustStockPayload) => {
    const body = sanitizeObjectValue({
      ...values,
      stock_id: record?.id,
      warehouse_id: record ? record.warehouse_id : values.warehouse_id,
      product_id: record ? record.product_id : values.product_id,
      variant_id: record?.variant_id ?? values.variant_id ?? undefined,
    }) as IAdjustStockPayload;

    const res = await adjustStock(body);
    if ('data' in res && res.data?.success) {
      form.resetFields();
      dispatch(closeModal());
    }
  };

  useEffect(() => {
    if (record) {
      setSelectedProductId(record.product_id);
      form.setFieldsValue({
        stock_id: record.id,
        warehouse_id: record.warehouse_id,
        product_id: record.product_id,
        variant_id: record.variant_id,
        safety_stock: record.safety_stock,
        transaction_type: 'MANUAL_ADJUSTMENT',
      });
    }
  }, [form, record]);

  const getQuantityLabel = () => {
    if (currentTransactionType === 'DAMAGED') {
      return 'Damaged Quantity to Deduct';
    }
    return 'Quantity Change (+ to add, - to deduct)';
  };

  const getQuantityPlaceholder = () => {
    if (currentTransactionType === 'DAMAGED') {
      return 'Enter units damaged / write off';
    }
    return 'e.g. 50 (to add) or -10 (to deduct)';
  };

  return (
    <Card size='small' className='modal-container'>
      {record && (
        <Alert
          type='info'
          showIcon
          style={{ marginBottom: 16 }}
          message={
            <div>
              <strong>Product:</strong> {record.product_title} &nbsp;|&nbsp;{' '}
              <strong>SKU:</strong> <code>{record.product_sku}</code> &nbsp;|&nbsp;{' '}
              <strong>Warehouse:</strong> {record.warehouse_name} &nbsp;|&nbsp;{' '}
              <strong>On Hand:</strong>{' '}
              <span style={{ color: '#1677ff', fontWeight: 600 }}>
                {record.quantity_on_hand}
              </span>{' '}
              &nbsp;|&nbsp;{' '}
              <strong>Reserved:</strong> {record.quantity_reserved}
            </div>
          }
        />
      )}

      <Form
        onFinish={onFinish}
        form={form}
        layout='vertical'
        initialValues={{
          transaction_type: 'MANUAL_ADJUSTMENT',
          safety_stock: record?.safety_stock ?? 5,
        }}
      >
        <Row gutter={[12, 12]}>
          {!record && (
            <>
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
            </>
          )}

          <FormInputSelect
            name='transaction_type'
            label='Transaction Type'
            placeholder='Select movement type'
            required
            lg={12}
            onChange={(val) => setCurrentTransactionType(val as TransactionType)}
            options={[
              { label: 'Manual Adjustment (+ or -)', value: 'MANUAL_ADJUSTMENT' },
              { label: 'Damaged / Write Off (-)', value: 'DAMAGED' },
            ]}
          />

          <FormInputNumber
            name='quantity_change'
            label={getQuantityLabel()}
            placeholder={getQuantityPlaceholder()}
            required
            lg={12}
          />

          <FormInputNumber
            name='safety_stock'
            label='Safety Stock Threshold'
            placeholder='Low stock alert point'
            required={false}
            lg={12}
            min={0}
          />

          <FormInputTextArea
            name='notes'
            label='Movement Notes / Reference'
            placeholder='Audit count discrepancy, damaged goods write off reason, etc.'
            required={false}
            lg={24}
            rows={2}
          />
        </Row>

        <FromSubmit text='Confirm Stock Adjustment' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default AdjustStockModal;
