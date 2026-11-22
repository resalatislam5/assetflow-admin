import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import {
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
} from '../api/customerEndpoints';
import { sanitizeFormData } from '../../../common/utils/sanitizeFormData';
import { toUploadFileList } from '../../../common/utils/toUploadFileList ';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { closeModal } from '../../../app/features/modalSlice';
import { useActiveLocation } from '../../../common/hooks/useActiveLocation';
import CustomerInputs from './CustomerInputs';
import type { ICreateCustomer } from '../types/customerTypes';

type Props = {
  id: number;
};

const UpdateCustomer = ({ id }: Props) => {
  const [form] = Form.useForm<ICreateCustomer>();
  const dispatch = useAppDispatch();
  const { isBranch, selectedBranchId } = useActiveLocation();
  const { data, isLoading: isFetching } = useGetSingleCustomerQuery(id);
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  useEffect(() => {
    if (data?.data) {
      const c = data.data;
      form.setFieldsValue({
        branch_id: c.branch_id,
        customer_code: c.customer_code,
        customer_type: c.customer_type,
        first_name: c.first_name,
        last_name: c.last_name,
        company_name: c.company_name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        credit_limit: c.credit_limit,
        credit_period_days: c.credit_period_days,
        notes: c.notes,
        status: c.status,
        upload_avatar: toUploadFileList(c.avatar),
      });
    }
  }, [data, form]);

  const onFinish = (values: ICreateCustomer) => {
    const payload: ICreateCustomer = {
      ...values,
      branch_id: isBranch && selectedBranchId ? selectedBranchId : values.branch_id,
    };
    const formData = sanitizeFormData(payload, {
      fileKeys: ['upload_avatar'],
      ignoreKeys: ['customer_code'],
    });

    updateCustomer({ body: formData, id })
      .unwrap()
      .then(() => {
        dispatch(closeModal());
      });
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <Card className='modal-container'>
      <CustomerInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateCustomer;
