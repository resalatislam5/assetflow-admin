import { Form, Row, type FormInstance } from 'antd';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import { useGetBranchListQuery } from '../../../Inventory/Branch/api/branchEndpoints';
import { useGetWarehouseSelectQuery } from '../../../Inventory/Warehouse/api/warehouseEndpoints';
import type { ICreateCoupon } from '../types/couponTypes';

type Props = {
  onFinish: (values: ICreateCoupon) => void;
  form: FormInstance<ICreateCoupon>;
  loading: boolean;
  editMode?: boolean;
};

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'PERCENTAGE', label: 'Percentage (%)' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount (BDT )' },
];

const STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

const MEMBER_ONLY_OPTIONS = [
  { value: false, label: 'All Customers (Public)' },
  { value: true, label: 'Registered Members Only' },
];

const APPROVAL_OPTIONS = [
  { value: false, label: 'No (Auto Apply)' },
  { value: true, label: 'Yes (Requires Manager Approval)' },
];

const DAYS_OF_WEEK_OPTIONS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const CouponInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const { data: branchData } = useGetBranchListQuery({ limit: 100, skip: 0 });
  const { data: warehouseData } = useGetWarehouseSelectQuery();

  const branchOptions = [
    { value: '', label: 'All Branches (Global)' },
    ...(branchData?.data?.map((b) => ({ value: b.id, label: b.name })) || []),
  ];

  const warehouseOptions = [
    { value: '', label: 'All Warehouses (Global)' },
    ...(warehouseData?.data?.map((w) => ({ value: w.id, label: w.name })) || []),
  ];

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        discount_type: 'PERCENTAGE',
        discount_value: 10,
        min_order_amount: 0,
        min_item_quantity: 1,
        usage_limit_per_customer: 1,
        member_only: false,
        requires_manager_approval: false,
        is_active: true,
      }}
    >
      <Row gutter={[12, 12]}>
        <FormInputText
          name='code'
          label='Coupon Code'
          placeholder='e.g. SUMMER2026'
          required
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputText
          name='title'
          label='Coupon Title'
          placeholder='e.g. Summer Super Saver'
          required
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputSelect
          name='discount_type'
          label='Discount Type'
          required
          options={DISCOUNT_TYPE_OPTIONS}
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputNumber
          name='discount_value'
          label='Discount Value'
          required
          min={0.01}
          placeholder='e.g. 10 or 100'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputNumber
          name='min_order_amount'
          label='Minimum Order Amount (BDT )'
          min={0}
          placeholder='e.g. 500'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputNumber
          name='max_discount_amount'
          label='Maximum Discount Cap (BDT )'
          min={0}
          placeholder='Optional maximum limit'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputNumber
          name='min_item_quantity'
          label='Minimum Item Quantity'
          min={1}
          placeholder='e.g. 1'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputSelect
          name='branch_id'
          label='Applicable Branch'
          options={branchOptions}
          placeholder='Select branch or All'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputSelect
          name='warehouse_id'
          label='Applicable Warehouse'
          options={warehouseOptions}
          placeholder='Select warehouse or All'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputSelect
          name='member_only'
          label='Audience Scope'
          options={MEMBER_ONLY_OPTIONS}
          required
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputSelect
          name='requires_manager_approval'
          label='Manager Approval'
          options={APPROVAL_OPTIONS}
          required
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputSelect
          name='is_active'
          label='Status'
          required
          options={STATUS_OPTIONS}
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputDate
          name='start_date'
          label='Start Date'
          placeholder='Select start date'
          required
          md={12}
          lg={6}
          xs={24}
        />
        <FormInputDate
          name='end_date'
          label='End Date'
          placeholder='Select end date'
          required
          md={12}
          lg={6}
          xs={24}
        />
        <FormInputText
          name='start_time'
          label='Active Start Time'
          placeholder='e.g. 09:00:00 (Optional)'
          md={12}
          lg={6}
          xs={24}
        />
        <FormInputText
          name='end_time'
          label='Active End Time'
          placeholder='e.g. 21:00:00 (Optional)'
          md={12}
          lg={6}
          xs={24}
        />
        <FormInputSelect
          name='applicable_days'
          label='Applicable Days of Week'
          options={DAYS_OF_WEEK_OPTIONS}
          mode='multiple'
          placeholder='All days if empty'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputNumber
          name='usage_limit_total'
          label='Total Usage Limit'
          min={1}
          placeholder='Total redemptions allowed'
          md={12}
          lg={8}
          xs={24}
        />
        <FormInputNumber
          name='usage_limit_per_customer'
          label='Usage Limit Per Customer'
          min={1}
          placeholder='Max per individual customer'
          md={12}
          lg={8}
          xs={24}
        />
      </Row>

      <div style={{ marginTop: 16 }}>
        <FromSubmit
          text={editMode ? 'Update Coupon' : 'Create Coupon'}
          loading={loading}
        />
      </div>
    </Form>
  );
};

export default CouponInputs;
