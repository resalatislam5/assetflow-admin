import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  PercentageOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Progress, Row, Statistic, Table, Tag, type TableProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import {
  SelectDepartment,
  SelectEmployee,
} from '../../../../common/SelectWithApi/Select';
import AntTable from '../../../../common/Table/AntTable';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { useGetAttendanceSummaryReportQuery } from '../api/OnlyGetReportEndpoints';
import type {
  IAttendanceSummaryReportItem,
  IAttendanceSummaryReportQuery,
} from '../types/OnlyGetReportTypes';

const AttendanceSummaryReport = () => {
  const { query, setQuery } = useQueryParams<IAttendanceSummaryReportQuery>();

  // Ensure default 1-month date range (1st of month to end of month) is set if missing
  useEffect(() => {
    if (!query.from_date && !query.to_date) {
      setQuery({
        from_date: dayjs().startOf('month').format('YYYY-MM-DD'),
        to_date: dayjs().endOf('month').format('YYYY-MM-DD'),
      });
    }
  }, [query.from_date, query.to_date, setQuery]);

  const { data, isLoading, isFetching } = useGetAttendanceSummaryReportQuery(query);

  const reportData = data?.data || [];
  const summary = data?.summary;
  const totalEmployees = summary?.totalEmployees || reportData.length;
  const totalWorkingHours = summary?.totalWorkingHours || 0;
  const avgAttendanceRate = summary?.avgAttendanceRate || 0;
  const totalPresentDays = summary?.totalPresentDays || 0;
  const totalAbsentDays = summary?.totalAbsentDays || 0;
  const totalHalfDays = summary?.totalHalfDays || 0;
  const totalLeaveDays = summary?.totalLeaveDays || 0;

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employee_code',
      key: 'employee_code',
      width: 120,
      render: (code: string) => (
        <Tag color='purple' style={{ fontWeight: 600 }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: 'Department',
      dataIndex: 'department_name',
      key: 'department_name',
      render: (dept?: string) => dept || '-',
    },
    {
      title: 'Designation',
      dataIndex: 'designation_name',
      key: 'designation_name',
      render: (desig?: string) => desig || '-',
    },
    {
      title: 'Total Working Hours',
      dataIndex: 'total_working_hours',
      key: 'total_working_hours',
      width: 150,
      align: 'center' as const,
      render: (hrs: number) => (
        <span style={{ color: '#1677ff', fontWeight: 700, fontSize: 14 }}>
          {hrs || 0} hrs
        </span>
      ),
    },
    {
      title: 'Present (Full)',
      dataIndex: 'present_days',
      key: 'present_days',
      width: 110,
      align: 'center' as const,
      render: (days: number) => (
        <span style={{ color: '#52c41a', fontWeight: 600 }}>{days || 0}</span>
      ),
    },
    {
      title: 'Absent',
      dataIndex: 'absent_days',
      key: 'absent_days',
      width: 90,
      align: 'center' as const,
      render: (days: number) => (
        <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{days || 0}</span>
      ),
    },
    {
      title: 'Half Day',
      dataIndex: 'half_days',
      key: 'half_days',
      width: 95,
      align: 'center' as const,
      render: (days: number) => (
        <span style={{ color: '#fa8c16', fontWeight: 600 }}>{days || 0}</span>
      ),
    },
    {
      title: 'Leave',
      dataIndex: 'leave_days',
      key: 'leave_days',
      width: 90,
      align: 'center' as const,
      render: (days: number) => (
        <span style={{ color: '#722ed1', fontWeight: 600 }}>{days || 0}</span>
      ),
    },
    {
      title: 'Avg Hours/Day',
      dataIndex: 'avg_daily_hours',
      key: 'avg_daily_hours',
      width: 120,
      align: 'center' as const,
      render: (avg: number) => `${avg || 0} hrs`,
    },
    {
      title: 'Attendance Rate',
      dataIndex: 'attendance_rate',
      key: 'attendance_rate',
      width: 160,
      render: (rate: number) => {
        const percent = rate || 0;
        let strokeColor = '#52c41a';
        if (percent < 60) strokeColor = '#ff4d4f';
        else if (percent < 80) strokeColor = '#fa8c16';

        return (
          <Progress
            percent={percent}
            size='small'
            strokeColor={strokeColor}
            format={(val) => `${val}%`}
          />
        );
      },
    },
  ];

  return (
    <ReportContainer
      title='Monthly Attendance Summary'
      options={{
        showDateRange: true,
        showSearch: true,
        showExcel: true,
        showPrint: true,
      }}
      exportExcel={
        reportData.length > 0
          ? {
              data: reportData.map((item) => ({
                ...item,
                total_working_hours: `${item.total_working_hours} hrs`,
                avg_daily_hours: `${item.avg_daily_hours} hrs`,
                attendance_rate: `${item.attendance_rate}%`,
              })),
              fileName: 'Attendance_Summary_Report',
              columns: columns as unknown as TableProps<object>['columns'],
              summary: {
                employee_code: `Total Employees: ${totalEmployees}`,
                total_working_hours: `Total: ${totalWorkingHours} hrs`,
                present_days: `Present: ${totalPresentDays}`,
                absent_days: `Absent: ${totalAbsentDays}`,
                half_days: `Half Day: ${totalHalfDays}`,
                leave_days: `Leave: ${totalLeaveDays}`,
                attendance_rate: `Avg Rate: ${avgAttendanceRate}%`,
              },
            }
          : undefined
      }
      additionalFilter={
        <>
          <SelectDepartment
            label='Department'
            name='department_id'
            sm={8}
            md={8}
            lg={4}
            onChange={(val) =>
              setQuery({
                department_id: val ? String(val) : undefined,
                employee_id: undefined,
              })
            }
            defaultValue={query.department_id || undefined}
          />

          <SelectEmployee
            label='Employee'
            name='employee_id'
            sm={8}
            md={8}
            lg={4}
            department_id={query.department_id}
            onChange={(val) => setQuery({ employee_id: val ? String(val) : undefined })}
            defaultValue={query.employee_id || undefined}
          />
        </>
      }
    >
      {/* Top Metric Summary Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4} lg={4}>
          <Card
            size='small'
            bordered
            style={{ background: '#f0f5ff', borderColor: '#adc6ff', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#1d39c4', fontSize: 13, fontWeight: 500 }}>Employees</span>}
              value={totalEmployees}
              prefix={<TeamOutlined style={{ color: '#2f54eb', marginRight: 4 }} />}
              valueStyle={{ color: '#1d39c4', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4} lg={4}>
          <Card
            size='small'
            bordered
            style={{ background: '#e6f4ff', borderColor: '#91caff', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#0958d9', fontSize: 13, fontWeight: 500 }}>Total Working Hours</span>}
              value={totalWorkingHours}
              suffix='hrs'
              prefix={<FieldTimeOutlined style={{ color: '#1677ff', marginRight: 4 }} />}
              valueStyle={{ color: '#0958d9', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4} lg={4}>
          <Card
            size='small'
            bordered
            style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#237804', fontSize: 13, fontWeight: 500 }}>Avg Attendance Rate</span>}
              value={avgAttendanceRate}
              suffix='%'
              prefix={<PercentageOutlined style={{ color: '#52c41a', marginRight: 4 }} />}
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4} lg={4}>
          <Card
            size='small'
            bordered
            style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#237804', fontSize: 13, fontWeight: 500 }}>Total Present (Days)</span>}
              value={totalPresentDays}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />}
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4} lg={4}>
          <Card
            size='small'
            bordered
            style={{ background: '#fff1f0', borderColor: '#ffa39e', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#cf1322', fontSize: 13, fontWeight: 500 }}>Total Absent (Days)</span>}
              value={totalAbsentDays}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d', marginRight: 4 }} />}
              valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4} lg={4}>
          <Card
            size='small'
            bordered
            style={{ background: '#fffbe6', borderColor: '#ffe58f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#d46b08', fontSize: 13, fontWeight: 500 }}>Half Days / Leave</span>}
              value={`${totalHalfDays} / ${totalLeaveDays}`}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 4 }} />}
              valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <AntTable<IAttendanceSummaryReportItem>
        dataSource={reportData}
        rowKey='employee_id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={columns}
        summary={() => {
          if (reportData.length === 0) return null;
          return (
            <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 600 }}>
              <Table.Summary.Cell index={0} colSpan={4}>
                Total Employees: {totalEmployees}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align='center'>
                <span style={{ color: '#1677ff' }}>{totalWorkingHours} hrs</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align='center'>
                <span style={{ color: '#52c41a' }}>{totalPresentDays}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align='center'>
                <span style={{ color: '#ff4d4f' }}>{totalAbsentDays}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align='center'>
                <span style={{ color: '#fa8c16' }}>{totalHalfDays}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align='center'>
                <span style={{ color: '#722ed1' }}>{totalLeaveDays}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} colSpan={2} align='center'>
                Avg Rate: {avgAttendanceRate}%
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </ReportContainer>
  );
};

export default AttendanceSummaryReport;
