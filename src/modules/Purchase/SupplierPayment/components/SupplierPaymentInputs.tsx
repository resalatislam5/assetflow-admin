import { Form, Row, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import {
  FormInputDate,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
  FormInputTextArea,
} from '../../../../common/Form/FormIInput';
import {
  SelectAccount,
  SelectBranch,
  SelectSupplier,
} from '../../../../common/SelectWithApi';
import FromSubmit from '../../../../common/Button/FromSubmit';
import type { ICreateSupplierPayment } from '../types/supplierPaymentTypes';

type Props = {
  onFinish: (values: ICreateSupplierPayment) => void;
  loading: boolean;
  form: FormInstance<ICreateSupplierPayment>;
  initialSupplierId?: number | string;
};

const SupplierPaymentInputs = ({
  onFinish,
  loading,
  form,
  initialSupplierId,
}: Props) => {
  return (
    <Form<ICreateSupplierPayment>
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={{
        payment_date: dayjs(),
        payment_method: 'CASH',
        supplier_id: initialSupplierId,
      }}
    >
      <Row gutter={[16, 0]}>
        <SelectSupplier
          name='supplier_id'
          label='Payable Supplier'
          required
          md={12}
        />
        <SelectBranch
          name='branch_id'
          label='Branch'
          md={12}
        />
        <SelectAccount
          name='account_id'
          label='Disbursement Account'
          required
          md={12}
        />
        <FormInputSelect
          name='payment_method'
          label='Payment Method'
          required
          md={12}
          options={[
            { label: 'Cash', value: 'CASH' },
            { label: 'Bank Transfer', value: 'BANK' },
            { label: 'Mobile Banking', value: 'MOBILE_BANKING' },
            { label: 'Cheque', value: 'CHEQUE' },
            { label: 'Other', value: 'OTHER' },
          ]}
        />
        <FormInputNumber
          name='amount'
          label='Payment Amount (৳)'
          placeholder='0.00'
          min={0.01}
          precision={2}
          required
          md={12}
        />
        <FormInputDate
          name='payment_date'
          label='Payment Date'
          required
          md={12}
        />
        <FormInputText
          name='reference'
          label='Reference / Txn ID / Cheque No'
          placeholder='e.g. Bank slip or bKash TrxID'
          md={12}
        />
        <FormInputText
          name='image'
          label='Voucher / Receipt Attachment URL'
          placeholder='e.g. https://... or voucher photo path'
          md={12}
        />
        <FormInputTextArea
          name='notes'
          label='Payment Remarks / Description'
          placeholder='Enter payment purpose or notes'
          rows={2}
          lg={24}
          md={24}
        />
        <FromSubmit text='Disburse Payment' loading={loading} />
      </Row>
    </Form>
  );
};

export default SupplierPaymentInputs;
