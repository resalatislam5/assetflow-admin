import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateAccountMutation } from '../api/accountEndpoints';
import type { IAccountList, ICreateAccount } from '../types/accountTypes';
import AccountInputs from './AccountInputs';

type Props = {
  record: IAccountList;
};

const UpdateAccount = ({ record }: Props) => {
  const [form] = useForm<ICreateAccount>();
  const dispatch = useAppDispatch();
  const [update, { isLoading }] = useUpdateAccountMutation();

  const onFinish = (values: ICreateAccount) => {
    const body = sanitizeObjectValue(values);
    update({ body, id: record.id })
      .unwrap()
      .then(() => {
        form.resetFields();
        dispatch(closeModal());
      });
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        account_type: record.account_type,
        bank_name: record.bank_name,
        branch_name: record.branch_name,
        account_number: record.account_number,
        opening_balance: Number(record.opening_balance) || 0,
        status: record.status,
      });
    }
  }, [form, record]);

  return (
    <Card size='small' className='modal-container'>
      <AccountInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateAccount;
