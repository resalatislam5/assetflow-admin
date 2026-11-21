import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { closeModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  useGetSingleAdvancePaymentQuery,
  useUpdateAdvancePaymentMutation,
} from '../api/advancePaymentEndpoints';
import type { ICreateAdvancePayment } from '../types/advancePaymentTypes';
import AdvancePaymentInputs from './AdvancePaymentInputs';

type Props = {
  _id: string;
};

const UpdateAdvancePayment = ({ _id }: Props) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data } = useGetSingleAdvancePaymentQuery(_id, {
    skip: !_id,
  });
  const [update, { isLoading: isUpdating }] = useUpdateAdvancePaymentMutation();

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        ...data.data,
        date: data.data.date ? dayjs(data.data.date) : undefined,
      });
    }
  }, [data, form]);

  const onFinish = async (values: ICreateAdvancePayment) => {
    const body = sanitizeObjectValue(values);

    await update({
      id: _id,
      body: body,
    }).unwrap();
    dispatch(closeModal());
  };

  return (
    <Card className='modal-container'>
      <AdvancePaymentInputs
        onFinish={onFinish}
        form={form}
        loading={isUpdating}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateAdvancePayment;
