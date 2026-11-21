import { Descriptions, Skeleton } from 'antd';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useGetSingleEmployeeQuery } from '../api/employeeEndpoints';

const ViewEmployee = ({ _id }: { _id: string }) => {
  const { data, isLoading } = useGetSingleEmployeeQuery(_id, {
    skip: !_id,
  });

  if (isLoading) return <Skeleton active />;

  const {
    name,
    code,
    department_name,
    designation_name,
    joining_date,
    basic_salary,
    status,
    bank_name,
    account_no,
    account_name,
    branch_name,
    routing_no,
  } = data?.data || {};

  return (
    <>
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Name'>{name}</Descriptions.Item>
        <Descriptions.Item label='Employee Code'>{code}</Descriptions.Item>
        <Descriptions.Item label='Department'>
          {department_name}
        </Descriptions.Item>
        <Descriptions.Item label='Designation'>
          {designation_name}
        </Descriptions.Item>
        <Descriptions.Item label='Joining Date'>
          {joining_date ? dateAndTimeFormat(joining_date) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Basic Salary'>
          {basic_salary}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>{status}</Descriptions.Item>
        <Descriptions.Item label='Bank Name'>
          {bank_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Account No'>
          {account_no || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Account Name'>
          {account_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Branch'>
          {branch_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Routing No'>
          {routing_no || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default ViewEmployee;
