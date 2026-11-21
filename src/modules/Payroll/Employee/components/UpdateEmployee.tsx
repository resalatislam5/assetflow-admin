import { Card, Skeleton } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import {
  useGetSingleEmployeeQuery,
  useUpdateEmployeeMutation,
} from '../api/employeeEndpoints';
import type { ICreateEmployee, IEmployee } from '../types/employeeTypes';
import EmployeeInputs from './EmployeeInputs';

type Props = {
  record: IEmployee;
};

const UpdateEmployee = ({ record }: Props) => {
  const [form] = useForm();
  const { _id } = record;

  const { data, isLoading: isFetching } = useGetSingleEmployeeQuery(
    _id as string,
    {
      skip: !_id,
    },
  );

  const [update, { isLoading }] = useUpdateEmployeeMutation();

  const onFinish = async (values: ICreateEmployee) => {
    const body = sanitizeObjectValue(values);
    await update({ id: _id as string, body });
  };

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue({
        ...data.data,
        joining_date: data.data.joining_date
          ? dayjs(data.data.joining_date)
          : undefined,
      });
    }
  }, [data, form]);

  if (isFetching) return <Skeleton active />;

  return (
    <Card className='modal-container'>
      <EmployeeInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateEmployee;
