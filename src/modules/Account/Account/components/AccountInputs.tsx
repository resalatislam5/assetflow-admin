import { Form, Row, type FormInstance } from 'antd';
import {
  ACCOUNT_TYPE_OPTIONS,
  type AccountType,
  type ICreateAccount,
} from '../types/accountTypes';
import {
  FormInputNumber,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import FromSubmit from '../../../../common/Button/FromSubmit';
import { useWatch } from 'antd/es/form/Form';

type Props = {
  onFinish: (arg: ICreateAccount) => void;
  form: FormInstance<ICreateAccount>;
  loading: boolean;
  editMode?: boolean;
};

const AccountInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const account_type = useWatch<AccountType>('account_type', form);

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        account_type: 'CASH',
        opening_balance: 0,
        status: 'ACTIVE',
      }}
    >
      <Row gutter={[12, 12]}>
        <FormInputSelect
          name='account_type'
          label='Account Type'
          lg={12}
          options={ACCOUNT_TYPE_OPTIONS}
          required
        />

        <FormInputText
          lg={12}
          name='name'
          label='Account Name'
          placeholder='e.g. Main Cash Drawer / City Bank'
          required
        />

        {(account_type === 'BANK' || account_type === 'MOBILE_BANKING') && (
          <FormInputText
            lg={12}
            name='account_number'
            label={account_type === 'BANK' ? 'Account Number' : 'Mobile Number'}
            placeholder={account_type === 'BANK' ? 'e.g. 1102938475001' : 'e.g. 01711223344'}
            required
          />
        )}

        {account_type === 'BANK' && (
          <>
            <FormInputText
              lg={12}
              name='bank_name'
              label='Bank Name'
              placeholder='e.g. City Bank Ltd'
              required
            />
            <FormInputText
              lg={12}
              name='branch_name'
              label='Branch Name'
              placeholder='e.g. Gulshan Branch'
            />
          </>
        )}

        {!editMode && (
          <FormInputNumber
            lg={12}
            name='opening_balance'
            label='Opening Balance'
            placeholder='0.00'
            min={0}
          />
        )}

        {editMode && (
          <FormInputSelect
            name='status'
            label='Status'
            lg={12}
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
          />
        )}
      </Row>
      <FromSubmit text={editMode ? 'Update Account' : 'Create Account'} loading={loading} />
    </Form>
  );
};

export default AccountInputs;
