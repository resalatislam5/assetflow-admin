import { Form, Row } from 'antd';
import { useAppDispatch } from '../../../app/hooks/hooks';
import { closeModal } from '../../../app/features/modalSlice';
import FromSubmit from '../../../common/Button/FromSubmit';
import {
  FormInputSelect,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import { useUpdatePaymentStatusMutation } from '../api/paymentEndpoints';
import type { IUpdatePaymentStatus, PaymentStatus } from '../types/paymentTypes';

const STATUS_OPTIONS: { label: string; value: PaymentStatus }[] = [
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Successful', value: 'SUCCESSFUL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Authorized', value: 'AUTHORIZED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Expired', value: 'EXPIRED' },
];

interface Props {
  id: number | string;
  currentStatus: PaymentStatus;
  currentNotes?: string | null;
}

const UpdatePaymentStatusModal = ({ id, currentStatus, currentNotes }: Props) => {
  const [form] = Form.useForm<IUpdatePaymentStatus>();
  const dispatch = useAppDispatch();
  const [updateStatus, { isLoading }] = useUpdatePaymentStatusMutation();

  const onFinish = async (values: IUpdatePaymentStatus) => {
    const res = await updateStatus({ id, body: values });
    if ('data' in res && res.data?.success) {
      dispatch(closeModal());
    }
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{
        status: currentStatus,
        notes: currentNotes || '',
      }}
    >
      <Row gutter={[16, 0]}>
        <FormInputSelect
          name='status'
          label='New Payment Status'
          required
          xs={24}
          options={STATUS_OPTIONS}
        />
        <FormInputTextArea
          name='notes'
          label='Status Change Reason / Notes'
          placeholder='Reason for changing payment status...'
          xs={24}
        />
      </Row>
      <FromSubmit loading={isLoading} text='Update Status' />
    </Form>
  );
};

export default UpdatePaymentStatusModal;
