import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ICreateDesignation } from '../types/designationTypes';
import DesignationInputs from './DesignationInputs';
import { useCreateDesignationMutation } from '../api/designationEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';

const CreateDesignation = () => {
  const [form] = useForm();
  const [create, { isLoading }] = useCreateDesignationMutation();
  const onFinish = (values: ICreateDesignation) => {
    const body = sanitizeObjectValue(values);
    create(body);
    form.resetFields();
  };

  return (
    <Card size='small' className='modal-container'>
      <DesignationInputs onFinish={onFinish} form={form} loading={isLoading} />
    </Card>
  );
};

export default CreateDesignation;
