import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateBalanceAdjustmentMutation } from '../api/balanceAdjustmentEndpoints';
import type { ICreateBalanceAdjustment } from '../types/balanceAdjustmentTypes';
import BalanceAdjustmentInputs from './BalanceAdjustmentInputs';

const CreateBalanceAdjustment = () => {
  const [form] = useForm<ICreateBalanceAdjustment>();
  const dispatch = useAppDispatch();
  const [create, { isLoading }] = useCreateBalanceAdjustmentMutation();

  const onFinish = (values: ICreateBalanceAdjustment) => {
    const formatted = {
      ...values,
      adjustment_date: values.adjustment_date && dayjs.isDayjs(values.adjustment_date)
        ? (values.adjustment_date as dayjs.Dayjs).format('YYYY-MM-DD')
        : values.adjustment_date,
    };
    const body = sanitizeObjectValue(formatted);
    create(body)
      .unwrap()
      .then(() => {
        form.resetFields();
        dispatch(closeModal());
      });
  };

  return (
    <Card size='small' className='modal-container'>
      <BalanceAdjustmentInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
      />
    </Card>
  );
};

export default CreateBalanceAdjustment;
