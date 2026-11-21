import { Card, Col, Form, Row, Statistic, theme } from 'antd';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { closeModal } from '../../../app/features/modalSlice';
import FromSubmit from '../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import { SelectAccount } from '../../../common/SelectWithApi';
import { useCreateRefundMutation } from '../api/paymentEndpoints';
import type {
  ICreateRefund,
  IPaymentItem,
  RefundStatus,
  RefundType,
} from '../types/paymentTypes';

const REFUND_TYPE_OPTIONS: { label: string; value: RefundType }[] = [
  { label: 'Cash Refund', value: 'CASH' },
  { label: 'Card Reversal', value: 'CARD' },
  { label: 'Mobile Banking Reversal', value: 'MOBILE_BANKING' },
  { label: 'Payment Gateway Reversal', value: 'GATEWAY' },
  { label: 'Store Credit / Wallet', value: 'STORE_CREDIT' },
];

const REFUND_STATUS_OPTIONS: { label: string; value: RefundStatus }[] = [
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Processed', value: 'PROCESSED' },
  { label: 'Pending Approval', value: 'PENDING' },
];

interface Props {
  payment: IPaymentItem;
}

const CreateRefundModal = ({ payment }: Props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ICreateRefund>();
  const dispatch = useAppDispatch();
  const [createRefund, { isLoading }] = useCreateRefundMutation();

  const maxRefundable = Math.max(
    0,
    Number(payment.amount || 0) - Number(payment.refunded_amount || 0),
  );

  const getInitialRefundType = (): RefundType => {
    switch (payment.payment_method) {
      case 'CASH':
        return 'CASH';
      case 'CARD':
        return 'CARD';
      case 'MOBILE_BANKING':
        return 'MOBILE_BANKING';
      case 'GATEWAY':
        return 'GATEWAY';
      default:
        return 'CASH';
    }
  };

  const onFinish = async (values: ICreateRefund) => {
    const payload: ICreateRefund = {
      ...values,
      payment_id: payment.id,
      amount: Number(values.amount),
      status: values.status || 'COMPLETED',
    };

    const res = await createRefund(payload);
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
        payment_id: payment.id,
        amount: maxRefundable,
        refund_type: getInitialRefundType(),
        status: 'COMPLETED',
        account_id: payment.account_id || undefined,
      }}
    >
      <Row gutter={[16, 0]}>
        <Col span={24} style={{ marginBottom: 16 }}>
          <Card
            size='small'
            style={{
              background: token.colorFillAlter,
              borderRadius: token.borderRadius,
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title='Original Payment'
                  value={payment.amount}
                  prefix='৳'
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title='Already Refunded'
                  value={payment.refunded_amount || 0}
                  prefix='৳'
                  valueStyle={{ fontSize: 16, color: token.colorWarning }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title='Max Refundable'
                  value={maxRefundable}
                  prefix='৳'
                  valueStyle={{ fontSize: 16, color: token.colorSuccess }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <FormInputNumber
          name='amount'
          label='Refund Amount (BDT)'
          required
          min={0.01}
          max={maxRefundable}
          placeholder='0.00'
          xs={24}
          sm={12}
        />

        <FormInputSelect
          name='refund_type'
          label='Refund Mechanism'
          required
          xs={24}
          sm={12}
          options={REFUND_TYPE_OPTIONS}
        />

        <SelectAccount
          name='account_id'
          label='Debit Account (Funds Source)'
          placeholder='Select account to disburse refund from'
          xs={24}
          sm={12}
        />

        <FormInputSelect
          name='status'
          label='Refund Status'
          required
          xs={24}
          sm={12}
          options={REFUND_STATUS_OPTIONS}
        />

        <FormInputText
          name='gateway_refund_trx_id'
          label='Gateway Refund Transaction ID (Optional)'
          placeholder='e.g. REF-TRX-948182'
          xs={24}
        />

        <FormInputTextArea
          name='reason'
          label='Refund Reason'
          required
          placeholder='State detailed reason for issuing refund...'
          xs={24}
        />
      </Row>

      <FromSubmit loading={isLoading} text='Process Refund' />
    </Form>
  );
};

export default CreateRefundModal;
