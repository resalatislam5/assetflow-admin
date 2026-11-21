import { Button, Divider, InputNumber, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import AntTable from '../../../../common/Table/AntTable';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import SingleContainer from '../../../../layout/components/SingleContainer';
import { useCreateAdditionMutation, useGenerateAdditionMutation } from '../api/additionEndpoints';
import AdditionInputs from '../components/AdditionInputs';
import type { ICreateAddition, IGenerateAddition, IGeneratedAddition } from '../types/additionTypes';

const GenerateAdditionPage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [generate, { isLoading: isGenerating }] = useGenerateAdditionMutation();
  const [create, { isLoading: isCreating }] = useCreateAdditionMutation();
  const [generatedAdditions, setgeneratedAdditions] = useState<IGeneratedAddition[] | null>(null);

  const onFinish = async (values: IGenerateAddition) => {
    const { month_year, ...rest } = values;
    const body = sanitizeObjectValue(rest);
    const res = await generate({
      ...body,
      month_year: dayjs(values.month_year).format('YYYY-MM'),
    }).unwrap();
    if (res.success) {
      setgeneratedAdditions(res.data);
    }
  };

  const handleAmountChange = (val: number | null, employeeId: string) => {
    setgeneratedAdditions((prev) => {
      if (!prev) return prev;
      return prev.map((item) =>
        item.employee_id === employeeId ? { ...item, amount: val || 0 } : item
      );
    });
  };

  const handleCreate = async () => {
    if (!generatedAdditions || generatedAdditions.length === 0) return;
    await create(generatedAdditions as ICreateAddition[]).unwrap();
    form.resetFields();
    setgeneratedAdditions(null);
    navigate('/payroll/addition');
  };

  return (
    <SingleContainer title='Generate Addition'>
      <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: '24px' }}>
        <AdditionInputs form={form} onFinish={onFinish} loading={isGenerating} />
      </div>
      
      {generatedAdditions && (
        <>
          <Divider style={{ margin: '0 0 24px 0' }} />
          <div style={{ padding: '0 16px' }}>
            <Typography.Title level={4} style={{ marginBottom: 16 }}>
              Preview & Adjust Amounts
            </Typography.Title>
            <AntTable
              dataSource={generatedAdditions}
              rowKey='employee_id'
              bordered
              size='small'
              pagination={false}
              columns={[
                { dataIndex: 'employee_name', title: 'Employee Name' },
                { dataIndex: 'employee_code', title: 'Employee ID' },
                { dataIndex: 'title', title: 'Addition Title' },
                { dataIndex: 'amount_type', title: 'Amount Type' },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  width: 150,
                  render: (val, record: IGeneratedAddition) => (
                    <InputNumber
                      value={val}
                      onChange={(v) => handleAmountChange(v, record.employee_id)}
                      style={{ width: '100%' }}
                    />
                  ),
                },
              ]}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Space size="middle">
                <Button onClick={() => setgeneratedAdditions(null)} size="large">Cancel</Button>
                <Button type='primary' loading={isCreating} onClick={handleCreate} size="large">
                  Confirm & Create
                </Button>
              </Space>
            </div>
          </div>
        </>
      )}
    </SingleContainer>
  );
};

export default GenerateAdditionPage;
