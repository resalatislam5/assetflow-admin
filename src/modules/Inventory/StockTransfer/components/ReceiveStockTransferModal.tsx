import { Alert, Card, Form, Input, InputNumber, Space, Table, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { closeModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import FromSubmit from '../../../../common/Button/FromSubmit';
import { useGetSingleStockTransferQuery, useReceiveStockTransferMutation } from '../api/stockTransferEndpoints';
import type { IStockTransfer, IStockTransferItem } from '../types/stockTransferTypes';

const { Text } = Typography;

interface IReceiveFormValues {
  notes?: string;
  items: Array<{
    item_id: number;
    quantity_received: number;
  }>;
}

type Props = {
  record: IStockTransfer;
};

const ReceiveStockTransferModal = ({ record }: Props) => {
  const [form] = useForm<IReceiveFormValues>();
  const dispatch = useAppDispatch();
  const { data, isLoading: isFetchingTransfer } = useGetSingleStockTransferQuery(record.id);
  const [receiveTransfer, { isLoading }] = useReceiveStockTransferMutation();

  const transfer = data?.data || record;
  const items = transfer.items || [];

  useEffect(() => {
    if (items.length > 0) {
      form.setFieldsValue({
        items: items.map((item) => ({
          item_id: item.id,
          quantity_received: Number(item.quantity_sent),
        })),
      });
    }
  }, [form, items]);

  const onFinish = async (values: IReceiveFormValues) => {
    const res = await receiveTransfer({
      id: transfer.id,
      body: {
        items: values.items.map((i) => ({
          item_id: Number(i.item_id),
          quantity_received: Number(i.quantity_received),
        })),
        notes: values.notes,
      },
    });

    if ('data' in res && res.data?.success) {
      form.resetFields();
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container' loading={isFetchingTransfer}>
      <Alert
        type='info'
        showIcon
        style={{ marginBottom: 16 }}
        message={
          <div>
            <strong>Voucher:</strong> {transfer.transfer_number} &nbsp;|&nbsp;{' '}
            <strong>From:</strong> {transfer.from_warehouse_name} &nbsp;&rarr;&nbsp;{' '}
            <strong>To:</strong> {transfer.to_warehouse_name}
          </div>
        }
      />

      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Table<IStockTransferItem>
          dataSource={items}
          rowKey='id'
          pagination={false}
          size='small'
          bordered
          columns={[
            {
              title: 'Product Title',
              dataIndex: 'product_title',
              key: 'product_title',
              render: (title: string, item) => (
                <div>
                  <strong>{title}</strong>
                  {item.variant_name && <span style={{ color: '#1677ff' }}> ({item.variant_name})</span>}
                  <div style={{ fontSize: 11, color: '#999' }}>SKU: {item.product_sku}</div>
                </div>
              ),
            },
            {
              title: 'Dispatched Qty',
              dataIndex: 'quantity_sent',
              key: 'quantity_sent',
              width: 120,
              align: 'center',
              render: (qty: number) => <Text strong>{qty}</Text>,
            },
            {
              title: 'Quantity Received',
              key: 'quantity_received',
              width: 180,
              align: 'center',
              render: (_, item, index) => (
                <Space>
                  <Form.Item
                    name={['items', index, 'item_id']}
                    initialValue={item.id}
                    hidden
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={['items', index, 'quantity_received']}
                    initialValue={item.quantity_sent}
                    rules={[{ required: true, message: 'Required' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber
                      min={0}
                      max={item.quantity_sent}
                      precision={0}
                      style={{ width: 120 }}
                    />
                  </Form.Item>
                </Space>
              ),
            },
          ]}
        />

        <Form.Item
          name='notes'
          label='Receipt Notes / Discrepancy Reason'
          style={{ marginTop: 16 }}
        >
          <Input.TextArea
            rows={2}
            placeholder='Log any damaged goods, broken boxes, or missing items observed upon physical unloading'
          />
        </Form.Item>

        <FromSubmit text='Confirm & Accept Stock Receipt' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default ReceiveStockTransferModal;
