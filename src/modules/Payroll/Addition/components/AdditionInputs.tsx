import { Form, Row, type FormInstance } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
} from '../../../../common/Form/FormIInput';
import {
  SelectDepartment,
  SelectEmployee,
} from '../../../../common/SelectWithApi/Select';
import type { ICreateAddition } from '../types/additionTypes';

type Props = {
  onFinish: (arg: ICreateAddition) => void;
  form: FormInstance;
  loading: boolean;
  editMode?: boolean;
};

const AdditionInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const department_id = useWatch('department_id', form);
  const amount_type = useWatch('amount_type', form);
  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{ amount_type: 'FIXED', month_year: dayjs() }}
    >
      <Row gutter={[8, 8]}>
        <SelectDepartment
          name='department_id'
          label='Department'
          required={false}
          onChange={() => form.resetFields(['employee_ids'])}
        />
        <SelectEmployee
          name='employee_ids'
          label='Employee'
          required={false}
          mode='multiple'
          department_id={department_id}
        />
        <FormInputSelect
          name='title'
          label='Addition Type'
          required
          options={[
            { label: 'Overtime', value: 'OVERTIME' },
            { label: 'Transport Allowance', value: 'TRANSPORT_ALLOWANCE' },
            { label: 'Food Allowance', value: 'FOOD_ALLOWANCE' },
            { label: 'Medical Allowance', value: 'MEDICAL_ALLOWANCE' },
            { label: 'Performance Bonus', value: 'PERFORMANCE_BONUS' },
            { label: 'Other', value: 'OTHER' },
          ]}
        />
        <FormInputSelect
          name='amount_type'
          label='Amount Type'
          required
          onChange={() => form.resetFields(['percentage', 'amount'])}
          options={[
            { label: 'Fixed Amount', value: 'FIXED' },
            { label: 'Percentage', value: 'PERCENTAGE' },
          ]}
        />
        {amount_type === 'PERCENTAGE' ? (
          <FormInputNumber
            name='percentage'
            label='Addition Percentage (%)'
            required={!editMode}
          />
        ) : (
          <FormInputNumber
            name='amount'
            label='Addition Amount'
            required={!editMode}
            disabled={!amount_type}
          />
        )}
        <FormInputDate
          name='month_year'
          label='Addition Month & Year'
          required
          picker='month'
        />
      </Row>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <FromSubmit
          text={editMode ? 'Update' : 'Generate Preview'}
          loading={loading}
        />
      </div>
    </Form>
  );
};

export default AdditionInputs;
