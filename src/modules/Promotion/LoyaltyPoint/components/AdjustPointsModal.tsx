import { Card, Form, Row, Col, Alert } from 'antd';
import { useEffect } from 'react';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useAdjustCustomerPointsMutation } from '../api/loyaltyPointEndpoints';
import type { IAdjustCustomerPoints, ICustomerPoint } from '../types/loyaltyPointTypes';

type Props = {
  customer: ICustomerPoint;
};

const AdjustPointsModal = ({ customer }: Props) => {
  const [form] = Form.useForm<IAdjustCustomerPoints>();
  const [adjustPoints, { isLoading }] = useAdjustCustomerPointsMutation();

  useEffect(() => {
    form.setFieldsValue({
      customer_id: customer.id,
      points: 10,
      remarks: 'Manual adjustment by admin',
    });
  }, [customer, form]);

  const onFinish = async (values: IAdjustCustomerPoints) => {
    const payload = {
      ...values,
      customer_id: customer.id,
      points: Number(values.points),
      remarks: values.remarks || values.description || 'Manual adjustment by admin',
    };
    const sanitized = sanitizeObjectValue(payload) as IAdjustCustomerPoints;
    await adjustPoints(sanitized);
  };

  return (
    <Card size='small' className='modal-container'>
      <div style={{ marginBottom: 16 }}>
        <Alert
          message={
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                Customer: {customer.name} ({customer.phone || customer.email})
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Current Points Balance: <strong>{customer.reward_points}</strong> pts
              </div>
            </div>
          }
          type='info'
          showIcon
        />
      </div>

      <Form
        onFinish={onFinish}
        form={form}
        layout='vertical'
      >
        <Row gutter={[12, 12]}>
          <FormInputNumber
            name='points'
            label='Points Adjustment'
            placeholder='e.g. 50 to add, -20 to deduct'
            required
            md={24}
            lg={24}
            xs={24}
          />

          <FormInputText
            name='remarks'
            label='Reason / Remarks'
            placeholder='e.g. Order promotion bonus, courtesy adjustment'
            required
            md={24}
            lg={24}
            xs={24}
          />

          <Col span={24}>
            <FromSubmit
              text='Confirm Points Adjustment'
              loading={isLoading}
            />
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AdjustPointsModal;
