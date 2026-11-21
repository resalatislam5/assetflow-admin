import { Card, Form, Spin } from 'antd';
import { useEffect } from 'react';
import {
  useGetSingleSupportTicketQuery,
  useUpdateSupportTicketMutation,
} from '../api/supportTicketEndpoints';
import SupportTicketInputs from './SupportTicketInputs';
import type { IUpdateSupportTicket } from '../types/supportTicketTypes';

type Props = {
  id: string | number;
};

const UpdateSupportTicket = ({ id }: Props) => {
  const [form] = Form.useForm<IUpdateSupportTicket>();
  const { data, isLoading: isFetching } = useGetSingleSupportTicketQuery(id);
  const [updateSupportTicket, { isLoading }] = useUpdateSupportTicketMutation();

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        status: data.data.status,
        priority: data.data.priority,
        admin_notes: data.data.admin_notes,
      });
    }
  }, [data, form]);

  const onFinish = (values: IUpdateSupportTicket) => {
    updateSupportTicket({ body: values, id });
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <SupportTicketInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
      />
    </Card>
  );
};

export default UpdateSupportTicket;

