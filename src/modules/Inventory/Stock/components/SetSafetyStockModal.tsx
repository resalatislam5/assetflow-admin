import { Alert, Card, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputSelect,
} from '../../../../common/Form/FormIInput';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  SelectProduct,
  SelectWarehouse,
  useGetProductSelectQuery,
} from '../../../../common/SelectWithApi';
import { useSetSafetyStockMutation } from '../api/stockEndpoints';
import type { ISetSafetyStockPayload, IStock } from '../types/stockTypes';

type Props = {
  record?: IStock;
};

const SetSafetyStockModal = ({ record }: Props) => {
  const [form] = useForm<ISetSafetyStockPayload>();
  const dispatch = useAppDispatch();
  const [setSafetyStock, { isLoading }] = useSetSafetyStockMutation();
  const { data: productData } = useGetProductSelectQuery();

  const [selectedProductId, setSelectedProductId] = useState<number | string | undefined>(
    record?.product_id
  );

  const selectedProduct = productData?.data?.find(
    (p) => String(p.id) === String(selectedProductId)
  );

  const variantOptions =
    selectedProduct?.variants?.map((v) => ({
      label: `${v.variant_name} (${v.sku})`,
      value: v.id,
    })) || [];

  const onFinish = async (values: ISetSafetyStockPayload) => {
    const body = sanitizeObjectValue({
      ...values,
      stock_id: record?.id,
      warehouse_id: record ? record.warehouse_id : values.warehouse_id,
      product_id: record ? record.product_id : values.product_id,
      variant_id: record?.variant_id ?? values.variant_id ?? undefined,
      safety_stock: Number(values.safety_stock),
    }) as ISetSafetyStockPayload;

    const res = await setSafetyStock(body);
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
      });
    }
  }, [form, record]);

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
              <strong>Current Safety Stock:</strong>{' '}
              <span style={{ color: '#fa8c16', fontWeight: 600 }}>
                {record.safety_stock}
              </span>
            </div>
          }
        />
      )}

      <Form
        onFinish={onFinish}
        form={form}
        layout='vertical'
        initialValues={{
          safety_stock: record?.safety_stock ?? 5,
        }}
      >
        <Row gutter={[12, 12]}>
          {!record && (
            <>
              <SelectWarehouse
                name='warehouse_id'
                label='Warehouse'
                placeholder='Select warehouse'
                required
                lg={12}
              />

              <SelectProduct
                name='product_id'
                label='Product'
                placeholder='Select product'
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

          <FormInputNumber
            name='safety_stock'
            label='Warehouse Safety Stock Threshold'
            placeholder='e.g. 10'
            required
            lg={record ? 24 : 12}
            min={0}
          />
        </Row>

        <FromSubmit text='Save Safety Stock' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default SetSafetyStockModal;

