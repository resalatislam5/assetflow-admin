import { Form, Row, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import { SelectAccount } from '../../../../common/SelectWithApi/Select';
import type { ICreateBalanceAdjustment } from '../types/balanceAdjustmentTypes';

type Props = {
  onFinish: (values: ICreateBalanceAdjustment) => void;
  form: FormInstance<ICreateBalanceAdjustment>;
  loading: boolean;
  editMode?: boolean;
};

const ADJUSTMENT_TYPE_OPTIONS = [
  { value: 'INCREASE', label: 'INCREASE (+)' },
  { value: 'DECREASE', label: 'DECREASE (-)' },
];

const BalanceAdjustmentInputs = ({
  onFinish,
  form,
  loading,
  editMode,
}: Props) => {
  return (
    <Form
      onFinish={onFinish}
      form={form}
      initialValues={{ adjustment_date: dayjs(), type: 'INCREASE' }}
      layout='vertical'
    >
      <Row gutter={[12, 12]}>
        <SelectAccount
          lg={12}
          name='account_id'
          label='Account'
          required
        />
        <FormInputSelect
          lg={12}
          name='type'
          label='Adjustment Type'
          options={ADJUSTMENT_TYPE_OPTIONS}
          required
        />
        <FormInputNumber
          lg={12}
          name='amount'
          label='Adjustment Amount'
          required
          min={0.01}
        />
        <FormInputDate
          lg={12}
          name='adjustment_date'
          label='Adjustment Date'
          required
        />
        <FormInputText
          lg={24}
          name='reason'
          label='Reason'
          required
          placeholder='e.g. Reconciliation discrepancy, Bank fee reversal, Audit adjustment'
        />
        <FormInputTextArea
          lg={24}
          name='notes'
          label='Notes'
          rows={3}
          placeholder='Additional notes or reference details'
        />
      </Row>
      <FromSubmit
        text={editMode ? 'Update Balance Adjustment' : 'Create Balance Adjustment'}
        loading={loading}
      />
    </Form>
  );
};

export default BalanceAdjustmentInputs;
