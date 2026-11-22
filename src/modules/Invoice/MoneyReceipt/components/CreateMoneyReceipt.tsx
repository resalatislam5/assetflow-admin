import {
  Card,
  Col,
  Divider,
  Form,
  Row,
  Statistic,
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
import { SelectAccount, SelectBranch, SelectOrder } from '../../../../common/SelectWithApi';
import type { IOrderSelect } from '../../../../common/SelectWithApi';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import { useActiveLocation } from '../../../../common/hooks/useActiveLocation';
import { useCreateMoneyReceiptMutation } from '../api/moneyReceiptEndpoints';
import type {
  ICreateMoneyReceipt,
  MoneyReceiptChargeType,
  MoneyReceiptPaymentType,
} from '../types/moneyReceiptTypes';
import dayjs from 'dayjs';

const PAYMENT_TYPE_OPTIONS: { label: string; value: MoneyReceiptPaymentType }[] = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Bank Transfer', value: 'BANK' },
  { label: 'Mobile Banking (bKash/Nagad/Rocket)', value: 'MOBILE_BANKING' },
  { label: 'Card Payment', value: 'CARD' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Other', value: 'OTHER' },
];

const CHARGE_TYPE_OPTIONS = [
  { label: 'Fixed', value: 'FIXED' },
  { label: 'Percentage (%)', value: 'PERCENTAGE' },
];

type Props = {
  defaultOrderId?: number | string;
  defaultDueAmount?: number;
};

const CreateMoneyReceipt = ({ defaultOrderId, defaultDueAmount }: Props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<ICreateMoneyReceipt>();
  const dispatch = useAppDispatch();
  const { isBranch, selectedBranchId } = useActiveLocation();
  const [createReceipt, { isLoading }] = useCreateMoneyReceiptMutation();

  const [selectedOrderInfo, setSelectedOrderInfo] = useState<IOrderSelect | undefined>();

  const selectedPaymentType = Form.useWatch('payment_type', form);
  const enteredAmount = Number(Form.useWatch('amount', form) || 0);
  const chargeType = (Form.useWatch('charge_type', form) || 'FIXED') as MoneyReceiptChargeType;
  const chargeRate = Number(Form.useWatch('charge_rate', form) || 0);

  const prevPaymentTypeRef = useRef<MoneyReceiptPaymentType | undefined>(selectedPaymentType);

  useEffect(() => {
    if (prevPaymentTypeRef.current && prevPaymentTypeRef.current !== selectedPaymentType) {
      form.setFieldValue('account_id', undefined);
    }
    prevPaymentTypeRef.current = selectedPaymentType;
  }, [selectedPaymentType, form]);

  const chargeAmount = useMemo(() => {
    if (chargeRate <= 0 || enteredAmount <= 0) return 0;
    if (chargeType === 'PERCENTAGE') {
      return Math.round(((enteredAmount * chargeRate) / 100) * 100) / 100;
    }
    return chargeRate;
  }, [enteredAmount, chargeType, chargeRate]);

  const netAmount = useMemo(() => {
    return Math.max(0, Math.round((enteredAmount - chargeAmount) * 100) / 100);
  }, [enteredAmount, chargeAmount]);

  const dueAmount = useMemo(() => {
    if (defaultDueAmount !== undefined) return defaultDueAmount;
    if (selectedOrderInfo?.due_amount !== undefined) return Number(selectedOrderInfo.due_amount);
    return undefined;
  }, [defaultDueAmount, selectedOrderInfo]);

  const handleOrderSelect = (order: IOrderSelect) => {
    setSelectedOrderInfo(order);
    if (Number(order.due_amount) > 0) {
      form.setFieldValue('amount', Number(order.due_amount));
    }
  };

  const onFinish = async (values: ICreateMoneyReceipt) => {
    const rawPayload: Record<string, unknown> = {
      ...values,
      order_id: Number(values.order_id),
      invoice_id: Number(values.order_id),
      branch_id: isBranch && selectedBranchId ? selectedBranchId : values.branch_id ? Number(values.branch_id) : undefined,
      account_id: Number(values.account_id),
      amount: Number(values.amount),
      charge_type: values.charge_type || 'FIXED',
      charge_rate: Number(values.charge_rate || 0),
      payment_date: values.payment_date
        ? dayjs(values.payment_date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
    };

    const formData = sanitizeFormData(rawPayload, { fileKeys: ['image'] });

    const res = await createReceipt(formData);
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
          order_id: defaultOrderId,
          amount: defaultDueAmount,
          payment_type: 'CASH',
          charge_type: 'FIXED',
          charge_rate: 0,
          payment_date: dayjs(),
        }}
      >
        <Row gutter={[16, 0]}>
          <SelectOrder
            name='order_id'
            label='Invoice'
            required
            unpaid_only
            disabled={!!defaultOrderId}
            onSelectOrder={handleOrderSelect}
            lg={8}
          />

          {!isBranch && (
            <SelectBranch
              name='branch_id'
              label='Branch'
              placeholder='Select branch'
              lg={8}
            />
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
            label='Deposit Account'
            required
            accountType={
              selectedPaymentType === 'CASH' ||
              selectedPaymentType === 'BANK' ||
              selectedPaymentType === 'MOBILE_BANKING'
                ? selectedPaymentType
                : undefined
            }
            placeholder={
              selectedPaymentType
                ? `Select ${selectedPaymentType} Account`
                : 'Select account'
            }
            lg={8}
          />

          <FormInputNumber
            name='amount'
            label={
              dueAmount !== undefined
                ? `Received Amount (Due: ৳${dueAmount.toLocaleString()})`
                : 'Received Amount'
            }
            required
            min={0.01}
            max={dueAmount ? dueAmount : undefined}
            precision={2}
            placeholder='0.00'
            lg={8}
          />

          <FormInputDate
            name='payment_date'
            label='Receipt Date'
            required
            placeholder='Select receipt date'
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
              chargeType === 'PERCENTAGE'
                ? 'Gateway / Charge Rate (%)'
                : 'Gateway / Charge Amount'
            }
            min={0}
            precision={2}
            placeholder='0.00'
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
            label='Receipt / Slip Attachment'
            accept='image/*'
            maxCount={1}
            span={24}
            lg={8}
          />

          <FormInputTextArea
            name='notes'
            label='Notes / Remarks'
            placeholder='Optional receipt note'
            rows={2}
            xs={24}
            lg={24}
          />

          <Col span={24}>
            <div
              style={{
                background: token.colorFillAlter,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG,
                padding: '12px 16px',
                marginBottom: 8,
              }}
            >
              <Row gutter={[16, 8]} align='middle'>
                <Col span={8}>
                  <Statistic
                    title='Received Amount'
                    value={enteredAmount}
                    prefix='৳'
                    valueStyle={{ fontSize: 16, color: token.colorPrimary }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title='Gateway / Service Fee'
                    value={chargeAmount}
                    prefix='-৳'
                    valueStyle={{
                      fontSize: 16,
                      color: chargeAmount > 0 ? token.colorError : token.colorTextSecondary,
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title='Net Deposited'
                    value={netAmount}
                    prefix='৳'
                    valueStyle={{ fontSize: 16, fontWeight: 700, color: token.colorSuccess }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0 16px' }} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <FromSubmit text='Save Money Receipt' loading={isLoading} />
        </div>
      </Form>
    </Card>
  );
};

export default CreateMoneyReceipt;
