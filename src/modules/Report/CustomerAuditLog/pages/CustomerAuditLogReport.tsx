import { Space } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import ViewButton from '../../../../common/Button/ViewButton';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { SelectCustomer } from '../../../../common/SelectWithApi/Select';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { getStatusTag } from '../../../../common/utils/status';
import ReportContainer from '../../../../layout/components/ReportContainer';
import { useCustomerAuditLogListQuery } from '../api/customerAuditLogEndpoints';
import ViewCustomerAuditReport from '../components/ViewCustomerAuditReport';
import { type ICustomerAuditLogQuery } from '../types/customerAuditLogTypes';

const CustomerAuditLogReport = () => {
  const { query, setQuery } = useQueryParams<ICustomerAuditLogQuery>();
  const { data, isLoading, isFetching } = useCustomerAuditLogListQuery(query, {
    skip: !query?.from_date || !query?.to_date,
  });

  const dispatch = useAppDispatch();

  return (
    <ReportContainer
      title='Customer Audit Log'
      exportExcel={
        data?.data
          ? {
              data: data.data,
              fileName: 'Customer_Audit_Log',
              columns: [
                { dataIndex: 'createdAt', key: 'createdAt', title: 'Date' },
                {
                  dataIndex: 'customer_name',
                  key: 'customer_name',
                  title: 'Customer',
                },
                {
                  dataIndex: 'customer_email',
                  key: 'customer_email',
                  title: 'Email',
                },
                { dataIndex: 'action', key: 'action', title: 'Action' },
                { dataIndex: 'entity', key: 'entity', title: 'Entity' },
                {
                  dataIndex: 'description',
                  key: 'description',
                  title: 'Description',
                },
              ],
            }
          : undefined
      }
      additionalFilter={
        <>
          <SelectCustomer
            label='Customer'
            name='customer_id'
            sm={8}
            md={8}
            lg={5}
            onChange={(e) => setQuery({ customer_id: e })}
            defaultValue={query.customer_id}
          />
        </>
      }
    >
      <AntTable
        dataSource={data?.data}
        rowKey={'id'}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        pagination={false}
        columns={[
          {
            dataIndex: 'createdAt',
            key: 'createdAt',
            title: 'Date',
            render: (text) => dateAndTimeFormat(text),
          },
          {
            dataIndex: 'customer_name',
            key: 'customer_name',
            title: 'Customer',
            render: (name, record) => (
              <div>
                <div style={{ fontWeight: 500 }}>{name || 'N/A'}</div>
                {record.customer_email && (
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {record.customer_email}
                  </div>
                )}
              </div>
            ),
          },
          {
            dataIndex: 'action',
            key: 'action',
            title: 'Action',
            render: (text) => getStatusTag(text),
          },
          {
            dataIndex: 'entity',
            key: 'entity',
            title: 'Entity',
          },
          {
            dataIndex: 'description',
            key: 'description',
            title: 'Description',
          },
          {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_text, record) => (
              <Space size='middle'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Customer Audit Report',
                        content: <ViewCustomerAuditReport record={record} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
              </Space>
            ),
          },
        ]}
      />
    </ReportContainer>
  );
};

export default CustomerAuditLogReport;

