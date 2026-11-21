import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputEmail,
  FormInputMobile,
  FormInputPassword,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import {
  SelectBranch,
  SelectRole,
  SelectWarehouse,
} from '../../../../common/SelectWithApi/Select';
import type { ICreateUser } from '../types/userTypes';

type Props = {
  onFinish: (values: ICreateUser) => void;
  loading?: boolean;
  form: FormInstance<ICreateUser>;
  editMode?: boolean;
};

const UserInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const dataScope = Form.useWatch('data_scope', form);

  const handleValuesChange = (changedValues: Partial<ICreateUser>) => {
    if (changedValues.data_scope) {
      if (changedValues.data_scope === 'BRANCH') {
        form.setFieldsValue({ warehouse_id: undefined });
      } else if (changedValues.data_scope === 'WAREHOUSE') {
        form.setFieldsValue({ branch_id: undefined });
      } else if (changedValues.data_scope === 'ALL') {
        form.setFieldsValue({ branch_id: undefined, warehouse_id: undefined });
      }
    }
  };

  return (
    <Form
      onFinish={onFinish}
      form={form}
      onValuesChange={handleValuesChange}
      initialValues={{ type: 'EMPLOYEE', data_scope: 'BRANCH', status: 'ACTIVE' }}
    >
      <Row gutter={[8, 8]}>
        <FormInputText lg={24} name={'name'} label={'Name'} required />
        <FormInputEmail lg={24} name={'email'} label={'Email'} required />
        <FormInputMobile lg={24} name={'phone'} label={'Phone'} required />
        <FormInputSelect
          name={'type'}
          label={'Type'}
          lg={24}
          options={[
            { label: 'EMPLOYEE', value: 'EMPLOYEE' },
            { label: 'ADMIN', value: 'ADMIN' },
          ]}
        />
        <SelectRole name={'role_id'} label={'Role'} lg={24} required />
        <FormInputSelect
          name={'data_scope'}
          label={'Data Scope'}
          lg={24}
          options={[
            { label: 'BRANCH', value: 'BRANCH' },
            { label: 'WAREHOUSE', value: 'WAREHOUSE' },
            { label: 'ALL', value: 'ALL' },
          ]}
        />
        {dataScope === 'BRANCH' && (
          <SelectBranch name={'branch_id'} label={'Branch'} lg={24} required />
        )}
        {dataScope === 'WAREHOUSE' && (
          <SelectWarehouse name={'warehouse_id'} label={'Warehouse'} lg={24} required />
        )}
        <FormInputPassword
          lg={24}
          name={'password'}
          label={'Password'}
          required={!editMode}
        />

        {editMode && (
          <FormInputSelect
            name={'status'}
            label={'Status'}
            lg={24}
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
              { label: 'SUSPENDED', value: 'SUSPENDED' },
            ]}
          />
        )}
      </Row>
      <FromSubmit text={editMode ? 'Update' : 'Create'} loading={loading} />
    </Form>
  );
};

export default UserInputs;
