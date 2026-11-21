import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateBalanceAdjustmentMutation } from '../api/balanceAdjustmentEndpoints';
import type {
  IBalanceAdjustmentList,
  ICreateBalanceAdjustment,
} from '../types/balanceAdjustmentTypes';
import BalanceAdjustmentInputs from './BalanceAdjustmentInputs';

type Props = {
  record: IBalanceAdjustmentList;
};

const UpdateBalanceAdjustment = ({ record }: Props) => {
  const [form] = useForm<ICreateBalanceAdjustment>();
  const dispatch = useAppDispatch();
  const [update, { isLoading }] = useUpdateBalanceAdjustmentMutation();

  const onFinish = (values: ICreateBalanceAdjustment) => {
    const formatted = {
      ...values,
      adjustment_date: values.adjustment_date && dayjs.isDayjs(values.adjustment_date)
        ? (values.adjustment_date as dayjs.Dayjs).format('YYYY-MM-DD')
        : values.adjustment_date,
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
        account_id: record.account_id,
        type: record.type,
        amount: Number(record.amount) || 0,
        adjustment_date: record.adjustment_date ? dayjs(record.adjustment_date) : dayjs(),
        reason: record.reason,
        notes: record.notes,
      });
    }
  }, [form, record]);

  return (
    <Card size='small' className='modal-container'>
      <BalanceAdjustmentInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateBalanceAdjustment;
