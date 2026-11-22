import { Card, Form } from 'antd';
import { useEffect } from 'react';
import { useCreateCustomerMutation } from '../api/customerEndpoints';
import { sanitizeFormData } from '../../../common/utils/sanitizeFormData';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { closeModal } from '../../../app/features/modalSlice';
import { useActiveLocation } from '../../../common/hooks/useActiveLocation';
import CustomerInputs from './CustomerInputs';
import type { ICreateCustomer } from '../types/customerTypes';

const CreateCustomer = () => {
  const [form] = Form.useForm<ICreateCustomer>();
  const dispatch = useAppDispatch();
  const { isBranch, selectedBranchId } = useActiveLocation();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  useEffect(() => {
    if (selectedBranchId) {
      form.setFieldValue('branch_id', selectedBranchId);
    }
  }, [selectedBranchId, form]);

  const onFinish = (values: ICreateCustomer) => {
    const payload: ICreateCustomer = {
      ...values,
      branch_id: isBranch && selectedBranchId ? selectedBranchId : values.branch_id,
    };
    const formData = sanitizeFormData(payload, { fileKeys: ['upload_avatar'] });

    createCustomer(formData)
      .unwrap()
      .then(() => {
        form.resetFields();
        dispatch(closeModal());
      });
  };

  return (
    <Card className='modal-container'>
      <CustomerInputs form={form} onFinish={onFinish} loading={isLoading} />
    </Card>
  );
};

export default CreateCustomer;
