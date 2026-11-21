import {
  Alert,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import FromSubmit from '../../../../common/Button/FromSubmit';
import { SelectAccount } from '../../../../common/SelectWithApi/Select';
import { useUpdatePaymentStatusMutation } from '../api/invoiceEndpoints';
import type {
  IOrder,
  IUpdatePaymentStatus,
  OrderChargeType,
  OrderPaymentType,
} from '../types/invoiceTypes';
import dayjs from 'dayjs';

const { Text } = Typography;

type Props = {
  record: IOrder;
};

const PAYMENT_TYPE_OPTIONS: { label: string; value: OrderPaymentType }[] = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Bank Transfer', value: 'BANK' },
  { label: 'Mobile Banking (bKash/Nagad/Rocket)', value: 'MOBILE_BANKING' },
  { label: 'Card Payment', value: 'CARD' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Other', value: 'OTHER' },
];

const UpdatePaymentStatusModal = ({ record }: Props) => {
  const [form] = Form.useForm<IUpdatePaymentStatus>();
  const dispatch = useAppDispatch();
  const [updatePaymentStatus, { isLoading }] = useUpdatePaymentStatusMutation();

  const grandTotal = Number(record.grand_total_amount || 0);
  const paidSoFar = Number(record.paid_amount || 0);
  const dueAmount = record.due_amount !== undefined
    ? Number(record.due_amount)
    : Math.max(0, grandTotal - paidSoFar);

  const selectedPaymentType = Form.useWatch('payment_type', form);
  const paidAmount = Number(Form.useWatch('paid_amount', form) || 0);
  const chargeType = (Form.useWatch('charge_type', form) || 'FIXED') as OrderChargeType;
  const chargeRate = Number(Form.useWatch('charge_rate', form) || 0);

  const chargeAmount = useMemo(() => {
    if (chargeRate <= 0) return 0;
    if (chargeType === 'PERCENTAGE') {
      return Math.round(((paidAmount * chargeRate) / 100) * 100) / 100;
    }
    return chargeRate;
  }, [paidAmount, chargeRate, chargeType]);

  const netAmount = useMemo(() => Math.max(0, paidAmount - chargeAmount), [paidAmount, chargeAmount]);
  const remainingDue = useMemo(() => Math.max(0, dueAmount - paidAmount), [dueAmount, paidAmount]);

  useEffect(() => {
    form.setFieldValue('account_id', undefined);
  }, [selectedPaymentType, form]);

  const onFinish = async (values: IUpdatePaymentStatus) => {
    const payload: IUpdatePaymentStatus = {
      payment_type: values.payment_type,
      account_id: values.account_id,
      paid_amount: Number(values.paid_amount),
      charge_type: values.charge_type || 'FIXED',
      charge_rate: Number(values.charge_rate || 0),
      payment_date: values.payment_date
        ? dayjs(values.payment_date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      reference: values.reference,
      admin_notes: values.admin_notes,
    };
    const res = await updatePaymentStatus({ id: record.id, body: payload });
    if ('data' in res && res.data?.success) {
      dispatch(closeModal());
    }
  };

  const isCancelled = record.status === 'CANCELLED';

  return (
    <Card size='small' className='modal-container'>
      {isCancelled && (
        <Alert
          type='error'
          message='Cannot record payment for a cancelled order'
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Card
        size='small'
        style={{ background: '#f9f9f9', marginBottom: 16, borderRadius: 8 }}
      >
        <Row gutter={[16, 4]}>
          <Col xs={8}>
            <Statistic
              title='Grand Total'
              value={grandTotal}
              prefix='৳'
              valueStyle={{ fontSize: 16, color: '#0958d9' }}
            />
          </Col>
          <Col xs={8}>
            <Statistic
              title='Paid'
              value={paidSoFar}
              prefix='৳'
              valueStyle={{ fontSize: 16, color: '#389e0d' }}
            />
          </Col>
          <Col xs={8}>
            <Statistic
              title='Due Balance'
              value={dueAmount}
              prefix='৳'
              valueStyle={{ fontSize: 16, color: dueAmount > 0 ? '#cf1322' : '#389e0d' }}
            />
          </Col>
        </Row>
      </Card>

      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{
          paid_amount: dueAmount > 0 ? dueAmount : undefined,
          charge_type: 'FIXED',
          charge_rate: 0,
          payment_date: dayjs(),
        }}
      >
        <Row gutter={[12, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name='payment_type'
              label='Payment Type'
              rules={[{ required: true, message: 'Select payment type' }]}
            >
              <Select
                placeholder='Select payment type'
                options={PAYMENT_TYPE_OPTIONS}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              name='account_id'
              label='Account'
              rules={[{ required: true, message: 'Please select account' }]}
            >
              <SelectAccount
                standalone
                accountType={
                  selectedPaymentType === 'CASH' ||
                  selectedPaymentType === 'BANK' ||
                  selectedPaymentType === 'MOBILE_BANKING'
                    ? selectedPaymentType
                    : undefined
                }
                disabled={!selectedPaymentType}
                placeholder={
                  selectedPaymentType
                    ? `Select ${selectedPaymentType.replace('_', ' ').toLowerCase()} account`
                    : 'Select payment type first'
                }
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              name='paid_amount'
              label='Received Amount (৳)'
              rules={[
                { required: true, message: 'Please enter received amount' },
                {
                  validator: (_, val) => {
                    const num = Number(val);
                    if (num <= 0) {
                      return Promise.reject(new Error('Amount must be greater than zero'));
                    }
                    if (num > dueAmount) {
                      return Promise.reject(
                        new Error(
                          `Received amount (৳${num.toLocaleString()}) cannot exceed due balance (৳${dueAmount.toLocaleString()})`
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={2}
                placeholder='Enter received amount'
                prefix='৳'
                onChange={() => form.validateFields(['charge_rate'])}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item name='charge_type' label='Charge Type'>
              <Select
                options={[
                  { label: 'Fixed (৳)', value: 'FIXED' },
                  { label: 'Percentage (%)', value: 'PERCENTAGE' },
                ]}
                onChange={() => form.validateFields(['charge_rate'])}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Form.Item
              name='charge_rate'
              label='Charge Rate'
              dependencies={['paid_amount', 'charge_type']}
              rules={[
                {
                  validator: (_, val) => {
                    const rate = Number(val || 0);
                    if (rate < 0) {
                      return Promise.reject(new Error('Charge rate cannot be negative'));
                    }
                    if (chargeType === 'PERCENTAGE' && rate > 100) {
                      return Promise.reject(new Error('Percentage fee cannot exceed 100%'));
                    }
                    if (chargeType === 'FIXED' && paidAmount > 0 && rate > paidAmount) {
                      return Promise.reject(
                        new Error(
                          `Fixed fee (৳${rate.toLocaleString()}) cannot exceed received amount (৳${paidAmount.toLocaleString()})`
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder='0'
                prefix={chargeType === 'FIXED' ? '৳' : '%'}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item name='payment_date' label='Payment Date'>
              <DatePicker
                style={{ width: '100%' }}
                format='YYYY-MM-DD'
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item name='reference' label='Reference / TrxID'>
              <Input placeholder='Transaction ID or reference' />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name='admin_notes' label='Admin Notes'>
              <Input.TextArea placeholder='Optional payment notes' rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {paidAmount > 0 && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <Card
              size='small'
              style={{ background: '#fffbe6', borderColor: '#ffe58f', marginBottom: 12 }}
            >
              <Row gutter={[16, 4]}>
                <Col xs={12} sm={6}>
                  <Text type='secondary' style={{ fontSize: 11 }}>Received</Text>
                  <br />
                  <Text strong style={{ color: '#0958d9' }}>৳{paidAmount.toLocaleString()}</Text>
                </Col>
                <Col xs={12} sm={6}>
                  <Text type='secondary' style={{ fontSize: 11 }}>Charge</Text>
                  <br />
                  <Text strong style={{ color: chargeAmount > 0 ? '#cf1322' : '#389e0d' }}>
                    -{chargeAmount > 0 ? '৳' + chargeAmount.toLocaleString() : '৳0'}
                    {chargeAmount > 0 && chargeType === 'PERCENTAGE' && (
                      <Tag color='orange' style={{ marginLeft: 4, fontSize: 10 }}>
                        {chargeRate}%
                      </Tag>
                    )}
                  </Text>
                </Col>
                <Col xs={12} sm={6}>
                  <Text type='secondary' style={{ fontSize: 11 }}>Net Deposited</Text>
                  <br />
                  <Text strong style={{ color: '#389e0d' }}>৳{netAmount.toLocaleString()}</Text>
                </Col>
                <Col xs={12} sm={6}>
                  <Text type='secondary' style={{ fontSize: 11 }}>Remaining Due</Text>
                  <br />
                  <Text strong style={{ color: remainingDue > 0 ? '#cf1322' : '#389e0d' }}>
                    ৳{remainingDue.toLocaleString()}
                    {remainingDue === 0 && (
                      <Tag color='success' style={{ marginLeft: 4, fontSize: 10 }}>
                        FULLY PAID
                      </Tag>
                    )}
                  </Text>
                </Col>
              </Row>
            </Card>
          </>
        )}

        <FromSubmit
          text='Record Payment'
          loading={isLoading}
          disabled={isCancelled || paidAmount <= 0}
        />
      </Form>
    </Card>
  );
};

export { UpdatePaymentStatusModal };
export default UpdatePaymentStatusModal;
