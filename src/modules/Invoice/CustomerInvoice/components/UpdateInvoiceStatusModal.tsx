import {
  Alert,
  Card,
  Col,
  Form,
  Row,
  Statistic,
  Typography,
  theme,
} from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputSelect,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import { SelectWarehouse } from '../../../../common/SelectWithApi';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
} from '../api/invoiceEndpoints';
import type { IOrder, IUpdateOrderStatus } from '../types/invoiceTypes';

const { Text } = Typography;

const DELIVERY_CHARGE_OPTIONS = [
  {
    label: 'Customer Bears Delivery Charge (Deduct Delivery Fee)',
    value: 'DEDUCT_DELIVERY',
  },
  {
    label: 'Company Bears Delivery Charge (Full Refund)',
    value: 'REFUND_FULL',
  },
];

type Props = {
  record: IOrder;
};

const UpdateInvoiceStatusModal = ({ record }: Props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<IUpdateOrderStatus>();
  const dispatch = useAppDispatch();
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

  const { data: singleOrderRes } = useGetSingleOrderQuery(record.id, {
    skip: !record.id,
  });
  const order = singleOrderRes?.data || record;

  const selectedStatus = Form.useWatch('status', form);
  const selectedTreatment =
    Form.useWatch('delivery_charge_treatment', form) || 'DEDUCT_DELIVERY';

  const isCancelOrReturn =
    selectedStatus === 'CANCELLED' || selectedStatus === 'RETURNED';

  const grandTotal = Number(order.grand_total_amount || 0);
  const shippingAmount = Number(order.shipping_amount || 0);
  const paidAmount = Number(order.paid_amount || 0);
  const productAmount = Math.max(0, grandTotal - shippingAmount);
  const reversalAmount =
    selectedTreatment === 'DEDUCT_DELIVERY' ? productAmount : grandTotal;

  const onFinish = async (values: IUpdateOrderStatus) => {
    const sanitized = sanitizeObjectValue(values) as IUpdateOrderStatus;
    const res = await updateOrderStatus({ id: record.id, body: sanitized });
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
          status: order.status,
          delivery_charge_treatment:
            order.delivery_charge_treatment || 'DEDUCT_DELIVERY',
          admin_notes: order.admin_notes,
        }}
      >
        <Row gutter={[12, 12]}>
          <FormInputSelect
            name='status'
            label='New Invoice Status'
            placeholder='Select status'
            required
            lg={24}
            options={[
              { label: 'COMPLETED', value: 'COMPLETED' },
              { label: 'PENDING', value: 'PENDING' },
              { label: 'CANCELLED', value: 'CANCELLED' },
              { label: 'RETURNED', value: 'RETURNED' },
            ]}
          />

          {isCancelOrReturn && (
            <>
              <FormInputSelect
                name='delivery_charge_treatment'
                label='Delivery Charge Treatment'
                placeholder='Select who bears delivery charge'
                required
                lg={24}
                options={DELIVERY_CHARGE_OPTIONS}
              />

              <Col span={24}>
                <Card
                  size='small'
                  style={{
                    background: token.colorFillAlter,
                    borderRadius: token.borderRadiusLG,
                    marginBottom: 8,
                  }}
                >
                  <Row gutter={[12, 8]}>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={<Text type='secondary'>Order Total</Text>}
                        value={grandTotal}
                        precision={2}
                        prefix='BDT'
                        valueStyle={{ fontSize: 14 }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={<Text type='secondary'>Delivery Fee</Text>}
                        value={shippingAmount}
                        precision={2}
                        prefix='BDT'
                        valueStyle={{ fontSize: 14 }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={<Text type='secondary'>Customer Paid</Text>}
                        value={paidAmount}
                        precision={2}
                        prefix='BDT'
                        valueStyle={{ fontSize: 14 }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={
                          <Text strong type='danger'>
                            Reversal Credit
                          </Text>
                        }
                        value={reversalAmount}
                        precision={2}
                        prefix='BDT'
                        valueStyle={{ fontSize: 14, color: token.colorError }}
                      />
                    </Col>
                  </Row>
                  <Alert
                    type='info'
                    showIcon
                    style={{ marginTop: 8 }}
                    message={
                      selectedTreatment === 'DEDUCT_DELIVERY'
                        ? `Only the product amount (BDT ${productAmount.toFixed(2)}) will be reversed. The delivery charge (BDT ${shippingAmount.toFixed(2)}) is retained by company. Customer ledger will adjust accordingly.`
                        : `Full order amount (BDT ${grandTotal.toFixed(2)}) including delivery charge will be reversed into the customer ledger.`
                    }
                  />
                </Card>
              </Col>
            </>
          )}

          <SelectWarehouse
            name='warehouse_id'
            label='Fulfillment Warehouse'
            placeholder='Select warehouse to allocate order'
            required={false}
            lg={24}
          />

          <FormInputTextArea
            name='comment'
            label='Timeline Comment'
            placeholder='Reason for status change'
            required={false}
            lg={24}
            rows={2}
          />

          <FormInputTextArea
            name='cancel_reason'
            label='Cancellation / Return Reason'
            placeholder='Reason if cancelling or returning the order'
            required={false}
            lg={24}
            rows={2}
          />

          <FormInputTextArea
            name='admin_notes'
            label='Internal Admin Notes'
            placeholder='Internal order notes'
            required={false}
            lg={24}
            rows={2}
          />
        </Row>

        <FromSubmit text='Update Order Status' loading={isLoading} />
      </Form>
    </Card>
  );
};

export default UpdateInvoiceStatusModal;
