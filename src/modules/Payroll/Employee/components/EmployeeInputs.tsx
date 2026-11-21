import { Form, Row, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import {
  SelectDepartment,
  SelectDesignation,
  SelectUser,
} from '../../../../common/SelectWithApi/Select';
import type { ICreateEmployee } from '../types/employeeTypes';

type Props = {
  onFinish: (arg: ICreateEmployee) => void;
  form: FormInstance;
  loading: boolean;
  editMode?: boolean;
};

const EmployeeInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const department_id = Form.useWatch('department_id', form);

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{ status: 'ACTIVE', joining_date: dayjs() }}
    >
      <Row gutter={[8, 8]}>
        <FormInputText name='name' label='Name' required />
        <FormInputText name='code' label='Employee ID' required />
        <SelectUser name='user_id' label='Linked User' />
        <SelectDepartment
          name='department_id'
          label='Department'
          required
          onChange={() => form.resetFields(['designation_id'])}
        />
        <SelectDesignation
          name='designation_id'
          label='Designation'
          required
          department_id={department_id}
          disabled={!department_id}
        />
        <FormInputDate name='joining_date' label='Joining Date' required />
        <FormInputNumber name='basic_salary' label='Basic Salary' required />
        <FormInputText name='bank_name' label='Bank Name' />
        <FormInputText name='account_no' label='Account No' />
        <FormInputText name='account_name' label='Account Name' />
        <FormInputText name='branch_name' label='Branch Name' />
        <FormInputText name='routing_no' label='Routing No' />

        {editMode && (
          <FormInputSelect
            name='status'
            label='Status'
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
          />
        )}
      </Row>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <FromSubmit text={editMode ? 'Update' : 'Create'} loading={loading} />
      </div>
    </Form>
  );
};

export default EmployeeInputs;
