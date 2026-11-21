import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Typography,
  type FormInstance,
} from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import {
  SelectAccount,
  SelectBranch,
  SelectProduct,
  SelectSupplier,
  SelectVariant,
  SelectWarehouse,
  useGetProductSelectQuery,
  type IProductSelect,
} from '../../../../common/SelectWithApi';
import type { ICreatePurchase } from '../types/purchaseTypes';

type Props = {
  onFinish: (values: ICreatePurchase) => void;
  loading: boolean;
  form: FormInstance<ICreatePurchase>;
  editMode?: boolean;
};

const PurchaseInputs = ({ onFinish, loading, form, editMode }: Props) => {
  const items = Form.useWatch('items', form) || [];
  const discountAmount = Number(Form.useWatch('discount_amount', form) || 0);
  const shippingCost = Number(Form.useWatch('shipping_cost', form) || 0);
  const paidAmount = Number(Form.useWatch('paid_amount', form) || 0);

  const { data: productSelectRes } = useGetProductSelectQuery();
  const products = useMemo(
    () => productSelectRes?.data || [],
    [productSelectRes],
  );

  const productMap = useMemo(() => {
    const map = new Map<string | number, IProductSelect>();
    products.forEach((p) => {
      map.set(p.id, p);
      map.set(String(p.id), p);
    });
    return map;
  }, [products]);

  const handleProductChange = (
    productId: string | number,
    rowIndex: number,
  ) => {
    const prod = productMap.get(productId);
    if (!prod) {
      form.setFieldValue(['items', rowIndex, 'variant_id'], undefined);
      form.setFieldValue(['items', rowIndex, 'unit_cost'], 0);
      form.setFieldValue(['items', rowIndex, 'purchase_price'], 0);
      form.setFieldValue(['items', rowIndex, 'base_price'], 0);
      form.setFieldValue(['items', rowIndex, 'special_price'], undefined);
      return;
    }

    const hasVariants = Boolean(
      prod.has_variants || (prod.variants && prod.variants.length > 0),
    );
    if (hasVariants && prod.variants && prod.variants.length > 0) {
      const firstVariant = prod.variants[0];
      const defaultPurchaseCost = Number(
        firstVariant.purchase_price ?? prod.purchase_price ?? firstVariant.price ?? prod.base_price ?? 0,
      );
      const defaultPrice = Number(firstVariant.price || prod.base_price || 0);
      const defaultSpecial =
        firstVariant.special_price !== undefined &&
        firstVariant.special_price !== null
          ? Number(firstVariant.special_price)
          : prod.special_price !== undefined && prod.special_price !== null
            ? Number(prod.special_price)
            : undefined;

      form.setFieldValue(['items', rowIndex, 'variant_id'], firstVariant.id);
      form.setFieldValue(['items', rowIndex, 'unit_cost'], defaultPurchaseCost);
      form.setFieldValue(['items', rowIndex, 'purchase_price'], defaultPurchaseCost);
      form.setFieldValue(['items', rowIndex, 'base_price'], defaultPrice);
      form.setFieldValue(['items', rowIndex, 'special_price'], defaultSpecial);
    } else {
      const defaultPurchaseCost = Number(prod.purchase_price ?? prod.base_price ?? 0);
      const defaultPrice = Number(prod.base_price || 0);
      const defaultSpecial =
        prod.special_price !== undefined && prod.special_price !== null
          ? Number(prod.special_price)
          : undefined;

      form.setFieldValue(['items', rowIndex, 'variant_id'], undefined);
      form.setFieldValue(['items', rowIndex, 'unit_cost'], defaultPurchaseCost);
      form.setFieldValue(['items', rowIndex, 'purchase_price'], defaultPurchaseCost);
      form.setFieldValue(['items', rowIndex, 'base_price'], defaultPrice);
      form.setFieldValue(['items', rowIndex, 'special_price'], defaultSpecial);
    }
  };

  const handleVariantChange = (
    variantId: string | number,
    rowIndex: number,
  ) => {
    const productId = form.getFieldValue(['items', rowIndex, 'product_id']);
    const prod = productMap.get(productId);
    const variant = prod?.variants?.find(
      (v) => String(v.id) === String(variantId),
    );
    if (variant) {
      const variantPurchaseCost = Number(
        variant.purchase_price ?? prod?.purchase_price ?? variant.price ?? 0,
      );
      const variantPrice = Number(variant.price || 0);
      const variantSpecial =
        variant.special_price !== undefined && variant.special_price !== null
          ? Number(variant.special_price)
          : undefined;

      form.setFieldValue(['items', rowIndex, 'unit_cost'], variantPurchaseCost);
      form.setFieldValue(['items', rowIndex, 'purchase_price'], variantPurchaseCost);
      form.setFieldValue(['items', rowIndex, 'base_price'], variantPrice);
      form.setFieldValue(['items', rowIndex, 'special_price'], variantSpecial);
    }
  };

  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item?.quantity || 0);
    const price = Number(
      item?.unit_cost !== undefined
        ? item.unit_cost
        : item?.purchase_price || 0,
    );
    return sum + qty * price;
  }, 0);

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  return (
    <Form<ICreatePurchase>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{
        purchase_date: dayjs(),
        status: 'RECEIVED',
        discount_amount: 0,
        shipping_cost: 0,
        paid_amount: 0,
        items: [
          {
            product_id: undefined,
            variant_id: undefined,
            quantity: 1,
            unit_cost: 0,
            purchase_price: 0,
            base_price: 0,
            special_price: undefined,
            batch_number: undefined,
            expiry_date: undefined,
          },
        ],
      }}
    >
      <Row gutter={[16, 0]}>
        <SelectSupplier
          name='supplier_id'
          label='Supplier'
          required
          md={12}
          lg={6}
        />
        <SelectBranch
          name='branch_id'
          label='Operating Branch'
          md={12}
          lg={6}
        />
        <SelectWarehouse
          name='warehouse_id'
          label='Destination Warehouse'
          md={12}
          lg={6}
        />
        <FormInputDate
          name='purchase_date'
          label='Purchase Date'
          required
          md={12}
          lg={6}
        />
        <FormInputSelect
          name='status'
          label='Order Status'
          required
          md={12}
          lg={6}
          options={[
            { label: 'Received', value: 'RECEIVED' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Ordered', value: 'ORDERED' },
            { label: 'Partially Received', value: 'PARTIALLY_RECEIVED' },
            { label: 'Cancelled', value: 'CANCELLED' },
            { label: 'Returned', value: 'RETURNED' },
          ]}
        />
      </Row>

      <Typography.Title level={5} style={{ marginTop: 12, marginBottom: 8 }}>
        Purchase Items
      </Typography.Title>

      <Form.List name='items'>
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fields.map(({ key, name, ...restField }) => {
              const currentItem = items[name];
              const selectedProd = currentItem?.product_id
                ? productMap.get(currentItem.product_id)
                : undefined;
              const hasVariants = Boolean(
                selectedProd?.has_variants ||
                (selectedProd?.variants && selectedProd.variants.length > 0),
              );
              const variantList = selectedProd?.variants || [];

              const currentCost = Number(
                currentItem?.unit_cost !== undefined
                  ? currentItem.unit_cost
                  : currentItem?.purchase_price || 0,
              );
              const lineTotal =
                Number(currentItem?.quantity || 0) * currentCost;

              return (
                <Card
                  key={key}
                  size='small'
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #ebebeb',
                    borderRadius: 8,
                  }}
                >
                  <Row gutter={[12, 0]} align='middle'>
                    <Col
                      xs={24}
                      sm={24}
                      md={hasVariants ? 8 : 11}
                      lg={hasVariants ? 8 : 11}
                    >
                      <SelectProduct
                        {...restField}
                        name={[name, 'product_id']}
                        label='Product'
                        required
                        md={24}
                        lg={24}
                        onChange={(val) => {
                          if (val)
                            handleProductChange(val as string | number, name);
                        }}
                      />
                    </Col>

                    {hasVariants && (
                      <Col xs={24} sm={12} md={6} lg={6}>
                        <SelectVariant
                          {...restField}
                          name={[name, 'variant_id']}
                          label='Variant'
                          variants={variantList}
                          required
                          md={24}
                          lg={24}
                          onChange={(val) => {
                            if (val)
                              handleVariantChange(val as string | number, name);
                          }}
                        />
                      </Col>
                    )}

                    <Col
                      xs={12}
                      sm={6}
                      md={hasVariants ? 3 : 4}
                      lg={hasVariants ? 3 : 4}
                    >
                      <FormInputNumber
                        {...restField}
                        name={[name, 'quantity']}
                        label='Quantity'
                        min={1}
                        required
                        md={24}
                        lg={24}
                      />
                    </Col>

                    <Col
                      xs={12}
                      sm={6}
                      md={hasVariants ? 3 : 4}
                      lg={hasVariants ? 3 : 4}
                    >
                      <FormInputNumber
                        {...restField}
                        name={[name, 'unit_cost']}
                        label='Unit Cost (৳)'
                        min={0}
                        precision={2}
                        required
                        md={24}
                        lg={24}
                      />
                    </Col>

                    <Col xs={18} sm={6} md={3} lg={3}>
                      <Form.Item label='Line Total'>
                        <div
                          style={{
                            padding: '4px 8px',
                            fontWeight: 600,
                            color: '#1890ff',
                            fontSize: 14,
                            lineHeight: '24px',
                          }}
                        >
                          ৳{' '}
                          {lineTotal.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </Form.Item>
                    </Col>

                    <Col
                      xs={6}
                      sm={2}
                      md={1}
                      lg={1}
                      style={{ textAlign: 'right' }}
                    >
                      {fields.length > 1 && (
                        <Button
                          danger
                          type='text'
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          style={{ marginTop: 8 }}
                        />
                      )}
                    </Col>
                  </Row>

                  <div
                    style={{
                      marginTop: 4,
                      paddingTop: 8,
                      borderTop: '1px dashed #e5e7eb',
                    }}
                  >
                    <Row gutter={[12, 0]} align='middle'>
                      <Col xs={24} sm={12} md={6} lg={6}>
                        <FormInputText
                          {...restField}
                          name={[name, 'batch_number']}
                          label='Batch Number'
                          placeholder='e.g. LOT-2026-A'
                          md={24}
                          lg={24}
                        />
                      </Col>
                      <Col xs={24} sm={12} md={6} lg={6}>
                        <FormInputDate
                          {...restField}
                          name={[name, 'expiry_date']}
                          label='Expiry Date'
                          placeholder='Expiry Date'
                          md={24}
                          lg={24}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6}>
                        <FormInputNumber
                          {...restField}
                          name={[name, 'base_price']}
                          label='Store Selling Price (৳)'
                          placeholder='Base Price'
                          min={0}
                          precision={2}
                          md={24}
                          lg={24}
                        />
                      </Col>
                      <Col xs={12} sm={12} md={6} lg={6}>
                        <FormInputNumber
                          {...restField}
                          name={[name, 'special_price']}
                          label='Special Price (৳)'
                          placeholder='Special Price'
                          min={0}
                          precision={2}
                          md={24}
                          lg={24}
                        />
                      </Col>
                    </Row>
                  </div>
                </Card>
              );
            })}

            <Button
              type='dashed'
              onClick={() =>
                add({
                  product_id: undefined,
                  variant_id: undefined,
                  quantity: 1,
                  unit_cost: 0,
                  purchase_price: 0,
                  base_price: 0,
                  special_price: undefined,
                  batch_number: undefined,
                  expiry_date: undefined,
                })
              }
              icon={<PlusOutlined />}
              style={{ width: '100%', borderRadius: 8 }}
            >
              Add Product Line
            </Button>
          </div>
        )}
      </Form.List>

      <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>
        Settlement & Double-Entry Accounting
      </Typography.Title>

      <Row gutter={[16, 0]}>
        <FormInputNumber
          name='discount_amount'
          label='Discount (৳)'
          min={0}
          precision={2}
          md={12}
          lg={6}
        />
        <FormInputNumber
          name='shipping_cost'
          label='Shipping / Freight (৳)'
          min={0}
          precision={2}
          md={12}
          lg={6}
        />
        <FormInputNumber
          name='paid_amount'
          label='Paid Amount (৳)'
          min={0}
          precision={2}
          md={12}
          lg={6}
        />
        <SelectAccount
          name='payment_account_id'
          label='Disbursement Account'
          md={12}
          lg={6}
        />
        <FormInputTextArea
          name='notes'
          label='Purchase Memo / Notes'
          placeholder='Additional instructions or vendor notes'
          rows={2}
          lg={24}
          md={24}
        />
      </Row>

      <Card
        size='small'
        style={{
          marginTop: 12,
          marginBottom: 20,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
        }}
      >
        <Row gutter={[16, 8]} justify='space-between' align='middle'>
          <Col xs={12} sm={6} md={4}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Items Subtotal:
            </span>
            <div style={{ fontWeight: 600, fontSize: 15 }}>
              ৳ {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <span style={{ color: '#64748b', fontSize: 12 }}>Discount:</span>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#ff4d4f' }}>
              - ৳{' '}
              {discountAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Shipping Cost:
            </span>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#10b981' }}>
              + ৳{' '}
              {shippingCost.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Grand Total:
            </span>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#0958d9' }}>
              ৳{' '}
              {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Due to Supplier:
            </span>
            <div
              style={{
                fontWeight: 700,
                fontSize: 17,
                color: dueAmount > 0 ? '#d9383a' : '#52c41a',
              }}
            >
              ৳{' '}
              {dueAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </Col>
        </Row>
      </Card>

      <Row>
        <FromSubmit
          text={editMode ? 'Update Purchase' : 'Create Purchase'}
          loading={loading}
        />
      </Row>
    </Form>
  );
};

export default PurchaseInputs;
