import { Button, Divider, InputNumber, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import AntTable from '../../../../common/Table/AntTable';
import { sanitizeObjectValue } from '../../../../common/utils/sanitizeObjectValue';
import SingleContainer from '../../../../layout/components/SingleContainer';
import { useCreateDeductionMutation, useGenerateDeductionMutation } from '../api/deductionEndpoints';
import DeductionInputs from '../components/DeductionInputs';
import type { ICreateDeduction, IGenerateDeduction } from '../types/deductionTypes';

interface IGeneratedDeductionItem {
  employee_id: string;
  employee_name?: string;
  employee_code?: string;
  title?: string;
  amount_type?: string;
  amount?: number;
}

const GenerateDeductionPage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [generate, { isLoading: isGenerating }] = useGenerateDeductionMutation();
  const [create, { isLoading: isCreating }] = useCreateDeductionMutation();
  const [generatedDeductions, setgeneratedDeductions] = useState<IGeneratedDeductionItem[] | null>(null);

  const onFinish = async (values: IGenerateDeduction) => {
    const { month_year, ...rest } = values;
    const body = sanitizeObjectValue(rest);
    const res = await generate({
      ...body,
      month_year: dayjs(values.month_year).format('YYYY-MM'),
    }).unwrap();
    if (res.success) {
      setgeneratedDeductions(res.data);
    }
  };

  const handleAmountChange = (val: number | null, employeeId: string) => {
    setgeneratedDeductions((prev) => {
      if (!prev) return prev;
      return prev.map((item) =>
        item.employee_id === employeeId ? { ...item, amount: val || 0 } : item
      );
    });
  };

  const handleCreate = async () => {
    if (!generatedDeductions || generatedDeductions.length === 0) return;
    await create(generatedDeductions as ICreateDeduction[]).unwrap();
    form.resetFields();
    setgeneratedDeductions(null);
    navigate('/payroll/Deduction');
  };

  return (
    <SingleContainer title='Generate Deduction'>
      <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: '24px' }}>
        <DeductionInputs form={form} onFinish={onFinish} loading={isGenerating} />
      </div>
      
      {generatedDeductions && (
        <>
          <Divider style={{ margin: '0 0 24px 0' }} />
          <div style={{ padding: '0 16px' }}>
            <Typography.Title level={4} style={{ marginBottom: 16 }}>
              Preview & Adjust Amounts
            </Typography.Title>
            <AntTable
              dataSource={generatedDeductions}
              rowKey='employee_id'
              bordered
              size='small'
              pagination={false}
              columns={[
                { dataIndex: 'employee_name', title: 'Employee Name' },
                { dataIndex: 'employee_code', title: 'Employee ID' },
                { dataIndex: 'title', title: 'Deduction Title' },
                { dataIndex: 'amount_type', title: 'Amount Type' },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  width: 150,
                  render: (val, record: IGeneratedDeductionItem) => (
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
                <Button onClick={() => setgeneratedDeductions(null)} size="large">Cancel</Button>
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

export default GenerateDeductionPage;
