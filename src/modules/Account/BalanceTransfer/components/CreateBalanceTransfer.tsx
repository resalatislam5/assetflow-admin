import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { closeModal } from '../../../../app/features/modalSlice';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateBalanceTransferMutation } from '../api/balanceTransferEndpoints';
import type { ICreateBalanceTransfer } from '../types/balanceTransferTypes';
import BalanceTransferInputs from './BalanceTransferInputs';

const CreateBalanceTransfer = () => {
  const [form] = useForm<ICreateBalanceTransfer>();
  const dispatch = useAppDispatch();
  const [create, { isLoading }] = useCreateBalanceTransferMutation();

  const onFinish = (values: ICreateBalanceTransfer) => {
    const formatted = {
      ...values,
      transfer_date: values.transfer_date && dayjs.isDayjs(values.transfer_date)
        ? (values.transfer_date as dayjs.Dayjs).format('YYYY-MM-DD')
        : values.transfer_date,
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
      <BalanceTransferInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
      />
    </Card>
  );
};

export default CreateBalanceTransfer;
