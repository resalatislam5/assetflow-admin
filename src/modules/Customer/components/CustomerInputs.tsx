import { Form, Row, type FormInstance } from 'antd';
import {
  FormFileUpload,
  FormInputEmail,
  FormInputMobile,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import FromSubmit from '../../../common/Button/FromSubmit';
import { SelectBranch } from '../../../common/SelectWithApi/Select';
import type { ICreateCustomer } from '../types/customerTypes';

type Props = {
  onFinish: (values: ICreateCustomer) => void;
  loading: boolean;
  form: FormInstance<ICreateCustomer>;
  editMode?: boolean;
};

const CustomerInputs = ({ onFinish, loading, form, editMode }: Props) => {
  return (
    <Form<ICreateCustomer>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{
        status: 'ACTIVE',
        customer_type: 'RETAIL',
        credit_limit: 0,
        credit_period_days: 0,
        opening_balance: 0,
        opening_balance_type: 'DEBIT',
      }}
    >
      <Row gutter={[16, 0]}>
        {editMode && (
          <FormInputText
            name='customer_code'
            label='Customer Code'
            disabled
            md={12}
            lg={8}
          />
        )}
        <SelectBranch
          name='branch_id'
          label='Branch'
          placeholder='Select branch (Optional)'
          allowClear
          md={12}
          lg={8}
        />
        <FormInputSelect
          name='customer_type'
          label='Customer Type'
          required
          md={12}
          lg={8}
          options={[
            { label: 'Retail', value: 'RETAIL' },
            { label: 'Wholesale', value: 'WHOLESALE' },
            { label: 'Corporate', value: 'CORPORATE' },
            { label: 'Walk-In', value: 'WALK_IN' },
          ]}
        />
        <FormInputText
          name='company_name'
          label='Company Name'
          placeholder='Enter company or business name'
          md={12}
          lg={8}
        />
        <FormInputText
          name='first_name'
          label='First Name'
          placeholder='Enter first name'
          required
          md={12}
          lg={8}
        />
        <FormInputText
          name='last_name'
          label='Last Name'
          placeholder='Enter last name'
          md={12}
          lg={8}
        />
        <FormInputMobile
          name='phone'
          label='Phone Number'
          required
          md={12}
          lg={8}
        />
        <FormInputEmail
          name='email'
          label='Email Address'
          placeholder='Enter email address'
          required={false}
          md={12}
          lg={8}
        />
        <FormInputNumber
          name='credit_limit'
          label='Credit Limit'
          placeholder='Enter credit limit'
          min={0}
          md={12}
          lg={8}
        />
        <FormInputNumber
          name='credit_period_days'
          label='Credit Period (Days)'
          placeholder='Enter days'
          min={0}
          md={12}
          lg={8}
        />
        {!editMode && (
          <>
            <FormInputNumber
              name='opening_balance'
              label='Opening Balance'
              placeholder='Enter opening balance'
              min={0}
              md={12}
              lg={8}
            />
            <FormInputSelect
              name='opening_balance_type'
              label='Balance Type'
              md={12}
              lg={8}
              options={[
                { label: 'Debit (Receivable)', value: 'DEBIT' },
                { label: 'Credit (Payable)', value: 'CREDIT' },
              ]}
            />
          </>
        )}
        <FormInputSelect
          name='status'
          label='Status'
          md={12}
          lg={8}
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
            { label: 'Banned', value: 'BANNED' },
          ]}
        />
        <FormInputTextArea
          name='address'
          label='Address'
          placeholder='Enter complete address'
          md={12}
          lg={12}
        />
        <FormInputTextArea
          name='notes'
          label='Notes'
          placeholder='Enter administrative notes'
          md={12}
          lg={12}
        />
        <FormFileUpload
          name='upload_avatar'
          label='Profile Avatar'
          maxCount={1}
          accept='image/*'
          span={24}
          md={24}
          lg={24}
        />
      </Row>
      <FromSubmit text={editMode ? 'Update Customer' : 'Create Customer'} loading={loading} />
    </Form>
  );
};

export default CustomerInputs;
