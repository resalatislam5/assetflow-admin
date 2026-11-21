import { useForm } from 'antd/es/form/Form';
import { useUpdateDepartmentMutation } from '../api/departmentEndpoints';
import type { IDepartmentList, ICreateDepartment } from '../types/departmentTypes';
import { Card } from 'antd';
import DepartmentInputs from './DepartmentInputs';
import { useEffect } from 'react';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';

type Props = {
  record: IDepartmentList;
};
const UpdateDepartment = ({ record }: Props) => {
  const [form] = useForm();
  const { name, status, _id } = record;
  const [update, { isLoading }] = useUpdateDepartmentMutation();

  const onFinish = (values: ICreateDepartment) => {
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
        status,
      });
    }
  }, [form, name, status, record]);

  return (
    <Card size='small' className='modal-container'>
      <DepartmentInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateDepartment;
