import { useEffect } from 'react';
import { Card, Form } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateBranchMutation } from '../api/branchEndpoints';
import type { IBranch, ICreateBranch } from '../types/branchTypes';
import BranchInputs from './BranchInputs';

type Props = {
  record: IBranch;
};

const UpdateBranch = ({ record }: Props) => {
  const [form] = Form.useForm<ICreateBranch>();
  const dispatch = useAppDispatch();
  const [updateBranch, { isLoading }] = useUpdateBranchMutation();

  useEffect(() => {
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      phone: record.phone,
      email: record.email,
      city: record.city,
      address: record.address,
      is_main_branch: record.is_main_branch,
      is_active: record.is_active,
    });
  }, [record, form]);

  const onFinish = async (values: ICreateBranch) => {
    const payload: ICreateBranch = {
      ...values,
      is_main_branch: Boolean(values.is_main_branch),
    };
    const sanitized = sanitizeObjectValue(payload) as ICreateBranch;
    const res = await updateBranch({ id: record.id, body: sanitized });
    if ('data' in res && res.data?.success) {
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <BranchInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateBranch;
