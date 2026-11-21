import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateBalanceTransferMutation } from '../api/balanceTransferEndpoints';
import type {
  IBalanceTransferList,
  ICreateBalanceTransfer,
} from '../types/balanceTransferTypes';
import BalanceTransferInputs from './BalanceTransferInputs';

type Props = {
  record: IBalanceTransferList;
};

const UpdateBalanceTransfer = ({ record }: Props) => {
  const [form] = useForm<ICreateBalanceTransfer>();
  const dispatch = useAppDispatch();
  const [update, { isLoading }] = useUpdateBalanceTransferMutation();

  const onFinish = (values: ICreateBalanceTransfer) => {
    const formatted = {
      ...values,
      transfer_date: values.transfer_date && dayjs.isDayjs(values.transfer_date)
        ? (values.transfer_date as dayjs.Dayjs).format('YYYY-MM-DD')
        : values.transfer_date,
    };
    const body = sanitizeObjectValue(formatted);
    update({ body, id: record.id })
      .unwrap()
      .then(() => {
        form.resetFields();
        dispatch(closeModal());
      });
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        from_account_id: record.from_account_id,
        to_account_id: record.to_account_id,
        amount: Number(record.amount) || 0,
        charge_amount: Number(record.charge_amount) || 0,
        transfer_date: record.transfer_date ? dayjs(record.transfer_date) : dayjs(),
        reference: record.reference,
        notes: record.notes,
      });
    }
  }, [form, record]);

  return (
    <Card size='small' className='modal-container'>
      <BalanceTransferInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateBalanceTransfer;
