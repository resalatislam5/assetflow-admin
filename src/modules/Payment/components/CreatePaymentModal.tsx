import {
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Statistic,
  Typography,
  theme,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { closeModal } from '../../../app/features/modalSlice';
import FromSubmit from '../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import { SelectAccount } from '../../../common/SelectWithApi';
import {
  useCreatePaymentMutation,
  useGetInvoicesForPaymentSelectQuery,
} from '../api/paymentEndpoints';
import type {
  ICreatePayment,
  IInvoiceSelectForPayment,
  PaymentMethod,
  PaymentStatus,
} from '../types/paymentTypes';

const { Text } = Typography;

const PAYMENT_METHOD_OPTIONS: { label: string; value: PaymentMethod }[] = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit / Debit Card', value: 'CARD' },
  { label: 'Mobile Banking (bKash/Nagad/Rocket)', value: 'MOBILE_BANKING' },
  { label: 'Online Payment Gateway', value: 'GATEWAY' },
  { label: 'Loyalty Points', value: 'LOYALTY_POINTS' },
  { label: 'Other', value: 'OTHER' },
];

const STATUS_OPTIONS: { label: string; value: PaymentStatus }[] = [
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Authorized', value: 'AUTHORIZED' },
  { label: 'Successful', value: 'SUCCESSFUL' },
];

const GATEWAY_OPTIONS = [
  { label: 'bKash Merchant', value: 'BKASH' },
  { label: 'Nagad Gateway', value: 'NAGAD' },
  { label: 'SSLCommerz', value: 'SSLCOMMERZ' },
  { label: 'Shurjopay', value: 'SHURJOPAY' },
  { label: 'AamarPay', value: 'AAMARPAY' },
  { label: 'Stripe', value: 'STRIPE' },
  { label: 'Other Gateway', value: 'OTHER' },
];

const CARD_TYPE_OPTIONS = [
  { label: 'Visa', value: 'VISA' },
  { label: 'Mastercard', value: 'MASTERCARD' },
  { label: 'American Express (AMEX)', value: 'AMEX' },
  { label: 'UnionPay', value: 'UNIONPAY' },
  { label: 'Other', value: 'OTHER' },
];

interface Props {
  defaultInvoiceId?: number | string;
  defaultDueAmount?: number;
}

