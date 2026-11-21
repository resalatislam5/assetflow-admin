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
import { useBulkPayPayrollMutation } from '../api/payrollEndpoints';

type Props = {
  payrollIds: string[];
};

const BulkPaymentForm = ({ payrollIds }: Props) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const account_type = useWatch('account_type', form);

  const [bulkPay, { isLoading: isPaying }] = useBulkPayPayrollMutation();

  const onFinish = async (values: {
    acc_id?: string;
    date?: string;
    reason?: string;
    transaction_charge?: number;
  }) => {
    await bulkPay({
      body: {
        ids: payrollIds,
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
        }}
      >
        <Row gutter={[8, 8]}>
          <FormInputDate name='date' label='Payment Date' required />
          <FormInputSelect
            name={'account_type'}
            label={'Account Type'}
            lg={12}
            options={ACCOUNT_TYPE_OPTIONS}
            required
            onChange={() => form.resetFields(['acc_id'])}
          />
          <SelectAccount
            name={'acc_id'}
            label={'Account'}
            lg={12}
            payment_method={account_type}
            balance_transfer='NO'
            option={{ Skip: !account_type }}
            required
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
            Confirm Bulk Payment
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default BulkPaymentForm;
