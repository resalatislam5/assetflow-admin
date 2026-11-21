import { useForm } from 'antd/es/form/Form';
import { useUpdateDesignationMutation } from '../api/designationEndpoints';
import type {
  IDesignationList,
  ICreateDesignation,
} from '../types/designationTypes';
import { Card } from 'antd';
import DesignationInputs from './DesignationInputs';
import { useEffect } from 'react';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';

type Props = {
  record: IDesignationList;
};
const UpdateDesignation = ({ record }: Props) => {
  const [form] = useForm();
  const { name, department_id, status, _id } = record;
  const [update, { isLoading }] = useUpdateDesignationMutation();

  const onFinish = (values: ICreateDesignation) => {
    const body = sanitizeObjectValue(values);
    update({ body, id: _id })
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name,
        department_id,
        status,
      });
    }
  }, [form, name, status, record]);

  return (
    <Card size='small' className='modal-container'>
      <DesignationInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateDesignation;
