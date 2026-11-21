import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Typography,
  type FormInstance,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
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
import {
  useGetPurchaseListQuery,
  useGetSinglePurchaseQuery,
} from '../../PurchaseInvoice/api/purchaseEndpoints';
import type { ICreatePurchaseReturn } from '../types/purchaseReturnTypes';

type Props = {
  onFinish: (values: ICreatePurchaseReturn) => void;
  loading: boolean;
  form: FormInstance<ICreatePurchaseReturn>;
};

const PurchaseReturnInputs = ({ onFinish, loading, form }: Props) => {
  const selectedPurchaseId = Form.useWatch('purchase_id', form);
  const items = Form.useWatch('items', form) || [];
  const refundAmount = Number(Form.useWatch('refund_amount', form) || 0);

  const { data: purchaseListRes, isLoading: isPurchasesLoading } =
    useGetPurchaseListQuery({ limit: 100 });
  const { data: singlePurchaseRes } = useGetSinglePurchaseQuery(
    selectedPurchaseId || 0,
    { skip: !selectedPurchaseId },
  );

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

  useEffect(() => {
    if (singlePurchaseRes?.data) {
      const p = singlePurchaseRes.data;
      form.setFieldsValue({
        supplier_id: p.supplier_id,
        branch_id: p.branch_id,
        warehouse_id: p.warehouse_id,
      });

      if (p.items && p.items.length > 0) {
        form.setFieldValue(
          'items',
          p.items.map((it) => ({
            purchase_item_id: it.id,
            product_id: it.product_id,
            variant_id: it.variant_id,
            quantity: 1,
            unit_cost: Number(it.unit_cost || it.purchase_price || 0),
            reason: '',
          })),
        );
      }
    }
  }, [singlePurchaseRes, form]);

  const totalReturnAmount = items.reduce((sum, item) => {
    const qty = Number(item?.quantity || 0);
    const cost = Number(item?.unit_cost || 0);
    return sum + qty * cost;
  }, 0);

  const netPayableReduction = Math.max(0, totalReturnAmount - refundAmount);

  return (
    <Form<ICreatePurchaseReturn>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{
        return_date: dayjs(),
        status: 'COMPLETED',
        refund_amount: 0,
        items: [
          {
            product_id: undefined,
            variant_id: undefined,
            quantity: 1,
            unit_cost: 0,
            reason: '',
          },
        ],
      }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item
            name='purchase_id'
            label='Target Purchase Invoice'
            rules={[{ required: true, message: 'Please select purchase invoice' }]}
          >
            <Select
              showSearch
              placeholder='Select purchase invoice'
              loading={isPurchasesLoading}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                purchaseListRes?.data?.map((p) => ({
                  label: `${p.purchase_number} - ${p.supplier_name} (৳${p.grand_total})`,
                  value: p.id,
                })) || []
              }
            />
          </Form.Item>
        </Col>

        <SelectSupplier
          name='supplier_id'
          label='Supplier'
          required
          md={12}
          lg={8}
        />
        <SelectBranch
          name='branch_id'
          label='Branch'
          md={12}
          lg={8}
        />
        <SelectWarehouse
          name='warehouse_id'
          label='Warehouse'
          md={12}
          lg={8}
        />
        <FormInputDate
          name='return_date'
          label='Return Date'
          required
          md={12}
          lg={8}
        />
        <FormInputSelect
          name='status'
          label='Return Status'
          required
          md={12}
          lg={8}
          options={[
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Cancelled', value: 'CANCELLED' },
          ]}
        />
      </Row>

      <Typography.Title level={5} style={{ marginTop: 12, marginBottom: 8 }}>
        Return Line Items
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
              const lineTotal =
                Number(currentItem?.quantity || 0) *
                Number(currentItem?.unit_cost || 0);

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
                      md={hasVariants ? 8 : 10}
                      lg={hasVariants ? 8 : 10}
                    >
                      <SelectProduct
                        {...restField}
                        name={[name, 'product_id']}
                        label='Product'
                        required
                        md={24}
                        lg={24}
                      />
                    </Col>

                    {hasVariants && (
                      <Col xs={24} sm={12} md={5} lg={5}>
                        <SelectVariant
                          {...restField}
                          name={[name, 'variant_id']}
                          label='Variant'
                          variants={variantList}
                          md={24}
                          lg={24}
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
                        label='Return Qty'
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
                            color: '#ff4d4f',
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

                    <Col xs={24} sm={24} md={24} lg={24}>
                      <FormInputText
                        {...restField}
                        name={[name, 'reason']}
                        label='Defect / Return Reason'
                        placeholder='Reason for returning this line item'
                        md={24}
                        lg={24}
                      />
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
                  quantity: 1,
                  unit_cost: 0,
                  reason: '',
                })
              }
              icon={<PlusOutlined />}
              style={{ width: '100%', borderRadius: 8 }}
            >
              Add Return Line Item
            </Button>
          </div>
        )}
      </Form.List>

      <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 8 }}>
        Settlement & Refund Details
      </Typography.Title>

      <Row gutter={[16, 0]}>
        <FormInputNumber
          name='refund_amount'
          label='Cash / Bank Refund Received (৳)'
          placeholder='0.00'
          min={0}
          precision={2}
          md={12}
          lg={8}
        />
        <SelectAccount
          name='payment_account_id'
          label='Refund Deposit Account'
          md={12}
          lg={8}
        />
        <FormInputTextArea
          name='reason'
          label='Overall Return Reason & Notes'
          placeholder='Enter vendor return explanations'
          rows={2}
          lg={8}
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
          <Col xs={12} sm={8} md={6}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Total Return Value:
            </span>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#ff4d4f' }}>
              ৳{' '}
              {totalReturnAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Refund Received:
            </span>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#10b981' }}>
              ৳{' '}
              {refundAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Vendor Payable Balance Reduction:
            </span>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0958d9' }}>
              ৳{' '}
              {netPayableReduction.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </Col>
        </Row>
      </Card>

      <Row>
        <FromSubmit text='Submit Purchase Return' loading={loading} />
      </Row>
    </Form>
  );
};

export default PurchaseReturnInputs;
