import { Form, Row, type FormInstance } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import {
  SelectAccount,
  SelectEmployee,
} from '../../../../common/SelectWithApi/Select';
import { ACCOUNT_TYPE_OPTIONS } from '../../../Account/Account/types/accountTypes';
import type { ICreateAdvancePayment } from '../types/advancePaymentTypes';

type Props = {
  onFinish: (arg: ICreateAdvancePayment) => void;
  form: FormInstance;
  loading: boolean;
  editMode: boolean;
};

const AdvancePaymentInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const account_type = useWatch('account_type', form);
  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{ date: dayjs(), status: 'PENDING' }}
    >
      <Row gutter={[8, 8]}>
        <SelectEmployee name='employee_id' label='Employee' required />
        <FormInputDate name='date' label='Date Issued' required />
        <FormInputNumber name='amount' label='Total Advance Amount' required />
        <FormInputNumber
          name='deduction_per_month'
          label='Monthly Deduction'
          required
          dependencies={['amount']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const amount = getFieldValue('amount');
                if (value && amount && value > amount) {
                  return Promise.reject(
                    new Error(
                      'Monthly Deduction cannot be greater than Total Advance Amount'
                    )
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        />
        <FormInputNumber
          name='transaction_charge'
          label='Transaction Charge (Company)'
        />
        <FormInputText name='reason' label='Reason' required />

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
        <FormInputSelect
          name={'status'}
          label={'Status'}
          lg={12}
          options={[
            { label: 'PENDING', value: 'PENDING' },
            { label: 'APPROVED', value: 'APPROVED' },
            { label: 'REJECTED', value: 'REJECTED' },
          ]}
          required
        />
      </Row>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <FromSubmit text={editMode ? 'Update' : 'Create'} loading={loading} />
      </div>
    </Form>
  );
};

export default AdvancePaymentInputs;
