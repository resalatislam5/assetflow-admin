import { Card, Col, Row, Statistic, Tag } from 'antd';
import { useState } from 'react';
import AntTable from '../../../../common/Table/AntTable';
import { numberWithComma } from '../../../../common/utils/numberFormate';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { useGetPayrollReportQuery } from '../api/payrollReportEndpoints';
import PayrollReportFilter from '../components/PayrollReportFilter';
import type { IPayrollReportQuery } from '../types/payrollReportTypes';

const PayrollReportList = () => {
  const [filter, setFilter] = useState<IPayrollReportQuery>({});
  const { data, isFetching } = useGetPayrollReportQuery(filter, {
    skip: !filter.from_month,
  });

  const columns = [
    {
      title: 'Month/Year',
      dataIndex: 'month_year',
      key: 'month_year',
    },
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
      render: (text: string, record: { employee_code?: string }) =>
        `${text} (${record.employee_code || ''})`,
    },
    {
      title: 'Department',
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      render: (text: number) => numberWithComma(text),
    },
    {
      title: 'Net Salary',
      dataIndex: 'net_salary',
      key: 'net_salary',
      render: (text: number) => numberWithComma(text),
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paid_amount',
      key: 'paid_amount',
      render: (text: number) => numberWithComma(text),
    },
    {
      title: 'Due Amount',
      key: 'due_amount',
      render: (_: unknown, record: { net_salary: number; paid_amount: number }) =>
        numberWithComma((record.net_salary || 0) - (record.paid_amount || 0)),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag
          color={
            text === 'APPROVED'
              ? 'green'
              : text === 'REJECTED'
                ? 'red'
                : 'orange'
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (text: string) => (
        <Tag
          color={
            text === 'PAID' ? 'green' : text === 'PARTIAL' ? 'blue' : 'red'
          }
        >
          {text}
        </Tag>
      ),
    },
  ];

  const summary = data?.summary;

  return (
    <ReportContainer
      title='Payroll Report'
      options={{ showDateRange: false }}
      exportExcel={
        data?.data
          ? {
              data: data?.data,
              columns: columns,
              fileName: 'payroll-report',
              summary: {
                month_year: 'Total:',
                basic_salary: summary?.total_basic_salary || 0,
                net_salary: summary?.total_net_salary || 0,
                paid_amount: summary?.total_paid_amount || 0,
                due_amount: summary?.total_due_amount || 0,
              },
            }
          : undefined
      }
    >
      <PayrollReportFilter filter={filter} setFilter={setFilter} />

      {filter.from_month && (
        <Card size='small' style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title='Total Basic Salary'
                value={numberWithComma(summary?.total_basic_salary || 0)}
                precision={2}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title='Total Net Salary'
                value={numberWithComma(summary?.total_net_salary || 0)}
                precision={2}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title='Total Paid Amount'
                value={numberWithComma(summary?.total_paid_amount || 0)}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title='Total Due Amount'
                value={numberWithComma(summary?.total_due_amount || 0)}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      <AntTable
        columns={columns}
        dataSource={data?.data}
        rowKey={(record) => String((record as { id?: string | number; month_year?: string; employee_code?: string }).id ?? `${(record as { month_year?: string }).month_year}-${(record as { employee_code?: string }).employee_code}`)}
        loading={isFetching}
        bordered
        size='small'
        pagination={false}
      />
    </ReportContainer>
  );
};

export default PayrollReportList;
