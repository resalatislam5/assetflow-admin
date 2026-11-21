import { Card } from 'antd';
import UserInputs from './UserInputs';
import { useForm } from 'antd/es/form/Form';
import type { ICreateUser } from '../types/userTypes';
import { useCreateUserMutation } from '../api/userEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';

const CreateUser = () => {
  const [form] = useForm<ICreateUser>();
  const [create, { isLoading }] = useCreateUserMutation();

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
    create(body)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <UserInputs onFinish={onFinish} form={form} loading={isLoading} />
    </Card>
  );
};

export default CreateUser;
