import { DownloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Select, Space, Tag, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import { FormInputDate } from '../../../../common/Form/FormIInput';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import Iconify from '../../../../common/Table/Iconify';
import { exportToExcel, type ExcelColumn } from '../../../../common/utils/exportToExcel';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useBulkUpdatePayrollStatusMutation,
  useDeletePayrollMutation,
  useGetPayrollsQuery,
  useUpdatePayrollStatusMutation,
  useBulkDeletePayrollMutation,
} from '../api/payrollEndpoints';
import BulkPaymentForm from '../components/BulkPaymentForm';
import PayrollForm from '../components/PayrollForm';
import PayrollPaymentForm from '../components/PayrollPaymentForm';
import type { IPayroll, IPayrollQuery } from '../types/payrollTypes';
import CommonButton from '../../../../common/Button/CommonButton';

const PayrollList = () => {
  const { can_create, can_delete } = useCheckPermission('PAYROLL');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IPayrollQuery>();
  const { data, isLoading, isFetching } = useGetPayrollsQuery({
    params: query,
  });
  const [deleting, { isLoading: isDeleting }] = useDeletePayrollMutation();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdatePayrollStatusMutation();
  const [bulkUpdateStatus, { isLoading: isBulkUpdating }] =
    useBulkUpdatePayrollStatusMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] =
    useBulkDeletePayrollMutation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleExportBankReport = () => {
    if (!data?.data?.length) return;
    const excelColumns: ExcelColumn<IPayroll>[] = [
      { title: 'Employee Name', dataIndex: 'employee_name' },
      { title: 'Bank Name', dataIndex: 'bank_name' },
      { title: 'Branch Name', dataIndex: 'branch_name' },
      { title: 'Routing No', dataIndex: 'routing_no' },
      { title: 'Account Name', dataIndex: 'account_name' },
      { title: 'Account No', dataIndex: 'account_no' },
      { title: 'Basic Salary', dataIndex: 'basic_salary' },
      {
        title: 'Additions',
        dataIndex: 'additions',
        render: (_val: unknown, record: IPayroll) => {
          return record.additions ? record.additions.reduce((sum: number, a: { amount: number }) => sum + a.amount, 0) : 0;
        },
      },
      { title: 'Bonus', dataIndex: 'bonus' },
      { title: 'Advance Deduction', dataIndex: 'advance_deduction' },
      {
        title: 'Other Deductions',
        dataIndex: 'deductions',
        render: (_val: unknown, record: IPayroll) => {
          return record.deductions ? record.deductions.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0) : 0;
        },
      },
      {
        title: 'Net Amount',
        dataIndex: 'net_salary',
        render: (_val: unknown, record: IPayroll) =>
          record.net_salary - (record.paid_amount || 0),
      },
      { title: 'Month/Year', dataIndex: 'month_year' },
    ];
    exportToExcel<IPayroll>(
      data.data,
      `Bank_Salary_Report_${query.month_year || 'All'}`,
      excelColumns,
    );
  };

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Generate Payroll',
            content: <PayrollForm />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Payroll List'
      options={{ showButton: can_create }}
      additionalFilter={
        <>
          <FormInputDate
            picker='month'
            placeholder='Filter by Month'
            defaultValue={query?.month_year ? dayjs(String(query.month_year)) : null}
            name={''}
            label={''}
            noStyle
            sm={8}
            md={8}
            lg={4}
            onChange={(date) =>
              setQuery({
                month_year: date ? dayjs(date).format('YYYY-MM') : undefined,
              })
            }
          />
          <Select
            placeholder='Filter by Status'
            allowClear
            style={{ width: 150, marginLeft: 8 }}
            value={query?.status}
            onChange={(value) => setQuery({ status: value || undefined })}
            options={[
              { label: 'Pending', value: 'PENDING' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' },
            ]}
          />
          <Select
            placeholder='Filter by Payment'
            allowClear
            style={{ width: 170, marginLeft: 8 }}
            value={query?.payment_status}
            onChange={(value) =>
              setQuery({ payment_status: value || undefined })
            }
            options={[
              { label: 'Unpaid', value: 'UNPAID' },
              { label: 'Partial', value: 'PARTIAL' },
              { label: 'Paid', value: 'PAID' },
            ]}
          />
          <Button
            type='primary'
            icon={<DownloadOutlined />}
            onClick={handleExportBankReport}
            disabled={!data?.data?.length}
            style={{ marginLeft: 8 }}
          >
            Bank Report
          </Button>
        </>
      }
    >
      {selectedRowKeys.length > 0 && (
        <Space style={{ marginBottom: 16 }}>
          <Popconfirm
            title='Are you sure you want to approve the selected payrolls?'
            onConfirm={() => {
              bulkUpdateStatus({
                body: { ids: selectedRowKeys as string[], status: 'APPROVED' },
              });
              setSelectedRowKeys([]);
            }}
            okText='Yes'
            cancelText='No'
          >
            <Button type='primary' loading={isBulkUpdating}>
              Approve Selected
            </Button>
          </Popconfirm>
          <Popconfirm
            title='Are you sure you want to reject the selected payrolls?'
            onConfirm={() => {
              bulkUpdateStatus({
                body: { ids: selectedRowKeys as string[], status: 'REJECTED' },
              });
              setSelectedRowKeys([]);
            }}
            okText='Yes'
            cancelText='No'
          >
            <Button danger loading={isBulkUpdating}>
              Reject Selected
            </Button>
          </Popconfirm>
          <Button
            type='dashed'
            onClick={() => {
              dispatch(
                openModal({
                  title: 'Bulk Make Payment',
                  content: (
                    <BulkPaymentForm payrollIds={selectedRowKeys as string[]} />
                  ),
                  open: true,
                  width: 600,
                }),
              );
              setSelectedRowKeys([]);
            }}
          >
            Pay Selected
          </Button>
          {can_delete && (
            <Popconfirm
              title='Are you sure you want to delete the selected payrolls?'
              onConfirm={() => {
                bulkDelete({
                  body: { ids: selectedRowKeys as string[] },
                });
                setSelectedRowKeys([]);
              }}
              okText='Yes'
              cancelText='No'
            >
              <Button danger type='primary' loading={isBulkDeleting}>
                Delete Selected
              </Button>
            </Popconfirm>
          )}
        </Space>
      )}
      <AntTable
        rowSelection={rowSelection}
        dataSource={data?.data}
        rowKey={(record) => String(record.id ?? record._id)}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'employee',
            key: 'employee',
            title: 'Employee ID',
            render: (_text, record: IPayroll) => (
              <Space direction='vertical' size={0}>
                <span style={{ fontWeight: 500 }}>
                  {record.employee_name || 'N/A'}
                </span>
                <span style={{ fontSize: '12px', color: 'gray' }}>
                  {record.employee_code || 'N/A'}
                </span>
              </Space>
            ),
          },
          {
            dataIndex: 'department_name',
            key: 'department_name',
            title: 'Department',
          },
          { dataIndex: 'month_year', key: 'month_year', title: 'Month/Year' },
          {
            dataIndex: 'basic_salary',
            key: 'basic_salary',
            title: 'Basic Salary',
          },
          {
            dataIndex: 'additions',
            key: 'additions',
            title: 'Additions',
            render: (additions: { amount: number }[]) => {
              if (!additions || additions.length === 0) return 0;
              return additions.reduce((sum: number, a: { amount: number }) => sum + a.amount, 0);
            },
          },
          { dataIndex: 'bonus', key: 'bonus', title: 'Bonus' },
          {
            dataIndex: 'advance_deduction',
            key: 'advance_deduction',
            title: 'Advance Deduction',
          },
          {
            dataIndex: 'deductions',
            key: 'deductions',
            title: 'Other Deductions',
            render: (deductions: { amount: number }[]) => {
              if (!deductions || deductions.length === 0) return 0;
              return deductions.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);
            },
          },
          { dataIndex: 'net_salary', key: 'net_salary', title: 'Net Salary' },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            render: (_, record) => (
              <>
                {can_create && record?.status !== 'APPROVED' ? (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: (
                            <p
                              onClick={() =>
                                updateStatus({
                                  id: (record.id ?? record._id) as string | number,
                                  body: { status: 'APPROVED' },
                                })
                              }
                              style={{ color: 'green', margin: 0 }}
                            >
                              APPROVED
                            </p>
                          ),
                          key: 'APPROVED',
                        },
                        {
                          label: (
                            <p
                              onClick={() =>
                                updateStatus({
                                  id: (record.id ?? record._id) as string | number,
                                  body: { status: 'REJECTED' },
                                })
                              }
                              style={{ color: 'red', margin: 0 }}
                            >
                              REJECTED
                            </p>
                          ),
                          key: 'REJECTED',
                        },
                      ],
                    }}
                  >
                    <Tag
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                      color={
                        record.status === 'PENDING'
                          ? 'orange'
                          : record.status === 'REJECTED'
                            ? 'red'
                            : 'green'
                      }
                    >
                      {isUpdating ? 'Loading...' : record.status}
                      <Iconify icon='iconamoon:arrow-down-2-light' />
                    </Tag>
                  </Dropdown>
                ) : (
                  <Tag
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    color={
                      record.status === 'APPROVED'
                        ? 'green'
                        : record.status === 'REJECTED'
                          ? 'red'
                          : 'orange'
                    }
                  >
                    {record.status}
                  </Tag>
                )}
              </>
            ),
          },
          {
            dataIndex: 'payment_status',
            key: 'payment_status',
            title: 'Payment Status',
            render: (payment_status, record) => (
              <Space direction='vertical' size={0}>
                <span
                  style={{
                    color:
                      payment_status === 'PAID'
                        ? 'green'
                        : payment_status === 'PARTIAL'
                          ? 'orange'
                          : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {payment_status}
                </span>
                <span style={{ fontSize: '12px' }}>
                  Paid: {record.paid_amount || 0}
                </span>
              </Space>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (_text, record: IPayroll) => (
              <Space size='small' wrap>
                {record.status === 'APPROVED' &&
                  record.payment_status !== 'PAID' && (
                    <CommonButton
                      icon='mdi:cash-register-plus'
                      text='Make Payment'
                      size='small'
                      onClick={() =>
                        dispatch(
                          openModal({
                            title: 'Make Payment',
                            content: (
                              <PayrollPaymentForm
                                payrollId={(record.id ?? record._id) as string}
                                dueAmount={
                                  record.net_salary - record.paid_amount
                                }
                              />
                            ),
                            open: true,
                            width: 800,
                          }),
                        )
                      }
                    />
                  )}
                {can_delete &&
                  (record.status === 'PENDING' || record?.paid_amount <= 0) && (
                    <DeleteButton
                      loading={isDeleting}
                      onClick={() => deleting((record.id ?? record._id) as string | number)}
                    />
                  )}
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default PayrollList;
