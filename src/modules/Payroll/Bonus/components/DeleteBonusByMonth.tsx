import { Button, Card, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { closeModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { FormInputDate } from '../../../../common/Form/FormIInput';
import { useDeleteBonusByMonthMutation } from '../api/bonusEndpoints';

const DeleteBonusByMonth = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const [deleteByMonth, { isLoading }] = useDeleteBonusByMonthMutation();

  const onFinish = (values: { month_year: dayjs.Dayjs | string }) => {
    const month_year = dayjs(values.month_year).format('YYYY-MM');
    deleteByMonth(month_year).unwrap();
  };

  return (
    <Card className='modal-container'>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <FormInputDate
          name='month_year'
          label='Select Month & Year'
          required
          picker='month'
          lg={24}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
          <Button type='primary' danger htmlType='submit' loading={isLoading}>
            Delete Bonuses
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default DeleteBonusByMonth;
