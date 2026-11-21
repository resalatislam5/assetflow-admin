import { Card, Form } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateBranchMutation } from '../api/branchEndpoints';
import type { ICreateBranch } from '../types/branchTypes';
import BranchInputs from './BranchInputs';

const CreateBranch = () => {
  const [form] = Form.useForm<ICreateBranch>();
  const dispatch = useAppDispatch();
  const [createBranch, { isLoading }] = useCreateBranchMutation();

  const onFinish = async (values: ICreateBranch) => {
    const payload: ICreateBranch = {
      ...values,
      is_main_branch: Boolean(values.is_main_branch),
    };
    const sanitized = sanitizeObjectValue(payload) as ICreateBranch;
    const res = await createBranch(sanitized);
    if ('data' in res && res.data?.success) {
      form.resetFields();
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <BranchInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
      />
    </Card>
  );
};

export default CreateBranch;
