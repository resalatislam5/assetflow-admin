import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useCreateAttendanceMutation } from '../api/attendanceEndpoints';
import type { ICreateAttendance } from '../types/attendanceTypes';
import AttendanceInputs from './AttendanceInputs';

const CreateAttendance = () => {
  const [form] = Form.useForm();
  const [create, { isLoading }] = useCreateAttendanceMutation();

  const onFinish = async (values: ICreateAttendance) => {
    // Convert dayjs objects to standard ISO strings for backend
    const payload = {
      ...values,
      check_in: values.check_in
        ? dayjs(values.check_in).toISOString()
        : undefined,
      check_out: values.check_out
        ? dayjs(values.check_out).toISOString()
        : undefined,
    };
    const sanitizedValues = sanitizeObjectValue(payload);

    await create(sanitizedValues as ICreateAttendance)
      .unwrap()
      .then(() => form.resetFields());
  };

  return (
    <Card className='modal-container'>
      <AttendanceInputs
        onFinish={onFinish}
        form={form}
        loading={isLoading}
        editMode={false}
      />
    </Card>
  );
};

export default CreateAttendance;
