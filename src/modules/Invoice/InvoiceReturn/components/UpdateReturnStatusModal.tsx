import { Card, Form, Row } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputSelect,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateReturnStatusMutation } from '../api/invoiceReturnEndpoints';
import type { IOrderReturn, IUpdateReturnStatus } from '../types/invoiceReturnTypes';

type Props = {
  record: IOrderReturn;
};

const UpdateReturnStatusModal = ({ record }: Props) => {
  const [form] = Form.useForm<IUpdateReturnStatus>();
  const dispatch = useAppDispatch();
  const [updateReturnStatus, { isLoading }] = useUpdateReturnStatusMutation();

  const onFinish = async (values: IUpdateReturnStatus) => {
    const sanitized = sanitizeObjectValue(values) as IUpdateReturnStatus;
    const res = await updateReturnStatus({ id: record.id, body: sanitized });
    if ('data' in res && res.data?.success) {
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <Form
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{
        status: record.status,
        refund_status: record.refund_status,
        refund_amount: record.refund_amount,
        delivery_charge_treatment: record.delivery_charge_treatment || 'DEDUCT_DELIVERY',
        admin_notes: record.admin_notes,
      }}
    >
      <Row gutter={[12, 12]}>
        <FormInputSelect
          name='status'
          label='Return Status'
          placeholder='Select status'
          required
          lg={12}
          options={[
            { label: 'PENDING', value: 'PENDING' },
            { label: 'REQUESTED', value: 'REQUESTED' },
            { label: 'APPROVED', value: 'APPROVED' },
            { label: 'REJECTED', value: 'REJECTED' },
            { label: 'PICKED_UP', value: 'PICKED_UP' },
            { label: 'RECEIVED', value: 'RECEIVED' },
            { label: 'REFUNDED', value: 'REFUNDED' },
            { label: 'COMPLETED', value: 'COMPLETED' },
          ]}
        />

        <FormInputSelect
          name='refund_status'
          label='Refund Status'
          placeholder='Select refund status'
          required={false}
          lg={12}
          options={[
            { label: 'PENDING', value: 'PENDING' },
            { label: 'PROCESSED', value: 'PROCESSED' },
            { label: 'COMPLETED', value: 'COMPLETED' },
            { label: 'REJECTED', value: 'REJECTED' },
          ]}
        />

        <FormInputSelect
          name='delivery_charge_treatment'
          label='Delivery Charge Treatment'
          placeholder='Select who bears delivery charge'
          required={false}
          lg={12}
          options={[
            {
              label: 'Customer Bears Delivery Charge (Deduct Delivery Fee)',
              value: 'DEDUCT_DELIVERY',
            },
            {
              label: 'Company Bears Delivery Charge (Full Refund)',
              value: 'REFUND_FULL',
            },
          ]}
        />

        <FormInputNumber
          name='refund_amount'
          label='Refund Amount (BDT)'
          placeholder='Enter amount to refund'
          required={false}
          lg={12}
          min={0}
        />

        <FormInputTextArea
          name='admin_notes'
          label='Admin Notes / Instructions'
          placeholder='Reason for rejection or processing details'
          required={false}
          lg={24}
          rows={2}
        />
      </Row>

      <FromSubmit text='Update Return Status' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default UpdateReturnStatusModal;
