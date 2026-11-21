import { Alert, Card, Form, Row, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import FromSubmit from '../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import { sanitizeObjectValue } from '../../../common/utils/sanitizeObjectValue';
import { useAddDamagedMutation } from '../api/storeEndpoints';
import type { IDamagedPayload, IStoreProduct } from '../types/storeTypes';

type Props = {
  record: IStoreProduct;
};

const DamagedModal = ({ record }: Props) => {
  const [form] = useForm();
  const [addDamaged, { isLoading }] = useAddDamagedMutation();

  const onFinish = (values: IDamagedPayload) => {
    if (values.quantity > record.current_stock) {
      message.error(
        `Quantity cannot exceed current stock (${record.current_stock})`
      );
      return;
    }

    const body = sanitizeObjectValue({
      ...values,
      date: values.date ? dayjs(values.date).toISOString() : new Date().toISOString(),
    });

    addDamaged({ id: record.id, body })
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <Alert
        type='error'
        showIcon
        style={{ marginBottom: 16 }}
        message={
          <div>
            <strong>Product:</strong> {record.name} (<code>{record.code}</code>) &nbsp;|&nbsp;{' '}
            <strong>Available Stock to Write Off:</strong>{' '}
            <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{record.current_stock}</span>
          </div>
        }
      />

      <Form onFinish={onFinish} form={form} layout='vertical'>
        <Row gutter={[12, 12]}>
          <FormInputNumber
            name='quantity'
            label='Damaged / Wasted Quantity'
            placeholder={`Enter quantity to mark damaged (Max: ${record.current_stock})`}
            required
            lg={24}
            rules={[
              {
                validator: async (_rule: unknown, value: unknown) => {
                  if (value && Number(value) > record.current_stock) {
                    throw new Error(
                      `Quantity cannot exceed available stock (${record.current_stock})`
                    );
                  }
                },
              },
            ]}
          />

          <FormInputDate
            name='date'
            label='Date of Occurrence / Inspection'
            defaultValue={dayjs()}
            required={false}
            lg={24}
          />

          <FormInputTextArea
            name='remarks'
            label='Reason / Damage Description'
            placeholder='e.g. Expired, Broken during shipment, Defective batch'
            required={false}
            lg={24}
            rows={2}
          />
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <FromSubmit text='Confirm Damaged Quantity' loading={isLoading} disabled={record.current_stock <= 0} />
        </div>
      </Form>
    </Card>
  );
};

export default DamagedModal;
