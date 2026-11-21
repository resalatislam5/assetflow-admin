import { Alert, Card, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import FromSubmit from '../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputTextArea,
} from '../../../common/Form/FormIInput';
import { sanitizeObjectValue } from '../../../common/utils/sanitizeObjectValue';
import { useAddStockInMutation } from '../api/storeEndpoints';
import type { IStockInPayload, IStoreProduct } from '../types/storeTypes';

type Props = {
  record: IStoreProduct;
};

const StockInModal = ({ record }: Props) => {
  const [form] = useForm();
  const [addStockIn, { isLoading }] = useAddStockInMutation();

  const onFinish = (values: IStockInPayload) => {
    const body = sanitizeObjectValue({
      ...values,
      date: values.date ? dayjs(values.date).toISOString() : new Date().toISOString(),
    });

    addStockIn({ id: record.id, body })
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <Alert
        type='info'
        showIcon
        style={{ marginBottom: 16 }}
        message={
          <div>
            <strong>Product:</strong> {record.name} (<code>{record.code}</code>) &nbsp;|&nbsp;{' '}
            <strong>Current Stock:</strong>{' '}
            <span style={{ color: '#1677ff', fontWeight: 600 }}>{record.current_stock}</span> &nbsp;|&nbsp;{' '}
            <strong>Unit Price:</strong> ৳{record.unit_price}
          </div>
        }
      />

      <Form onFinish={onFinish} form={form} layout='vertical'>
        <Row gutter={[12, 12]}>
          <FormInputNumber
            name='quantity'
            label='Stock In Quantity'
            placeholder='Enter incoming quantity'
            required
            lg={12}
          />

          <FormInputNumber
            name='unit_price'
            label='Updated Unit Price (৳)'
            placeholder={`Current: ৳${record.unit_price} (leave empty to keep)`}
            required={false}
            lg={12}
          />

          <FormInputDate
            name='date'
            label='Stock In Date'
            defaultValue={dayjs()}
            required={false}
            lg={24}
          />

          <FormInputTextArea
            name='remarks'
            label='Remarks / Supplier / Invoice Note'
            placeholder='e.g. Received from Supplier ABC, Invoice #1234'
            required={false}
            lg={24}
            rows={2}
          />
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <FromSubmit text='Confirm Stock In' loading={isLoading} />
        </div>
      </Form>
    </Card>
  );
};

export default StockInModal;
