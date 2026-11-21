import { Card, Form } from 'antd';
import { useEffect } from 'react';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateUserMutation } from '../api/userEndpoints';
import type { ICreateUser, IUserList } from '../types/userTypes';
import UserInputs from './UserInputs';

const UpdateUser = ({ record }: { record: IUserList }) => {
  const [form] = Form.useForm<ICreateUser>();
  const [update, { isLoading }] = useUpdateUserMutation();

  const onFinish = (values: ICreateUser) => {
    const payload: ICreateUser = {
      ...values,
      branch_id: values.data_scope === 'BRANCH' ? values.branch_id : null,
      warehouse_id: values.data_scope === 'WAREHOUSE' ? values.warehouse_id : null,
      branch_ids:
        values.data_scope === 'BRANCH' && values.branch_id
          ? [Number(values.branch_id)]
          : [],
      warehouse_ids:
        values.data_scope === 'WAREHOUSE' && values.warehouse_id
          ? [Number(values.warehouse_id)]
          : [],
    };
    const body = sanitizeObjectValue(payload);
    update({ body, id: record.id })
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  useEffect(() => {
    if (record) {
      const { email, name, role_id, status, type, phone, data_scope, branch_id, warehouse_id } = record;

      form.setFieldsValue({
        name,
        email,
        role_id,
        status,
        type,
        phone,
        data_scope: data_scope || 'BRANCH',
        branch_id: branch_id ?? undefined,
        warehouse_id: warehouse_id ?? undefined,
      });
    }
  }, [record, form]);

  return (
    <Card className='modal-container'>
      <UserInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateUser;
