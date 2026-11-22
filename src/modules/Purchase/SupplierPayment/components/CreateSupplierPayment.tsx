import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useCreateSupplierPaymentMutation } from '../api/supplierPaymentEndpoints';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useActiveLocation } from '../../../../common/hooks/useActiveLocation';
import SupplierPaymentInputs from './SupplierPaymentInputs';
import type { ICreateSupplierPayment } from '../types/supplierPaymentTypes';

type Props = {
  supplierId?: number | string;
};

const CreateSupplierPayment = ({ supplierId }: Props) => {
  const [form] = Form.useForm<ICreateSupplierPayment>();
  const { isBranch, selectedBranchId } = useActiveLocation();
  const [createPayment, { isLoading }] = useCreateSupplierPaymentMutation();

  useEffect(() => {
    if (selectedBranchId) {
      form.setFieldValue('branch_id', selectedBranchId);
    }
  }, [selectedBranchId, form]);

  const onFinish = (values: ICreateSupplierPayment) => {
    const formattedValues: ICreateSupplierPayment = {
      ...values,
      branch_id: isBranch && selectedBranchId ? selectedBranchId : values.branch_id ? Number(values.branch_id) : undefined,
      amount: Number(values.amount),
      payment_date: values.payment_date
        ? dayjs(values.payment_date).toISOString()
        : undefined,
    };

    const sanitized = sanitizeObjectValue(
      formattedValues,
    ) as ICreateSupplierPayment;

    createPayment(sanitized)
      .unwrap()
      .then(() => {
        form.resetFields();
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <SupplierPaymentInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        initialSupplierId={supplierId}
      />
    </Card>
  );
};

export default CreateSupplierPayment;
