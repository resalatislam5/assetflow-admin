import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Form, Row, Select, Statistic, Table, Tag, Tooltip, type TableProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import {
  SelectDepartment,
  SelectEmployee,
} from '../../../../common/SelectWithApi/Select';
import AntTable from '../../../../common/Table/AntTable';
import { getGoogleMapUrl } from '../../../../common/utils/geoHelper';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { useGetAttendanceReportQuery } from '../api/OnlyGetReportEndpoints';
import type {
  IAttendanceReport,
  IAttendanceReportQuery,
} from '../types/OnlyGetReportTypes';

const getAttendanceStatusTag = (status: string) => {
  switch (status) {
    case 'PRESENT':
      return <Tag color='green'>PRESENT</Tag>;
    case 'ABSENT':
      return <Tag color='red'>ABSENT</Tag>;
    case 'HALF_DAY':
      return <Tag color='orange'>HALF DAY</Tag>;
    case 'LEAVE':
      return <Tag color='purple'>LEAVE</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const calculateWorkingHours = (checkIn?: string, checkOut?: string) => {
  if (!checkIn || !checkOut) return '-';
  const start = dayjs(checkIn);
  const end = dayjs(checkOut);
  const diffMinutes = end.diff(start, 'minute');
  if (diffMinutes < 0) return '-';
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const AttendanceReport = () => {
  const { query, setQuery } = useQueryParams<IAttendanceReportQuery>();

  // Ensure default 1-month date range (1st of month to end of month) is set if missing
  useEffect(() => {
    if (!query.from_date && !query.to_date) {
      setQuery({
        from_date: dayjs().startOf('month').format('YYYY-MM-DD'),
        to_date: dayjs().endOf('month').format('YYYY-MM-DD'),
      });
    }
  }, [query.from_date, query.to_date, setQuery]);

  const { data, isLoading, isFetching } = useGetAttendanceReportQuery(query);

  const reportData = data?.data || [];
  const summary = data?.summary;
  const total = summary?.totalRecords || reportData.length;
  const totalPresent = summary?.totalPresent || 0;
  const totalAbsent = summary?.totalAbsent || 0;
  const totalHalfDay = summary?.totalHalfDay || 0;
  const totalLeave = summary?.totalLeave || 0;

  const presentPercentage = total > 0 ? ((totalPresent / total) * 100).toFixed(1) : '0';
  const absentPercentage = total > 0 ? ((totalAbsent / total) * 100).toFixed(1) : '0';

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (text: string) => dayjs(text).format('DD MMM, YYYY'),
    },
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center' as const,
      render: (status: string) => getAttendanceStatusTag(status),
    },
    {
      title: 'Check In',
      dataIndex: 'check_in',
      key: 'check_in',
      width: 110,
      align: 'center' as const,
      render: (text?: string) => (text ? dayjs(text).format('hh:mm A') : '-'),
    },
    {
      title: 'Check Out',
      dataIndex: 'check_out',
      key: 'check_out',
      width: 110,
      align: 'center' as const,
      render: (text?: string) => (text ? dayjs(text).format('hh:mm A') : '-'),
    },
    {
      title: 'Working Hours',
      key: 'working_hours',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: IAttendanceReport) =>
        calculateWorkingHours(record.check_in, record.check_out),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 170,
      render: (location?: string, record?: IAttendanceReport) => {
        if (!location && !record?.latitude) return <span style={{ color: '#aaa' }}>-</span>;
        return (
          <Tooltip title='Click to open in Google Maps'>
            <a
              href={getGoogleMapUrl(record?.latitude, record?.longitude, location)}
              target='_blank'
              rel='noreferrer'
              style={{ color: '#1677ff', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
              <span>{location || `${record?.latitude}, ${record?.longitude}`}</span>
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (remarks?: string) => remarks || <span style={{ color: '#aaa' }}>-</span>,
    },
  ];

  return (
    <ReportContainer
      title='Attendance Report'
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
                date: dayjs(item.date).format('DD-MM-YYYY'),
                check_in: item.check_in ? dayjs(item.check_in).format('hh:mm A') : '-',
                check_out: item.check_out ? dayjs(item.check_out).format('hh:mm A') : '-',
                working_hours: calculateWorkingHours(item.check_in, item.check_out),
                location: item.location || (item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : '-'),
              })),
              fileName: 'Attendance_Report',
              columns: columns as unknown as TableProps<object>['columns'],
              summary: {
                date: `Total Records: ${total}`,
                status: `Present: ${totalPresent} | Absent: ${totalAbsent} | Half Day: ${totalHalfDay} | Leave: ${totalLeave}`,
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

          <Col xs={24} sm={8} lg={4}>
            <Form.Item label='Status' name='status' layout='vertical'>
              <Select
                placeholder='All Statuses'
                allowClear
                value={query.status}
                onChange={(val) => setQuery({ status: val || undefined })}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'PRESENT', value: 'PRESENT' },
                  { label: 'ABSENT', value: 'ABSENT' },
                  { label: 'HALF DAY', value: 'HALF_DAY' },
                  { label: 'LEAVE', value: 'LEAVE' },
                ]}
              />
            </Form.Item>
          </Col>
        </>
      }
    >
      {/* Top Metric Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4} lg={4} xl={4}>
          <Card
            size='small'
            bordered
            style={{ background: '#f0f5ff', borderColor: '#adc6ff', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#1d39c4', fontSize: 13, fontWeight: 500 }}>Total Records</span>}
              value={total}
              prefix={<UserOutlined style={{ color: '#2f54eb', marginRight: 4 }} />}
              valueStyle={{ color: '#1d39c4', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5} lg={5} xl={5}>
          <Card
            size='small'
            bordered
            style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#237804', fontSize: 13, fontWeight: 500 }}>Present</span>}
              value={totalPresent}
              suffix={<span style={{ fontSize: 13, fontWeight: 400, color: '#389e0d' }}>({presentPercentage}%)</span>}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />}
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5} lg={5} xl={5}>
          <Card
            size='small'
            bordered
            style={{ background: '#fff1f0', borderColor: '#ffa39e', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#cf1322', fontSize: 13, fontWeight: 500 }}>Absent</span>}
              value={totalAbsent}
              suffix={<span style={{ fontSize: 13, fontWeight: 400, color: '#ff4d4f' }}>({absentPercentage}%)</span>}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d', marginRight: 4 }} />}
              valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5} lg={5} xl={5}>
          <Card
            size='small'
            bordered
            style={{ background: '#fffbe6', borderColor: '#ffe58f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#d46b08', fontSize: 13, fontWeight: 500 }}>Half Day</span>}
              value={totalHalfDay}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 4 }} />}
              valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={5} lg={5} xl={5}>
          <Card
            size='small'
            bordered
            style={{ background: '#f9f0ff', borderColor: '#d3adf7', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#531dab', fontSize: 13, fontWeight: 500 }}>Leave</span>}
              value={totalLeave}
              prefix={<ExclamationCircleOutlined style={{ color: '#722ed1', marginRight: 4 }} />}
              valueStyle={{ color: '#531dab', fontWeight: 700, fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <AntTable<IAttendanceReport>
        dataSource={reportData}
        rowKey='_id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={columns}
        summary={() => {
          if (reportData.length === 0) return null;
          return (
            <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 600 }}>
              <Table.Summary.Cell index={0} colSpan={5}>
                Total Records: {total}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={6}>
                <span style={{ color: '#52c41a' }}>Present: {totalPresent}</span>
                {' | '}
                <span style={{ color: '#ff4d4f' }}>Absent: {totalAbsent}</span>
                {' | '}
                <span style={{ color: '#fa8c16' }}>Half Day: {totalHalfDay}</span>
                {' | '}
                <span style={{ color: '#722ed1' }}>Leave: {totalLeave}</span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </ReportContainer>
  );
};

export default AttendanceReport;
