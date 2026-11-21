import { Card, Form, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { closeModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  useGetSingleAttendanceQuery,
  useUpdateAttendanceMutation,
} from '../api/attendanceEndpoints';
import type { ICreateAttendance } from '../types/attendanceTypes';
import AttendanceInputs from './AttendanceInputs';

type Props = {
  _id: string;
};

const UpdateAttendance = ({ _id }: Props) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { data, isLoading: isFetching } = useGetSingleAttendanceQuery(_id, {
    skip: !_id,
  });
  const [update, { isLoading: isUpdating }] = useUpdateAttendanceMutation();

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        ...data.data,
        date: data.data.date ? dayjs(data.data.date) : undefined,
        check_in: data.data.check_in ? dayjs(data.data.check_in) : undefined,
        check_out: data.data.check_out ? dayjs(data.data.check_out) : undefined,
      });
    }
  }, [data, form]);

  const onFinish = async (values: ICreateAttendance) => {
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

    await update({
      id: _id,
      body: sanitizedValues as Partial<ICreateAttendance>,
    }).unwrap();
    dispatch(closeModal());
  };

  if (isFetching) return <Skeleton active />;

  return (
    <Card className='modal-container'>
      <AttendanceInputs
        onFinish={onFinish}
        form={form}
        loading={isUpdating}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateAttendance;
