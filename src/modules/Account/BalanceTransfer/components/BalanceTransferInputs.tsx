import { Form, Row, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputNumber,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import { SelectAccount } from '../../../../common/SelectWithApi/Select';
import type { ICreateBalanceTransfer } from '../types/balanceTransferTypes';

type Props = {
  onFinish: (values: ICreateBalanceTransfer) => void;
  form: FormInstance<ICreateBalanceTransfer>;
  loading: boolean;
  editMode?: boolean;
};

const BalanceTransferInputs = ({
  onFinish,
  form,
  loading,
  editMode,
}: Props) => {
  return (
    <Form
      onFinish={onFinish}
      form={form}
      initialValues={{ transfer_date: dayjs() }}
      layout='vertical'
    >
      <Row gutter={[12, 12]}>
        <SelectAccount
          lg={12}
          name='from_account_id'
          label='From Account'
          required
        />
        <SelectAccount
          lg={12}
          name='to_account_id'
          label='To Account'
          required
        />
        <FormInputNumber
          lg={12}
          name='amount'
          label='Transfer Amount'
          required
          min={0.01}
        />
        <FormInputNumber
          lg={12}
          name='charge_amount'
          label='Transfer Charge'
          min={0}
        />
        <FormInputDate
          lg={12}
          name='transfer_date'
          label='Transfer Date'
          required
        />
        <FormInputText
          lg={12}
          name='reference'
          label='Reference'
          placeholder='Receipt or bank ref number'
        />
        <FormInputTextArea
          lg={24}
          name='notes'
          label='Notes'
          rows={3}
          placeholder='Transfer notes or remarks'
        />
      </Row>
      <FromSubmit
        text={editMode ? 'Update Balance Transfer' : 'Create Balance Transfer'}
        loading={loading}
      />
    </Form>
  );
};

export default BalanceTransferInputs;
