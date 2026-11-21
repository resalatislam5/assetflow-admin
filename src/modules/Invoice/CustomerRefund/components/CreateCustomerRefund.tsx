import {
  Alert,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Statistic,
  Typography,
  theme,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormFileUpload,
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import {
  SelectAccount,
  SelectBranch,
  SelectCustomer,
  SelectOrder,
} from '../../../../common/SelectWithApi';
import type { IOrderSelect } from '../../../../common/SelectWithApi';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import { useCreateCustomerRefundMutation } from '../api/customerRefundEndpoints';
import type {
  CustomerRefundChargeType,
  CustomerRefundPaymentType,
  CustomerRefundReason,
  ICreateCustomerRefund,
} from '../types/customerRefundTypes';
import dayjs from 'dayjs';

const { Text } = Typography;

const PAYMENT_TYPE_OPTIONS: {
  label: string;
  value: CustomerRefundPaymentType;
}[] = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Bank Transfer', value: 'BANK' },
  { label: 'Mobile Banking (bKash/Nagad/Rocket)', value: 'MOBILE_BANKING' },
  { label: 'Card Payment', value: 'CARD' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Other', value: 'OTHER' },
];

const REFUND_REASON_OPTIONS: { label: string; value: CustomerRefundReason }[] =
  [
    { label: 'Order Cancelled', value: 'ORDER_CANCELLED' },
    { label: 'Order Return', value: 'ORDER_RETURN' },
    { label: 'Overpayment', value: 'OVERPAYMENT' },
    { label: 'Product Unavailable', value: 'PRODUCT_UNAVAILABLE' },
    { label: 'Other', value: 'OTHER' },
  ];

const CHARGE_TYPE_OPTIONS = [
  { label: 'Fixed', value: 'FIXED' },
  { label: 'Percentage (%)', value: 'PERCENTAGE' },
];

type Props = {
  defaultCustomerId?: number | string;
  defaultOrderId?: number | string;
  defaultAmount?: number;
};

const CreateCustomerRefund = ({
  defaultCustomerId,
  defaultOrderId,
  defaultAmount,
}: Props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ICreateCustomerRefund>();
  const dispatch = useAppDispatch();
  const [createRefund, { isLoading }] = useCreateCustomerRefundMutation();

  const [selectedOrderInfo, setSelectedOrderInfo] = useState<IOrderSelect | undefined>();

  const selectedCustomerId = Form.useWatch('customer_id', form);
  const selectedPaymentType = Form.useWatch('payment_type', form);
  const amount = Number(Form.useWatch('amount', form) || 0);
  const chargeType = (Form.useWatch('charge_type', form) ||
    'FIXED') as CustomerRefundChargeType;
  const chargeRate = Number(Form.useWatch('charge_rate', form) || 0);

  const prevCustomerIdRef = useRef<number | string | undefined>(
    defaultCustomerId,
  );
  const prevPaymentTypeRef = useRef<CustomerRefundPaymentType | undefined>(
    'MOBILE_BANKING',
  );

  useEffect(() => {
    if (
      prevCustomerIdRef.current &&
      prevCustomerIdRef.current !== selectedCustomerId
    ) {
      form.setFieldsValue({
        order_id: undefined,
        return_id: undefined,
      });
    }
    prevCustomerIdRef.current = selectedCustomerId;
  }, [selectedCustomerId, form]);

  useEffect(() => {
    if (
      prevPaymentTypeRef.current &&
      prevPaymentTypeRef.current !== selectedPaymentType
    ) {
      form.setFieldValue('account_id', undefined);
    }
    prevPaymentTypeRef.current = selectedPaymentType;
  }, [selectedPaymentType, form]);

  const chargeAmount = useMemo(() => {
    if (chargeRate <= 0) return 0;
    if (chargeType === 'PERCENTAGE') {
      return Math.round(((amount * chargeRate) / 100) * 100) / 100;
    }
    return chargeRate;
  }, [amount, chargeType, chargeRate]);

  const netAmount = useMemo(() => {
    return Math.round((amount + chargeAmount) * 100) / 100;
  }, [amount, chargeAmount]);

  const handleOrderSelect = (order: IOrderSelect) => {
    setSelectedOrderInfo(order);
    if (order.return_id) {
      form.setFieldValue('return_id', Number(order.return_id));
      form.setFieldValue('refund_reason', 'ORDER_RETURN');
    }
    if (Number(order.return_refund_amount || 0) > 0) {
      form.setFieldValue('amount', Number(order.return_refund_amount));
    } else if (Number(order.paid_amount || 0) > 0) {
      const paid = Number(order.paid_amount);
      const shipping = Number(order.shipping_amount || 0);
      if (order.delivery_charge_treatment === 'DEDUCT_DELIVERY') {
        form.setFieldValue('amount', Math.max(0, paid - shipping));
      } else {
        form.setFieldValue('amount', paid);
      }
    }
  };

  const onFinish = async (values: ICreateCustomerRefund) => {
    const rawPayload: Record<string, unknown> = {
      ...values,
      customer_id: Number(values.customer_id),
      branch_id: values.branch_id ? Number(values.branch_id) : undefined,
      order_id: values.order_id ? Number(values.order_id) : undefined,
      invoice_id: values.order_id ? Number(values.order_id) : undefined,
      return_id: values.return_id ? Number(values.return_id) : undefined,
      account_id: Number(values.account_id),
      amount: Number(values.amount),
      charge_type: values.charge_type || 'FIXED',
      charge_rate: Number(values.charge_rate || 0),
      refund_date: values.refund_date
        ? dayjs(values.refund_date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      refund_reason: values.refund_reason || 'ORDER_CANCELLED',
      status: 'COMPLETED',
    };

    const formData = sanitizeFormData(rawPayload, { fileKeys: ['image'] });

    const res = await createRefund(formData);
    if ('data' in res && res.data?.success) {
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          customer_id: defaultCustomerId,
          order_id: defaultOrderId,
          amount: defaultAmount,
          payment_type: 'MOBILE_BANKING',
          charge_type: 'FIXED',
          charge_rate: 0,
          refund_date: dayjs(),
          refund_reason: 'ORDER_CANCELLED',
        }}
      >
        <Form.Item name='return_id' hidden>
          <Input />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <SelectCustomer name='customer_id' label='Customer' required lg={8} />

          <SelectBranch name='branch_id' label='Branch' placeholder='Select branch' lg={8} />

          <SelectOrder
            name='order_id'
            label='Invoice (Optional)'
            customer_id={selectedCustomerId}
            refundable_returns_only={true}
            onSelectOrder={handleOrderSelect}
            lg={8}
          />

          {selectedOrderInfo && (
            <Col span={24} style={{ marginBottom: 12 }}>
              <Alert
                type='info'
                showIcon
                message={`Selected Invoice #${selectedOrderInfo.invoice_number || selectedOrderInfo.order_number} (${selectedOrderInfo.status})`}
                description={
                  <Row gutter={[16, 4]} style={{ marginTop: 4 }}>
                    <Col xs={12} sm={6}>
                      <Text type='secondary'>Total:</Text>{' '}
                      <Text strong>
                        BDT {Number(selectedOrderInfo.grand_total_amount || 0).toFixed(2)}
                      </Text>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Text type='secondary'>Paid:</Text>{' '}
                      <Text strong>
                        BDT {Number(selectedOrderInfo.paid_amount || 0).toFixed(2)}
                      </Text>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Text type='secondary'>Delivery Fee:</Text>{' '}
                      <Text strong>
                        BDT {Number(selectedOrderInfo.shipping_amount || 0).toFixed(2)}
                      </Text>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Text type='secondary'>Treatment:</Text>{' '}
                      <Text strong>
                        {selectedOrderInfo.delivery_charge_treatment === 'DEDUCT_DELIVERY'
                          ? 'Deduct Delivery (Customer Bears)'
                          : 'Refund Full (Company Bears)'}
                      </Text>
                    </Col>
                  </Row>
                }
              />
            </Col>
          )}

          <FormInputSelect
            name='payment_type'
            label='Payment Method'
            required
            options={PAYMENT_TYPE_OPTIONS}
            placeholder='Select payment method'
            lg={8}
          />

          <SelectAccount
            name='account_id'
            label='Refund From (Account)'
            required
            accountType={
              selectedPaymentType === 'CASH' ||
              selectedPaymentType === 'BANK' ||
              selectedPaymentType === 'MOBILE_BANKING'
                ? selectedPaymentType
                : undefined
            }
            placeholder='Select Account'
            lg={8}
          />

          <FormInputSelect
            name='refund_reason'
            label='Refund Reason'
            required
            options={REFUND_REASON_OPTIONS}
            placeholder='Select reason'
            lg={8}
          />

          <FormInputDate
            name='refund_date'
            label='Refund Date'
            required
            format='DD MMM YYYY'
            lg={8}
          />

          <FormInputNumber
            name='amount'
            label='Refund Amount'
            required
            min={1}
            precision={2}
            placeholder='0.00'
            lg={8}
          />

          <FormInputSelect
            name='charge_type'
            label='Fee / Charge Type'
            options={CHARGE_TYPE_OPTIONS}
            placeholder='Select charge type'
            lg={8}
          />

          <FormInputNumber
            name='charge_rate'
            label={
              chargeType === 'PERCENTAGE' ? 'Charge Rate (%)' : 'Charge Amount'
            }
            min={0}
            precision={2}
            placeholder='0.00'
            lg={8}
          />

          <FormInputText
            name='customer_account_details'
            label='Customer Account / Number'
            required={selectedPaymentType !== 'CASH'}
            placeholder='e.g. 017XXXXXXXX (bKash) or Bank Info'
            lg={8}
          />

          <FormInputText
            name='reference'
            label='Transaction ID / Reference'
            placeholder='TrxID / Bank Slip Reference'
            lg={8}
          />

          <FormFileUpload
            name='image'
            label='Payment Receipt / Slip Image'
            accept='image/*'
            maxCount={1}
            span={24}
            lg={8}
          />

          <FormInputTextArea
            name='notes'
            label='Notes / Remarks'
            placeholder='Optional refund note'
            rows={2}
            xs={24}
            lg={24}
          />

          <Col span={24}>
            <Card
              size='small'
              style={{
                marginBottom: 16,
                background: token.colorFillAlter,
                borderRadius: token.borderRadiusLG,
              }}
            >
              <Row gutter={[16, 8]} align='middle'>
                <Col xs={12} sm={8}>
                  <Statistic
                    title={<Text type='secondary'>Refund Amount</Text>}
                    value={amount}
                    precision={2}
                    prefix='৳'
                    valueStyle={{ fontSize: 18 }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title={<Text type='secondary'>Transfer Charge</Text>}
                    value={chargeAmount}
                    precision={2}
                    prefix='৳'
                    valueStyle={{ fontSize: 18, color: token.colorWarning }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title={<Text strong>Total Company Outflow</Text>}
                    value={netAmount}
                    precision={2}
                    prefix='৳'
                    valueStyle={{
                      fontSize: 20,
                      color: token.colorError,
                      fontWeight: 700,
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 16px' }} />

        <FromSubmit text='Issue Refund' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default CreateCustomerRefund;
