import { Button, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import type { ICreatePayroll } from '../types/payrollTypes';
import { closeModal } from '../../../../app/features/modalSlice';
import { FormInputDate } from '../../../../common/Form/FormIInput';
import {
  SelectDepartment,
  SelectEmployee,
} from '../../../../common/SelectWithApi/Select';
import { useCreatePayrollMutation } from '../api/payrollEndpoints';
import dayjs from 'dayjs';

const PayrollForm = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const department_id = useWatch('department_id', form);

  const [create, { isLoading: isCreating }] = useCreatePayrollMutation();

  const onFinish = async (values: Partial<ICreatePayroll> & { month_year?: dayjs.Dayjs | string }) => {
    const payload: ICreatePayroll = {
      ...values,
      month_year: dayjs(values.month_year).format('YYYY-MM'),
    };
    await create(payload);
    dispatch(closeModal());
  };

  return (
    <Form form={form} layout='vertical' onFinish={onFinish} initialValues={{month_year: dayjs()}}>
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
          department_id={department_id}
          rtkOptions={{ skip: !department_id }}
          disabled={!department_id}
          mode='multiple'
        />
        <FormInputDate
          name='month_year'
          label='Payroll Month & Year'
          required
          picker='month'
        />
      </Row>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
        <Button type='primary' htmlType='submit' loading={isCreating}>
          Generate Payroll
        </Button>
      </div>
    </Form>
  );
};

export default PayrollForm;

