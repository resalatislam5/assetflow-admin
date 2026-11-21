import { Col, Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputNumber,
  FormInputSelect,
} from '../../../../common/Form/FormIInput';
import type { IUpdateLoyaltyPointConfig } from '../types/loyaltyPointTypes';

type Props = {
  onFinish: (values: IUpdateLoyaltyPointConfig) => void;
  form: FormInstance<IUpdateLoyaltyPointConfig>;
  loading: boolean;
};

const SYSTEM_STATUS_OPTIONS = [
  { value: true, label: 'Active (Points Enabled)' },
  { value: false, label: 'Inactive (Points Disabled)' },
];

const LoyaltyPointConfigInputs = ({ onFinish, form, loading }: Props) => {
  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        is_enabled: true,
        earning_spending_amount: 100,
        earning_points: 1,
        min_order_amount_for_earning: 0,
        redemption_points: 10,
        redemption_amount: 1,
        min_points_to_redeem: 10,
        max_discount_percentage: 50,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
              General Status
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#64748b' }}>
              Control whether the customer loyalty points system is globally active or paused.
            </p>
          </div>
        </Col>

        <FormInputSelect
          name='is_enabled'
          label='Point System Status'
          options={SYSTEM_STATUS_OPTIONS}
          required
          md={12}
          lg={8}
          xs={24}
        />

        <Col span={24}>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              marginBottom: 8,
              marginTop: 8,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: '#065f46' }}>
              Points Earning Rules (Order Placement)
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#047857' }}>
              Define how many points customers earn when completing orders.
            </p>
          </div>
        </Col>

        <FormInputNumber
          name='earning_spending_amount'
          label='Spending Amount (BDT )'
          placeholder='e.g. 100'
          required
          min={1}
          md={12}
          lg={8}
          xs={24}
        />

        <FormInputNumber
          name='earning_points'
          label='Points Earned'
          placeholder='e.g. 1'
          required
          min={1}
          md={12}
          lg={8}
          xs={24}
        />

        <FormInputNumber
          name='min_order_amount_for_earning'
          label='Minimum Order Amount to Earn (BDT )'
          placeholder='e.g. 0'
          required
          min={0}
          md={12}
          lg={8}
          xs={24}
        />

        <Col span={24}>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              marginBottom: 8,
              marginTop: 8,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: '#1e40af' }}>
              Points Redemption Rules (Discounts)
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#1d4ed8' }}>
              Define how many points convert into discount Taka and checkout redemption limits.
            </p>
          </div>
        </Col>

        <FormInputNumber
          name='redemption_points'
          label='Redemption Points'
          placeholder='e.g. 10'
          required
          min={1}
          md={12}
          lg={6}
          xs={24}
        />

        <FormInputNumber
          name='redemption_amount'
          label='Discount Value (BDT )'
          placeholder='e.g. 1'
          required
          min={0.1}
          md={12}
          lg={6}
          xs={24}
        />

        <FormInputNumber
          name='min_points_to_redeem'
          label='Minimum Points to Redeem'
          placeholder='e.g. 10'
          required
          min={0}
          md={12}
          lg={6}
          xs={24}
        />

        <FormInputNumber
          name='max_discount_percentage'
          label='Max Discount per Order (%)'
          placeholder='e.g. 50'
          required
          min={1}
          max={100}
          md={12}
          lg={6}
          xs={24}
        />

        <Col span={24}>
          <FromSubmit
            text='Update Loyalty Points Settings'
            loading={loading}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default LoyaltyPointConfigInputs;
