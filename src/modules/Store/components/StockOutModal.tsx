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
import { useAddStockOutMutation } from '../api/storeEndpoints';
import type { IStockOutPayload, IStoreProduct } from '../types/storeTypes';

type Props = {
  record: IStoreProduct;
};

const StockOutModal = ({ record }: Props) => {
  const [form] = useForm();
  const [addStockOut, { isLoading }] = useAddStockOutMutation();

  const onFinish = (values: IStockOutPayload) => {
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

    addStockOut({ id: record.id, body })
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <Alert
        type='warning'
        showIcon
        style={{ marginBottom: 16 }}
        message={
          <div>
            <strong>Product:</strong> {record.name} (<code>{record.code}</code>) &nbsp;|&nbsp;{' '}
            <strong>Available Current Stock:</strong>{' '}
            <span style={{ color: record.current_stock > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
              {record.current_stock}
            </span>
          </div>
        }
      />

      <Form onFinish={onFinish} form={form} layout='vertical'>
        <Row gutter={[12, 12]}>
          <FormInputNumber
            name='quantity'
            label='Stock Out Quantity'
            placeholder={`Enter quantity to dispatch (Max: ${record.current_stock})`}
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

          <FormInputNumber
            name='amount'
            label='Amount / Total Price'
            placeholder='Enter total amount received for this dispatch'
            required={false}
            lg={24}
            min={0}
          />

          <FormInputDate
            name='date'
            label='Stock Out Date'
            defaultValue={dayjs()}
            required={false}
            lg={24}
          />

          <FormInputTextArea
            name='remarks'
            label='Issued To / Department / Purpose'
            placeholder='e.g. Issued to IT Department / Project Alpha'
            required={false}
            lg={24}
            rows={2}
          />
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <FromSubmit text='Confirm Stock Out' loading={isLoading} disabled={record.current_stock <= 0} />
        </div>
      </Form>
    </Card>
  );
};

export default StockOutModal;