const CreatePaymentModal = ({ defaultInvoiceId, defaultDueAmount }: Props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ICreatePayment>();
  const dispatch = useAppDispatch();
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const { data: invoiceSelectData, isLoading: isLoadingInvoices } =
    useGetInvoicesForPaymentSelectQuery();
  const invoiceOptions = invoiceSelectData?.data || [];

  const [selectedInvoice, setSelectedInvoice] = useState<
    IInvoiceSelectForPayment | undefined
  >();

  const selectedMethod = Form.useWatch('payment_method', form);
  const enteredAmount = Number(Form.useWatch('amount', form) || 0);
  const enteredTendered = Number(Form.useWatch('tendered_amount', form) || 0);
  const enteredFee = Number(Form.useWatch('gateway_fee', form) || 0);

  const calculatedChange = useMemo(() => {
    if (selectedMethod !== 'CASH') return 0;
    if (enteredTendered > enteredAmount && enteredAmount > 0) {
      return Math.round((enteredTendered - enteredAmount) * 100) / 100;
    }
    return 0;
  }, [selectedMethod, enteredTendered, enteredAmount]);

  const calculatedNet = useMemo(() => {
    return Math.max(0, Math.round((enteredAmount - enteredFee) * 100) / 100);
  }, [enteredAmount, enteredFee]);

  useEffect(() => {
    form.setFieldValue('change_amount', calculatedChange);
  }, [calculatedChange, form]);

  useEffect(() => {
    if (defaultInvoiceId) {
      form.setFieldValue('invoice_id', Number(defaultInvoiceId));
      if (defaultDueAmount && defaultDueAmount > 0) {
        form.setFieldValue('amount', defaultDueAmount);
      }
    }
  }, [defaultInvoiceId, defaultDueAmount, form]);

  const handleInvoiceChange = (invId: number) => {
    const found = invoiceOptions.find((inv: IInvoiceSelectForPayment) => inv.id === invId);
    setSelectedInvoice(found);
    if (found) {
      if (found.branch_id) {
        form.setFieldValue('branch_id', found.branch_id);
      }
      if (found.customer_id) {
        form.setFieldValue('customer_id', found.customer_id);
      }
      const due = Number(found.due_amount || 0);
      if (due > 0) {
        form.setFieldValue('amount', due);
      }
    }
  };

  const onFinish = async (values: ICreatePayment) => {
    const payload: ICreatePayment = {
      ...values,
      amount: Number(values.amount),
      tendered_amount:
        values.tendered_amount !== undefined && values.tendered_amount !== null
          ? Number(values.tendered_amount)
          : undefined,
      change_amount: calculatedChange,
      gateway_fee: values.gateway_fee ? Number(values.gateway_fee) : 0,
      status: values.status || 'COMPLETED',
      currency: values.currency || 'BDT',
    };

    const res = await createPayment(payload);
    if ('data' in res && res.data?.success) {
      dispatch(closeModal());
    }
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{
        payment_method: 'CASH',
        status: 'COMPLETED',
        currency: 'BDT',
        gateway_fee: 0,
        change_amount: 0,
      }}
    >
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Form.Item
            name='invoice_id'
            label='Select Sales Invoice'
            rules={[{ required: true, message: 'Please select an invoice' }]}
          >
            <Select
              showSearch
              placeholder='Search by invoice number or customer...'
              loading={isLoadingInvoices}
              onChange={handleInvoiceChange}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={invoiceOptions.map((inv: IInvoiceSelectForPayment) => ({
                value: inv.id,
                label: `${inv.invoice_number} — ${inv.customer_name || 'Walk-in'} (Due: ৳${inv.due_amount})`,
              }))}
            />
          </Form.Item>
        </Col>

        {selectedInvoice && (
          <Col span={24} style={{ marginBottom: 16 }}>
            <Card
              size='small'
              style={{
                background: token.colorFillAlter,
                borderRadius: token.borderRadius,
              }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title='Total Amount'
                    value={selectedInvoice.grand_total_amount}
                    prefix='৳'
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title='Already Paid'
                    value={selectedInvoice.paid_amount}
                    prefix='৳'
                    valueStyle={{ fontSize: 16, color: token.colorSuccess }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title='Due Balance'
                    value={selectedInvoice.due_amount}
                    prefix='৳'
                    valueStyle={{ fontSize: 16, color: token.colorError }}
                  />
                </Col>
                <Col span={6}>
                  <Text type='secondary'>Customer:</Text>
                  <div>
                    <Text strong>{selectedInvoice.customer_name || 'Walk-in'}</Text>
                  </div>
                  {selectedInvoice.customer_phone && (
                    <Text type='secondary'>{selectedInvoice.customer_phone}</Text>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        )}

        <FormInputSelect
          name='payment_method'
          label='Payment Method'
          required
          xs={24}
          sm={12}
          options={PAYMENT_METHOD_OPTIONS}
        />

        <SelectAccount
          name='account_id'
          label='Payment Account'
          placeholder='Select financial account'
          xs={24}
          sm={12}
          required={selectedMethod === 'CASH' || selectedMethod === 'CARD' || selectedMethod === 'MOBILE_BANKING'}
        />

        <FormInputNumber
          name='amount'
          label='Payment Amount (BDT)'
          required
          min={0.01}
          placeholder='0.00'
          xs={24}
          sm={12}
        />

        <FormInputSelect
          name='status'
          label='Payment Status'
          required
          xs={24}
          sm={12}
          options={STATUS_OPTIONS}
        />

        {selectedMethod === 'CASH' && (
          <>
            <FormInputNumber
              name='tendered_amount'
              label='Tendered Amount (Customer Cash)'
              min={0}
              placeholder='0.00'
              xs={24}
              sm={12}
            />
            <Col xs={24} sm={12}>
              <Form.Item label='Change Return Amount'>
                <Card size='small' style={{ background: token.colorFillAlter }}>
                  <Text strong style={{ fontSize: 16, color: token.colorWarning }}>
                    ৳{calculatedChange.toFixed(2)}
                  </Text>
                </Card>
              </Form.Item>
            </Col>
          </>
        )}

        {selectedMethod === 'CARD' && (
          <>
            <FormInputSelect
              name='card_type'
              label='Card Type'
              xs={24}
              sm={12}
              options={CARD_TYPE_OPTIONS}
            />
            <FormInputText
              name='card_last_four'
              label='Card Last 4 Digits'
              placeholder='e.g. 4242'
              xs={24}
              sm={12}
            />
            <FormInputText
              name='bank_name'
              label='Bank Name'
              placeholder='e.g. BRAC Bank, City Bank'
              xs={24}
              sm={12}
            />
            <FormInputText
              name='terminal_id'
              label='POS Terminal ID'
              placeholder='e.g. POS-TERM-01'
              xs={24}
              sm={12}
            />
          </>
        )}

        {(selectedMethod === 'GATEWAY' || selectedMethod === 'MOBILE_BANKING') && (
          <>
            <FormInputSelect
              name='gateway'
              label='Payment Gateway / Channel'
              xs={24}
              sm={12}
              options={GATEWAY_OPTIONS}
            />
            <FormInputText
              name='gateway_trx_id'
              label='Gateway Transaction ID'
              placeholder='e.g. 9B54A8129C'
              xs={24}
              sm={12}
            />
            <FormInputNumber
              name='gateway_fee'
              label='Gateway Processing Fee'
              min={0}
              placeholder='0.00'
              xs={24}
              sm={12}
            />
            <Col xs={24} sm={12}>
              <Form.Item label='Net Received Amount'>
                <Card size='small' style={{ background: token.colorFillAlter }}>
                  <Text strong style={{ fontSize: 16, color: token.colorSuccess }}>
                    ৳{calculatedNet.toFixed(2)}
                  </Text>
                </Card>
              </Form.Item>
            </Col>
          </>
        )}

        <Divider style={{ margin: '12px 0' }}>
          Additional Details
        </Divider>

        <FormInputText
          name='transaction_ref'
          label='Custom Transaction Ref (Leave blank for auto-gen)'
          placeholder='e.g. TRX-CUSTOM-001'
          xs={24}
          sm={12}
        />

        <FormInputDate
          name='paid_at'
          label='Paid At (Date & Time)'
          showTime
          xs={24}
          sm={12}
        />

        <FormInputTextArea
          name='notes'
          label='Internal Notes'
          placeholder='Enter optional payment notes or memo...'
          xs={24}
        />
      </Row>

      <FromSubmit loading={isLoading} text='Record Payment' />
    </Form>
  );
};

export default CreatePaymentModal;
