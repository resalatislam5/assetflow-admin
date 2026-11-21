import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, InputNumber, Row, Select, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { closeModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import FromSubmit from '../../../../common/Button/FromSubmit';
import { FormInputSelect, FormInputTextArea } from '../../../../common/Form/FormIInput';
import {
  SelectBranch,
  SelectWarehouse,
  useGetProductSelectQuery,
} from '../../../../common/SelectWithApi';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateStockTransferMutation } from '../api/stockTransferEndpoints';
import type { ICreateStockTransferPayload } from '../types/stockTransferTypes';

const { Text } = Typography;

interface ITransferFormValues {
  from_branch_id?: number;
  to_branch_id?: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  status: 'DRAFT' | 'PENDING' | 'SENT' | 'IN_TRANSIT';
  notes?: string;
  items: Array<{
    product_id: number;
    variant_id?: number;
    quantity_sent: number;
  }>;
}

const CreateStockTransferModal = () => {
  const [form] = useForm<ITransferFormValues>();
  const dispatch = useAppDispatch();
  const [createTransfer, { isLoading }] = useCreateStockTransferMutation();
  const { data: productData } = useGetProductSelectQuery();

  const products = productData?.data || [];

  const onFinish = async (values: ITransferFormValues) => {
    const payload = sanitizeObjectValue({
      from_branch_id: values.from_branch_id ? Number(values.from_branch_id) : undefined,
      to_branch_id: values.to_branch_id ? Number(values.to_branch_id) : undefined,
      from_warehouse_id: Number(values.from_warehouse_id),
      to_warehouse_id: Number(values.to_warehouse_id),
      status: values.status || 'PENDING',
      notes: values.notes,
      items: values.items.map((item) => ({
        product_id: Number(item.product_id),
        variant_id: item.variant_id ? Number(item.variant_id) : undefined,
        quantity_sent: Number(item.quantity_sent),
      })),
    }) as unknown as ICreateStockTransferPayload;

    const res = await createTransfer(payload);
    if ('data' in res && res.data?.success) {
      form.resetFields();
      dispatch(closeModal());
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          status: 'PENDING',
          items: [{ quantity_sent: 1 }],
        }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Card
              size='small'
              title={<Text strong style={{ color: '#cf1322' }}>Source Location (From)</Text>}
              style={{ background: '#fff1f0', borderColor: '#ffa39e' }}
            >
              <SelectBranch
                name='from_branch_id'
                label='Source Branch'
                placeholder='Select origin branch'
                required={false}
              />
              <SelectWarehouse
                name='from_warehouse_id'
                label='Source Warehouse'
                placeholder='Select origin warehouse'
                required
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              size='small'
              title={<Text strong style={{ color: '#237804' }}>Destination Location (To)</Text>}
              style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}
            >
              <SelectBranch
                name='to_branch_id'
                label='Destination Branch'
                placeholder='Select destination branch'
                required={false}
              />
              <SelectWarehouse
                name='to_warehouse_id'
                label='Destination Warehouse'
                placeholder='Select destination warehouse'
                required
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <FormInputSelect
              name='status'
              label='Transfer Type / Initial Status'
              placeholder='Select status'
              required
              options={[
                { label: 'Requisition / Request (PENDING)', value: 'PENDING' },
                { label: 'Direct Dispatch (IN_TRANSIT)', value: 'IN_TRANSIT' },
                { label: 'Draft Transfer (DRAFT)', value: 'DRAFT' },
              ]}
            />
          </Col>

          <Col xs={24} md={12}>
            <FormInputTextArea
              name='notes'
              label='Transfer Notes / Purpose'
              placeholder='Reason for stock transfer, challan notes, truck info...'
              required={false}
              rows={2}
            />
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0 12px' }}>
          <Text strong>Transfer Line Items</Text>
        </Divider>

        <Form.List name='items'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                const currentProductId = form.getFieldValue(['items', name, 'product_id']);
                const currentProduct = products.find((p) => Number(p.id) === Number(currentProductId));
                const variantOpts =
                  currentProduct?.variants?.map((v) => ({
                    label: `${v.variant_name} (${v.sku})`,
                    value: v.id,
                  })) || [];

                return (
                  <Row
                    key={key}
                    gutter={[8, 8]}
                    align='middle'
                    style={{
                      background: '#fafafa',
                      padding: '8px 12px',
                      borderRadius: 6,
                      marginBottom: 8,
                      border: '1px solid #f0f0f0',
                    }}
                  >
                    <Col xs={24} sm={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'product_id']}
                        label={index === 0 ? 'Product' : ''}
                        rules={[{ required: true, message: 'Please select product' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Select
                          showSearch
                          placeholder='Select product'
                          optionFilterProp='label'
                          options={products.map((p) => ({
                            label: `${p.title} (${p.sku})`,
                            value: p.id,
                          }))}
                          onChange={() => {
                            form.setFieldValue(['items', name, 'variant_id'], undefined);
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={7}>
                      <Form.Item
                        {...restField}
                        name={[name, 'variant_id']}
                        label={index === 0 ? 'Variant' : ''}
                        style={{ marginBottom: 0 }}
                      >
                        <Select
                          allowClear
                          placeholder='Standard / No Variant'
                          options={variantOpts}
                          disabled={variantOpts.length === 0}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={18} sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity_sent']}
                        label={index === 0 ? 'Qty to Transfer' : ''}
                        rules={[{ required: true, message: 'Quantity is required' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber
                          min={1}
                          precision={0}
                          placeholder='Qty'
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={6} sm={2} style={{ textAlign: 'center', paddingTop: index === 0 ? 28 : 0 }}>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }}
                          onClick={() => remove(name)}
                        />
                      )}
                    </Col>
                  </Row>
                );
              })}

              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type='dashed'
                  onClick={() => add({ quantity_sent: 1 })}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Another Line Item
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <FromSubmit text='Initiate Stock Transfer' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default CreateStockTransferModal;
