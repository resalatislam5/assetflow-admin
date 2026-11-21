import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputEmail,
  FormInputMobile,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import type { ICreateBranch } from '../types/branchTypes';

type Props = {
  onFinish: (values: ICreateBranch) => void;
  form: FormInstance<ICreateBranch>;
  loading: boolean;
  editMode?: boolean;
};

const BranchInputs = ({ onFinish, form, loading, editMode }: Props) => {
  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        is_main_branch: false,
        is_active: true,
      }}
    >
      <Row gutter={[12, 12]}>
        <FormInputText
          name='name'
          label='Branch Name'
          placeholder='Enter branch name'
          required
          lg={12}
        />

        <FormInputText
          name='code'
          label='Branch Code'
          placeholder='e.g. BR-DHAKA-MAIN'
          required
          lg={12}
        />

        <FormInputMobile
          name='phone'
          label='Phone Number'
          required={false}
          lg={12}
        />

        <FormInputEmail
          name='email'
          label='Email Address'
          placeholder='e.g. branch@example.com'
          required={false}
          lg={12}
        />

        <FormInputText
          name='city'
          label='City'
          placeholder='e.g. Dhaka'
          required={false}
          lg={12}
        />

        <FormInputSelect
          name='is_main_branch'
          label='Main Headquarters Branch'
          required
          lg={12}
          options={[
            { label: 'NO', value: false },
            { label: 'YES (Headquarters)', value: true },
          ]}
        />

        {editMode && (
          <FormInputSelect
            name='is_active'
            label='Status'
            required
            lg={12}
            options={[
              { label: 'ACTIVE', value: true },
              { label: 'INACTIVE', value: false },
            ]}
          />
        )}

        <FormInputTextArea
          name='address'
          label='Physical Address'
          placeholder='Enter physical address of this branch'
          required
          lg={24}
          rows={3}
        />
      </Row>

      <FromSubmit
        text={editMode ? 'Update Branch' : 'Create Branch'}
        loading={loading}
      />
    </Form>
  );
};

export default BranchInputs;
