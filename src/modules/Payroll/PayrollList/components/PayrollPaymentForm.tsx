import { Button, Card, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { closeModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import { SelectAccount } from '../../../../common/SelectWithApi/Select';
import { ACCOUNT_TYPE_OPTIONS } from '../../../Account/Account/types/accountTypes';
import { usePayPayrollMutation } from '../api/payrollEndpoints';

type Props = {
  payrollId: string;
  dueAmount: number;
  defaultAccountId?: string;
  defaultAccountType?: string;
};

const PayrollPaymentForm = ({
  payrollId,
  dueAmount,
  defaultAccountId,
  defaultAccountType,
}: Props) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const account_type = useWatch('account_type', form);

  const [pay, { isLoading: isPaying }] = usePayPayrollMutation();

  const onFinish = async (values: {
    amount: number;
    acc_id?: string;
    date?: string;
    reason?: string;
    transaction_charge?: number;
  }) => {
    await pay({
      id: payrollId,
      body: {
        amount: values.amount,
        acc_id: values.acc_id,
        date: values.date,
        reason: values.reason,
        transaction_charge: values.transaction_charge,
      },
    });
    dispatch(closeModal());
  };

  return (
    <Card className='modal-container'>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          date: dayjs(),
          amount: dueAmount,
          account_type: defaultAccountType,
          acc_id: defaultAccountId,
        }}
      >
        <Row gutter={[8, 8]}>
          <FormInputNumber
            name='amount'
            label='Payment Amount'
            max={dueAmount}
            required
            extra={
              <span
                style={{
                  backgroundColor: '#e6f7ff',
                  border: '1px solid #91caff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  color: '#0958d9',
                  display: 'inline-block',
                  marginTop: '4px',
                  fontSize: '12px',
                }}
              >
                Due Amount: {dueAmount}
              </span>
            }
            rules={[
              {
                validator(_, value) {
                  if (!value || value <= dueAmount) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Amount can't be greater than the due amount"),
                  );
                },
              },
            ]}
          />
          <FormInputDate name='date' label='Payment Date' required />
          <FormInputSelect
            name={'account_type'}
            label={'Account Type'}
            lg={12}
            options={ACCOUNT_TYPE_OPTIONS}
            required={false}
            onChange={() => form.resetFields(['acc_id'])}
          />
          <SelectAccount
            name={'acc_id'}
            label={'Account'}
            lg={12}
            payment_method={account_type}
            balance_transfer='NO'
            option={{ Skip: !account_type }}
            required={false}
            disabled={!account_type}
          />
          <FormInputNumber name='transaction_charge' label='Transaction Charge' />
          <FormInputText name='reason' label='Reason/Remarks' />
        </Row>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '16px',
          }}
        >
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
          <Button type='primary' htmlType='submit' loading={isPaying}>
            Confirm Payment
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PayrollPaymentForm;
