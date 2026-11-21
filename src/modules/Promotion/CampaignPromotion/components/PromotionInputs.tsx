import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import type { ICreatePromotion } from '../types/promotionTypes';

type Props = {
  onFinish: (values: ICreatePromotion) => void;
  form: FormInstance<ICreatePromotion>;
  loading: boolean;
  editMode?: boolean;
};

const PROMO_TYPE_OPTIONS = [
  { value: 'CATEGORY_DISCOUNT', label: 'Category Discount' },
  { value: 'BRAND_DISCOUNT', label: 'Brand Discount' },
  { value: 'BUY_X_GET_Y', label: 'Buy X Get Y (BOGO / Quantity Reward)' },
  { value: 'BILL_TOTAL_DISCOUNT', label: 'Bill Total Discount' },
];

const STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

const PromotionInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const selectedType = Form.useWatch('promo_type', form);

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        promo_type: 'BILL_TOTAL_DISCOUNT',
        buy_quantity: 1,
        get_quantity: 0,
        min_spend_amount: 0,
        is_active: true,
      }}
    >
      <Row gutter={[12, 12]}>
        <FormInputText
          name='name'
          label='Promotion / Campaign Name'
          placeholder='e.g. End of Season Mega Clearance'
          required
          md={12}
          lg={12}
          xs={24}
        />

        <FormInputSelect
          name='promo_type'
          label='Promotion Strategy Type'
          required
          options={PROMO_TYPE_OPTIONS}
          md={12}
          lg={12}
          xs={24}
        />

        {selectedType === 'BUY_X_GET_Y' ? (
          <>
            <FormInputNumber
              name='buy_quantity'
              label='Required Purchase Quantity (Buy X)'
              required
              min={1}
              placeholder='e.g. 2'
              md={12}
              lg={6}
              xs={24}
            />
            <FormInputNumber
              name='get_quantity'
              label='Complimentary Free Quantity (Get Y)'
              required
              min={1}
              placeholder='e.g. 1'
              md={12}
              lg={6}
              xs={24}
            />
          </>
        ) : (
          <>
            <FormInputNumber
              name='discount_percentage'
              label='Discount Percentage (%)'
              min={0.01}
              max={100}
              placeholder='e.g. 15 for 15%'
              md={12}
              lg={6}
              xs={24}
            />
            <FormInputNumber
              name='discount_amount'
              label='Fixed Discount Amount (BDT )'
              min={0.01}
              placeholder='e.g. 200'
              md={12}
              lg={6}
              xs={24}
            />
          </>
        )}

        <FormInputNumber
          name='min_spend_amount'
          label='Minimum Spend Amount (BDT )'
          min={0}
          placeholder='e.g. 1000'
          md={12}
          lg={6}
          xs={24}
        />

        <FormInputSelect
          name='is_active'
          label='Status'
          required
          options={STATUS_OPTIONS}
          md={12}
          lg={6}
          xs={24}
        />

        <FormInputDate
          name='start_date'
          label='Campaign Start Date'
          placeholder='Select start date'
          required
          md={12}
          lg={12}
          xs={24}
        />

        <FormInputDate
          name='end_date'
          label='Campaign End Date'
          placeholder='Select end date'
          required
          md={12}
          lg={12}
          xs={24}
        />
      </Row>

      <div style={{ marginTop: 16 }}>
        <FromSubmit
          text={editMode ? 'Update Campaign' : 'Create Campaign'}
          loading={loading}
        />
      </div>
    </Form>
  );
};

export default PromotionInputs;
