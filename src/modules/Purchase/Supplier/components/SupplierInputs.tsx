import { Form, Row, type FormInstance } from 'antd';
import {
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import FromSubmit from '../../../../common/Button/FromSubmit';
import type { ICreateSupplier } from '../types/supplierTypes';

type Props = {
  onFinish: (values: ICreateSupplier) => void;
  loading: boolean;
  form: FormInstance<ICreateSupplier>;
  editMode?: boolean;
};

const SupplierInputs = ({ onFinish, loading, form, editMode }: Props) => {
  return (
    <Form<ICreateSupplier>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{ status: 'ACTIVE', opening_balance: 0 }}
    >
      <Row gutter={[16, 0]}>
        <FormInputText
          name='name'
          label='Supplier Name'
          placeholder='Enter supplier contact name'
          required
          md={12}
        />
        <FormInputText
          name='company_name'
          label='Company Name'
          placeholder='Enter company / trade name'
          md={12}
        />
        <FormInputText
          name='phone'
          label='Phone Number'
          placeholder='e.g. 01700000000'
          required
          md={12}
        />
        <FormInputText
          name='email'
          label='Email Address'
          placeholder='e.g. supplier@example.com'
          md={12}
        />
        {!editMode && (
          <FormInputNumber
            name='opening_balance'
            label='Opening Balance (৳)'
            placeholder='0.00'
            min={0}
            md={12}
          />
        )}
        <FormInputSelect
          name='status'
          label='Status'
          md={editMode ? 24 : 12}
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
          ]}
        />
        <FormInputTextArea
          name='address'
          label='Office / Warehouse Address'
          placeholder='Enter full street address'
          rows={2}
          lg={24}
          md={24}
        />
        <FromSubmit
          text={editMode ? 'Update Supplier' : 'Create Supplier'}
          loading={loading}
        />
      </Row>
    </Form>
  );
};

export default SupplierInputs;
