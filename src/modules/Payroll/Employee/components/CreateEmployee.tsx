import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCreateEmployeeMutation } from '../api/employeeEndpoints';
import type { ICreateEmployee } from '../types/employeeTypes';
import EmployeeInputs from './EmployeeInputs';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';

const CreateEmployee = () => {
  const [form] = useForm();
  const [create, { isLoading }] = useCreateEmployeeMutation();

  const onFinish = async (values: ICreateEmployee) => {
    const body = sanitizeObjectValue(values);
    await create(body);
  };

  return (
    <Card className='modal-container'>
      <EmployeeInputs form={form} onFinish={onFinish} loading={isLoading} />
    </Card>
  );
};

export default CreateEmployee;
