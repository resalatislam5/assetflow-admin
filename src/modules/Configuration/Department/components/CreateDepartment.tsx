import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ICreateDepartment } from '../types/departmentTypes';
import DepartmentInputs from './DepartmentInputs';
import { useCreateDepartmentMutation } from '../api/departmentEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';

const CreateDepartment = () => {
  const [form] = useForm();
  const [create, { isLoading }] = useCreateDepartmentMutation();
  const onFinish = (values: ICreateDepartment) => {
    const body = sanitizeObjectValue(values);
    create(body);
    form.resetFields();
  };

  return (
    <Card size='small' className='modal-container'>
      <DepartmentInputs onFinish={onFinish} form={form} loading={isLoading} />
    </Card>
  );
};

export default CreateDepartment;
