import {
  Button,
  Card,
  Col,
  Form,
  Row,
  DatePicker,
  Select,
  message,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetDepartmentsQuery } from '../../../Configuration/Department/api/departmentEndpoints';
import { useGetEmployeesQuery } from '../../../Payroll/Employee/api/employeeEndpoints';
import type { IPayrollReportQuery } from '../types/payrollReportTypes';

const { RangePicker } = DatePicker;

interface IPayrollReportFilterForm {
  month_range?: [dayjs.Dayjs, dayjs.Dayjs];
  department_id?: string;
  employee_id?: string;
  status?: string;
  payment_status?: string;
}

type Props = {
  setFilter: (arg: IPayrollReportQuery) => void;
  filter: IPayrollReportQuery;
};

const PayrollReportFilter = ({ setFilter }: Props) => {
  const [form] = useForm();
  const { data: departmentData } = useGetDepartmentsQuery();
  const { data: employeeData } = useGetEmployeesQuery({
    params: { limit: 1000 },
  });

  const onFinish = (values: IPayrollReportFilterForm) => {
    if (!values.month_range || values.month_range.length < 2) {
      message.warning('Please select a month range');
      return;
    }

    const params: IPayrollReportQuery = {
      from_month: dayjs(values.month_range[0]).format('YYYY-MM'),
      to_month: dayjs(values.month_range[1]).format('YYYY-MM'),
    };
    if (values.department_id) params.department_id = values.department_id;
    if (values.employee_id) params.employee_id = values.employee_id;
    if (values.status) params.status = values.status;
    if (values.payment_status) params.payment_status = values.payment_status;

    setFilter(params);
  };

  const clearFilter = () => {
    form.resetFields();
    setFilter({});
  };

  return (
    <Card size='small' style={{ marginBottom: '16px' }}>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Row gutter={[16, 16]} align='bottom'>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item
              name='month_range'
              label='Month Range'
              rules={[{ required: true, message: 'Month range is required' }]}
            >
              <RangePicker
                picker='month'
                style={{ width: '100%' }}
                format='YYYY-MM'
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name='department_id' label='Department'>
              <Select
                showSearch
                allowClear
                placeholder='Select Department'
                options={departmentData?.data?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name='employee_id' label='Employee'>
              <Select
                showSearch
                allowClear
                placeholder='Select Employee'
                options={employeeData?.data?.map((item) => ({
                  label: `${item.name} (${item.code})`,
                  value: item._id,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name='status' label='Approval Status'>
              <Select
                allowClear
                placeholder='Select Status'
                options={[
                  { label: 'PENDING', value: 'PENDING' },
                  { label: 'APPROVED', value: 'APPROVED' },
                  { label: 'REJECTED', value: 'REJECTED' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name='payment_status' label='Payment Status'>
              <Select
                allowClear
                placeholder='Select Payment'
                options={[
                  { label: 'UNPAID', value: 'UNPAID' },
                  { label: 'PARTIAL', value: 'PARTIAL' },
                  { label: 'PAID', value: 'PAID' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <Button
                type='primary'
                htmlType='submit'
                icon={<FilterOutlined />}
              >
                Filter
              </Button>
              <Button onClick={clearFilter} icon={<ClearOutlined />}>
                Clear
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default PayrollReportFilter;
