import { Card } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import { useUpdateAdditionMutation } from '../api/additionEndpoints';
import type { IAddition, ICreateAddition } from '../types/additionTypes';
import AdditionInputs from './AdditionInputs';

type Props = {
  record: IAddition;
};

const UpdateAddition = ({ record }: Props) => {
  const [form] = useForm();
  const { _id } = record;

  const [update, { isLoading }] = useUpdateAdditionMutation();

  const onFinish = async (values: ICreateAddition) => {
    const { month_year, ...rest } = values;

    const body = sanitizeObjectValue(rest);
    await update({
      id: _id as string,
      body: {
        ...body,
        month_year: dayjs(values.month_year).format('YYYY-MM'),
      },
    }).unwrap();
    form.resetFields();
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        employee_id: record.employee_id,
        month_year: dayjs(record.month_year, 'YYYY-MM'),
      });
    }
  }, [record, form]);

  return (
    <Card className='modal-container'>
      <AdditionInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode={true}
      />
    </Card>
  );
};

export default UpdateAddition;
