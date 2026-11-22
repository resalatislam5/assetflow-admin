import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  type FormInstance,
} from 'antd';
import {
  DeleteOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import {
  SelectBranch,
  SelectCustomer,
  SelectWarehouse,
} from '../../../../common/SelectWithApi';
import { useActiveLocation } from '../../../../common/hooks/useActiveLocation';
import { useGetProductSelectQuery } from '../../../../common/SelectWithApi/SelectEndpoints';
import { useGetSingleCustomerQuery } from '../../../Customer/api/customerEndpoints';

import type { ICreateOrder } from '../types/invoiceTypes';

type Props = {
  onFinish: (values: ICreateOrder) => void;
  form: FormInstance<ICreateOrder>;
  loading: boolean;
  editMode?: boolean;
};

const PAYMENT_METHOD_OPTIONS = [
  { value: 'COD', label: 'Cash On Delivery (COD)' },
  { value: 'CASH_ON_DELIVERY', label: 'Cash On Delivery' },
  { value: 'BKASH', label: 'bKash' },
  { value: 'NAGAD', label: 'Nagad' },
  { value: 'ROCKET', label: 'Rocket' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CREDIT_CARD', label: 'Credit / Debit Card' },
];

const InvoiceInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const { isBranch, isWarehouse } = useActiveLocation();
  const { data: productData, isLoading: isProductsLoading } =
    useGetProductSelectQuery();

  const products = productData?.data || [];

  const customerId = Form.useWatch('customer_id', form);
  const { data: customerData, isLoading: isCustomerLoading } =
    useGetSingleCustomerQuery(customerId as string | number, {
      skip: !customerId,
    });

  const watchedItems = Form.useWatch('items', form) || [];
  const watchedShipping = Form.useWatch('shipping_amount', form);
  const watchedDiscount = Form.useWatch('discount_amount', form);

  const subtotal = (watchedItems || []).reduce((sum, item) => {
    return sum + Number(item?.unit_price || 0) * Number(item?.quantity || 0);
  }, 0);
  const shipping = Number(watchedShipping || 0);
  const discount = Number(watchedDiscount || 0);
  const grandTotal = Math.max(0, subtotal + shipping - discount);

  useEffect(() => {
    if (!editMode && customerData?.data) {
      const currentName = form.getFieldValue('recipient_name');
      const c = customerData.data;

      if (!currentName) {
        form.setFieldsValue({
          recipient_name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.company_name || '',
          recipient_phone: c.phone || '',
          street_address: c.address || '',
        });
      }
    }
  }, [customerData, editMode, form]);

  const handleProductSelect = (
    index: number,
    productId: number | string,
  ) => {
    const selected = products.find((p) => String(p.id) === String(productId));
    if (selected) {
      const currentItems = form.getFieldValue('items') || [];
      const updated = [...currentItems];
      updated[index] = {
        ...updated[index],
        product_id: selected.id,
        product_title: selected.title,
        sku: selected.sku,
        unit_price: Number(selected.base_price || 0),
        quantity: updated[index]?.quantity || 1,
        variant_id: undefined,
        variant_name: '',
      };
      form.setFieldsValue({ items: updated });
    }
  };

  const handleVariantSelect = (
    index: number,
    variantId?: number | string,
  ) => {
    const currentItems = form.getFieldValue('items') || [];
    const item = currentItems[index];
    if (!item) return;

    const selectedProduct = products.find((p) => String(p.id) === String(item.product_id));
    const selectedVariant = selectedProduct?.variants?.find(
      (v) => String(v.id) === String(variantId),
    );

    const updated = [...currentItems];
    if (selectedVariant) {
      updated[index] = {
        ...updated[index],
        variant_id: selectedVariant.id,
        variant_name: selectedVariant.variant_name,
        sku: selectedVariant.sku,
        unit_price:
          selectedVariant.price !== undefined
            ? Number(selectedVariant.price)
            : updated[index]?.unit_price || 0,
      };
    } else {
      updated[index] = {
        ...updated[index],
        variant_id: undefined,
        variant_name: '',
        sku: selectedProduct?.sku || updated[index]?.sku || '',
        unit_price:
          selectedProduct?.base_price !== undefined
            ? Number(selectedProduct.base_price)
            : updated[index]?.unit_price || 0,
      };
    }
    form.setFieldsValue({ items: updated });
  };

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        payment_method: 'COD',
        shipping_amount: 60,
        discount_amount: 0,
        items: [
          {
            product_id: undefined,
            variant_id: undefined,
            product_title: '',
            variant_name: '',
            sku: '',
            unit_price: 0,
            quantity: 1,
          },
        ],
      }}
    >
      <Card
        size='small'
        title='1. Customer & Payment Information'
        bordered
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 12]}>
          <SelectCustomer
            name='customer_id'
            label='Customer'
            required
            disabled={editMode}
            lg={6}
          />
          {!isBranch && (
            <SelectBranch
              name='branch_id'
              label='Branch'
              placeholder='Select branch'
              allowClear
              lg={6}
            />
          )}
          {!isWarehouse && (
            <SelectWarehouse
              name='warehouse_id'
              label='Fulfillment Warehouse'
              placeholder='Auto-assign or select warehouse'
              allowClear
              lg={6}
            />
          )}
          <FormInputSelect
            name='payment_method'
            label='Payment Method'
            required
            options={PAYMENT_METHOD_OPTIONS}
            lg={6}
          />
        </Row>
      </Card>

      {customerId && customerData?.data?.address && (
        <Card
          size='small'
          bordered
          style={{
            marginBottom: 16,
            background: '#f8fafc',
            borderColor: '#cbd5e1',
          }}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <EnvironmentOutlined style={{ color: '#2563eb' }} />
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  Customer Profile Address
                </span>
                {isCustomerLoading && <Spin size='small' />}
              </Space>
              <Button
                size='small'
                type='link'
                onClick={() => {
                  const c = customerData.data;
                  if (c) {
                    form.setFieldsValue({
                      recipient_name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.company_name || '',
                      recipient_phone: c.phone || '',
                      street_address: c.address || '',
                    });
                  }
                }}
              >
                Use Profile Address
              </Button>
            </div>
          }
        >
          <Typography.Text type='secondary'>
            {customerData.data.address}
          </Typography.Text>
        </Card>
      )}

      <Card
        size='small'
        title='2. Shipping & Delivery Address'
        bordered
        style={{ marginBottom: 16 }}
      >
        <Form.Item name='division' hidden>
          <input />
        </Form.Item>
        <Form.Item name='district' hidden>
          <input />
        </Form.Item>
        <Form.Item name='upazila_thana' hidden>
          <input />
        </Form.Item>
        <Form.Item name='upazila_name' hidden>
          <input />
        </Form.Item>
        <Row gutter={[12, 12]}>
          <FormInputText
            name='recipient_name'
            label='Recipient Name'
            required
            placeholder='Full name'
            lg={12}
          />
          <FormInputText
            name='recipient_phone'
            label='Recipient Phone'
            required
            placeholder='+8801XXXXXXXXX'
            lg={12}
          />
          <FormInputText
            name='division'
            label='Division'
            placeholder='Enter division'
            lg={8}
          />
          <FormInputText
            name='district'
            label='District'
            placeholder='Enter district'
            lg={8}
          />
          <FormInputText
            name='upazila_thana'
            label='Upazila / Area'
            placeholder='Enter area / upazila'
            lg={8}
          />
          <FormInputText
            name='street_address'
            label='Street Address'
            required
            placeholder='House, road, area details'
            lg={24}
          />
        </Row>
      </Card>

      <Card
        size='small'
        title='3. Order Items'
        bordered
        style={{ marginBottom: 16 }}
      >
        <Form.List name='items'>
          {(fields, { add, remove }) => (
            <div>
              {fields.map(({ key, name, ...restField }, index) => {
                const currentProductId = watchedItems[index]?.product_id;
                const currentProduct = products.find(
                  (p) => String(p.id) === String(currentProductId),
                );
                const productVariants = currentProduct?.variants || [];
                const hasProductVariants = productVariants.length > 0;
                const itemQty = Number(watchedItems[index]?.quantity || 1);
                const itemPrice = Number(watchedItems[index]?.unit_price || 0);
                const itemTotal = itemQty * itemPrice;

                return (
                  <Card
                    key={key}
                    size='small'
                    style={{
                      marginBottom: 10,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                    }}
                  >
                    <Row gutter={[12, 8]} align='middle'>
                      <Col xs={24} sm={hasProductVariants ? 7 : 9}>
                        <Form.Item
                          {...restField}
                          name={[name, 'product_id']}
                          label='Select Product'
                          rules={[{ required: true, message: 'Product is required' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Select
                            showSearch
                            placeholder='Select product'
                            loading={isProductsLoading}
                            filterOption={(input, option) =>
                              (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={products.map((p) => ({
                              label: `${p.title} (${p.sku}) - ৳${p.base_price ?? 0}`,
                              value: p.id,
                            }))}
                            onChange={(val) => handleProductSelect(index, val)}
                          />
                        </Form.Item>
                      </Col>

                      {hasProductVariants && (
                        <Col xs={24} sm={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'variant_id']}
                            label='Variant'
                            rules={[{ required: true, message: 'Variant is required' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              allowClear
                              placeholder='Choose variant'
                              options={productVariants.map((v) => ({
                                label: `${v.variant_name} (${v.sku})${
                                  v.price !== undefined ? ` - ৳${v.price}` : ''
                                }`,
                                value: v.id,
                              }))}
                              onChange={(val) => handleVariantSelect(index, val)}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      <Col xs={12} sm={hasProductVariants ? 4 : 5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unit_price']}
                          label='Unit Price (৳)'
                          rules={[{ required: true, message: 'Required' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            min={0.01}
                            placeholder='Price'
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={10} sm={hasProductVariants ? 3 : 4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label='Quantity'
                          rules={[{ required: true, message: 'Required' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            min={1}
                            placeholder='Qty'
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={12} sm={3} style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#888' }}>Total</div>
                        <strong style={{ color: '#0958d9', fontSize: 13 }}>
                          ৳{itemTotal.toLocaleString()}
                        </strong>
                      </Col>

                      <Col xs={2} sm={hasProductVariants ? 2 : 2} style={{ textAlign: 'center' }}>
                        {fields.length > 1 && (
                          <Button
                            type='text'
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card>
                );
              })}

              <Button
                type='dashed'
                onClick={() =>
                  add({
                    product_id: undefined,
                    variant_id: undefined,
                    product_title: '',
                    variant_name: '',
                    sku: '',
                    unit_price: 0,
                    quantity: 1,
                  })
                }
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 4 }}
              >
                Add Another Product
              </Button>
            </div>
          )}
        </Form.List>
      </Card>

      <Card
        size='small'
        title='4. Pricing & Remarks'
        bordered
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[12, 12]}>
          <FormInputNumber
            name='shipping_amount'
            label='Shipping Fee (৳)'
            min={0}
            lg={6}
          />
          <FormInputNumber
            name='discount_amount'
            label='Discount Amount (৳)'
            min={0}
            lg={6}
          />
          <FormInputNumber
            name='points_to_redeem'
            label='Redeem Reward Points'
            placeholder='0'
            min={0}
            disabled={editMode}
            lg={6}
          />
          <FormInputText
            name='coupon_code'
            label='Coupon Code'
            placeholder='Optional coupon'
            lg={6}
          />
          <FormInputTextArea
            name='customer_notes'
            label='Customer Notes'
            rows={2}
            placeholder='Notes from customer'
            lg={12}
          />
          <FormInputTextArea
            name='admin_notes'
            label='Internal Admin Remarks'
            rows={2}
            placeholder='Internal remarks'
            lg={12}
          />
        </Row>
      </Card>

      <Card
        size='small'
        style={{
          marginBottom: 20,
          background: '#fafafa',
          borderColor: '#adc6ff',
          borderRadius: 8,
        }}
      >
        <Row gutter={[16, 8]} justify='space-between' align='middle'>
          <Col xs={24} md={12}>
            <Space size='large'>
              <div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Items Subtotal: </span>
                <strong style={{ fontSize: 14 }}>৳{subtotal.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ fontSize: 12, color: '#64748b' }}>Shipping: </span>
                <strong style={{ fontSize: 14 }}>৳{shipping.toLocaleString()}</strong>
              </div>
              {discount > 0 && (
                <div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Discount: </span>
                  <strong style={{ fontSize: 14, color: '#16a34a' }}>-৳{discount.toLocaleString()}</strong>
                </div>
              )}
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 14, color: '#475569', marginRight: 12 }}>Grand Total:</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#1d4ed8' }}>
              ৳{grandTotal.toLocaleString()}
            </span>
          </Col>
        </Row>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <FromSubmit
          text={editMode ? 'Update Order Details' : 'Place & Save Order'}
          loading={loading}
        />
      </div>
    </Form>
  );
};

export default InvoiceInputs;
