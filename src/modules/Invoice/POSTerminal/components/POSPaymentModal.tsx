import { CheckCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { SelectAccount } from '../../../../common/SelectWithApi';
import { useCreatePOSInvoiceMutation } from '../api/posTerminalEndpoints';
import type { IPOSCartItem, IPOSCompletedOrder } from '../types/posTerminalTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  grandTotal: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  cartItems: IPOSCartItem[];
  customerId?: number;
  branchId?: number;
  onSuccess: (order: IPOSCompletedOrder) => void;
}

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000];

const POSPaymentModal = ({
  open,
  onClose,
  grandTotal,
  subtotal,
  discountAmount,
  taxAmount,
  cartItems,
  customerId,
  branchId,
  onSuccess,
}: Props) => {
  const [form] = Form.useForm();
  const [tenderedAmount, setTenderedAmount] = useState<number>(grandTotal);
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [createPOSInvoice, { isLoading }] = useCreatePOSInvoiceMutation();

  useEffect(() => {
    if (open) {
      setTenderedAmount(grandTotal);
      setPaymentMethod('CASH');
      form.setFieldsValue({
        tendered_amount: grandTotal,
        payment_method: 'CASH',
        customer_notes: '',
        account_id: undefined,
      });
    }
  }, [open, grandTotal, form]);

  const changeAmount = Math.max(0, Number(tenderedAmount || 0) - grandTotal);

  const handleQuickAmount = (amount: number) => {
    setTenderedAmount(amount);
    form.setFieldsValue({ tendered_amount: amount });
  };

  const handleFinish = async (values: {
    tendered_amount: number;
    payment_method: string;
    account_id?: number;
    customer_notes?: string;
  }) => {
    if (!cartItems.length) {
      message.error('Cart is empty');
      return;
    }

    const payloadTendered = Number(values.tendered_amount ?? grandTotal);
    if (payloadTendered < grandTotal && values.payment_method === 'CASH') {
      message.error('Tendered cash cannot be less than total payable amount');
      return;
    }

    try {
      const paymentType =
        values.payment_method === 'BKASH' || values.payment_method === 'NAGAD'
          ? 'MOBILE_BANKING'
          : values.payment_method === 'CARD'
            ? 'CARD'
            : values.payment_method === 'BANK'
              ? 'BANK'
              : 'CASH';

      const res = await createPOSInvoice({
        customer_id: customerId,
        branch_id: branchId,
        account_id: values.account_id ? Number(values.account_id) : undefined,
        payment_method: values.payment_method,
        payment_type: paymentType,
        subtotal_amount: subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        tendered_amount: payloadTendered,
        paid_amount: grandTotal,
        customer_notes: values.customer_notes,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_title: item.product_title,
          variant_name: item.variant_name,
          sku: item.sku,
          unit_price: item.unit_price,
          purchase_price: item.purchase_price,
          quantity: item.quantity,
          discount_amount: item.discount_amount,
          tax_amount: item.tax_amount,
        })),
      }).unwrap();

      if (res.success && res.data) {
        message.success('Payment completed successfully');
        onSuccess(res.data);
      }
    } catch {
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      title='Payment & Checkout'
      destroyOnClose
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{
          tendered_amount: grandTotal,
          payment_method: 'CASH',
        }}
      >
        <Card
          size='small'
          style={{
            background: '#f6ffed',
            borderColor: '#b7eb8f',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 13, color: '#389e0d', fontWeight: 500 }}>
            Total Payable Amount
          </div>
          <Typography.Title level={2} style={{ margin: '4px 0 0 0', color: '#237804' }}>
            ৳{grandTotal.toLocaleString()}
          </Typography.Title>
        </Card>

        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name='payment_method'
              label='Payment Method'
              rules={[{ required: true, message: 'Please select payment method' }]}
            >
              <Radio.Group
                buttonStyle='solid'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value='CASH' style={{ flex: 1, textAlign: 'center' }}>
                  CASH
                </Radio.Button>
                <Radio.Button value='CARD' style={{ flex: 1, textAlign: 'center' }}>
                  CARD
                </Radio.Button>
                <Radio.Button value='BKASH' style={{ flex: 1, textAlign: 'center' }}>
                  BKASH
                </Radio.Button>
                <Radio.Button value='NAGAD' style={{ flex: 1, textAlign: 'center' }}>
                  NAGAD
                </Radio.Button>
                <Radio.Button value='BANK' style={{ flex: 1, textAlign: 'center' }}>
                  BANK
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name='tendered_amount'
              label='Tendered Cash (Amount Received)'
              rules={[{ required: true, message: 'Please enter received amount' }]}
            >
              <InputNumber
                style={{ width: '100%', fontSize: 16 }}
                size='large'
                min={0}
                precision={2}
                prefix='৳'
                onChange={(val) => setTenderedAmount(Number(val || 0))}
              />
            </Form.Item>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                Quick Cash Buttons:
              </div>
              <Space wrap size='small'>
                <Button size='small' onClick={() => handleQuickAmount(grandTotal)}>
                  Exact (৳{grandTotal})
                </Button>
                {QUICK_AMOUNTS.map((amt) => (
                  <Button
                    key={amt}
                    size='small'
                    onClick={() => handleQuickAmount(amt)}
                  >
                    ৳{amt}
                  </Button>
                ))}
              </Space>
            </div>

            <SelectAccount
              name='account_id'
              label='Deposit Account'
              placeholder='Select account (Defaults to Cash In Hand)'
              allowClear
            />

            <Form.Item name='customer_notes' label='Notes / Reference'>
              <Input.TextArea
                rows={2}
                placeholder='Optional notes or transaction ID'
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Card
              size='small'
              style={{
                background: '#fafafa',
                borderColor: '#e8e8e8',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Typography.Title level={5} style={{ marginTop: 0 }}>
                  Billing Breakdown
                </Typography.Title>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#666' }}>Subtotal:</span>
                  <strong>৳{subtotal.toLocaleString()}</strong>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#cf1322' }}>
                    <span>Discount:</span>
                    <strong>-৳{discountAmount.toLocaleString()}</strong>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#666' }}>VAT / Tax:</span>
                    <strong>+৳{taxAmount.toLocaleString()}</strong>
                  </div>
                )}
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 }}>
                  <span>Grand Total:</span>
                  <strong style={{ color: '#0958d9' }}>৳{grandTotal.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#666' }}>Tendered:</span>
                  <strong>৳{Number(tenderedAmount || 0).toLocaleString()}</strong>
                </div>

                <Card
                  size='small'
                  style={{
                    background: changeAmount > 0 ? '#e6f7ff' : '#f5f5f5',
                    borderColor: changeAmount > 0 ? '#91d5ff' : '#d9d9d9',
                    marginTop: 12,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#0958d9', fontWeight: 500 }}>
                    Change Return to Customer
                  </div>
                  <Typography.Title level={3} style={{ margin: '2px 0 0 0', color: '#0958d9' }}>
                    ৳{changeAmount.toFixed(2)}
                  </Typography.Title>
                </Card>
              </div>

              <div style={{ marginTop: 24 }}>
                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  block
                  loading={isLoading}
                  icon={<CheckCircleOutlined />}
                  style={{
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    height: 48,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Complete Sale
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default POSPaymentModal;
