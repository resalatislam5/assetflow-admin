import { Col, Space, DatePicker, Dropdown, Tag } from 'antd';
import dayjs from 'dayjs';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import ViewButton from '../../../../common/Button/ViewButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import Iconify from '../../../../common/Table/Iconify';
import { getStatusTag } from '../../../../common/utils/status';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteAdvancePaymentMutation,
  useGetAdvancePaymentsQuery,
  useUpdateAdvancePaymentMutation,
} from '../api/advancePaymentEndpoints';
import CreateAdvancePayment from '../components/CreateAdvancePayment';
import UpdateAdvancePayment from '../components/UpdateAdvancePayment';
import ViewAdvancePayment from '../components/ViewAdvancePayment';
import type { IAdvancePayment } from '../types/advancePaymentTypes';

const AdvancePaymentList = () => {
  const { can_create, can_delete, can_update } =
    useCheckPermission('ADVANCE_PAYMENT');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetAdvancePaymentsQuery({
    params: query,
  });
  const [deleting, { isLoading: isDeleting }] =
    useDeleteAdvancePaymentMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdvancePaymentMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Advance Payment',
            content: <CreateAdvancePayment />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Advance Payment List'
      options={{ showButton: can_create }}
      additionalFilter={
        <Col>
          <DatePicker
            picker='month'
            allowClear
            placeholder='Filter by Month'
            onChange={(date) =>
              setQuery({ month_year: date ? date.format('YYYY-MM') : '' })
            }
            value={
              query.month_year
                ? dayjs(query.month_year as string, 'YYYY-MM')
                : undefined
            }
          />
        </Col>
      }
    >
      <AntTable
        dataSource={data?.data}
        rowKey={'_id'}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'date',
            key: 'date',
            title: 'Date Issued',
            render: (text) => dayjs(text).format('DD MMM, YYYY'),
          },
          {
            dataIndex: 'employee_name',
            key: 'employee_name',
            title: 'Employee Name',
          },
          {
            dataIndex: 'employee_code',
            key: 'employee_code',
            title: 'Employee Code',
          },
          { dataIndex: 'amount', key: 'amount', title: 'Total Amount' },
          {
            dataIndex: 'remaining_amount',
            key: 'remaining_amount',
            title: 'Remaining Balance',
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            render: (_, record: IAdvancePayment) => (
              <>
                {can_update && record?.status === 'PENDING' ? (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: (
                            <p
                              onClick={() =>
                                updateStatus({
                                  id: record?._id,
                                  body: { status: 'APPROVED' },
                                })
                              }
                              style={{ color: 'green' }}
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
                                  id: record?._id,
                                  body: { status: 'REJECTED' },
                                })
                              }
                              style={{ color: 'red' }}
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        width: 'fit-content',
                      }}
                      color='warning'
                    >
                      {isUpdatingStatus ? 'Loading...' : record?.status}
                      <Iconify icon='iconamoon:arrow-down-2-light' />
                    </Tag>
                  </Dropdown>
                ) : (
                  getStatusTag(record?.status)
                )}
              </>
            ),
          },
          {
            dataIndex: 'action_by_name',
            key: 'action_by_name',
            title: 'Action By',
            render: (text) => text || 'N/A',
          },
          {
            dataIndex: 'voucher_no',
            key: 'voucher_no',
            title: 'Voucher No',
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_text, record: IAdvancePayment) => (
              <Space size='middle'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Advance Payment Details',
                        content: <ViewAdvancePayment _id={record?._id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                {record?.status === 'PENDING' && (
                  <>
                    <EditButton
                      can_update={can_update}
                      onClick={() =>
                        dispatch(
                          openModal({
                            title: 'Update Advance Payment',
                            content: <UpdateAdvancePayment _id={record?._id} />,
                            open: true,
                            width: 800,
                          }),
                        )
                      }
                    />
                    <DeleteButton
                      can_delete={can_delete}
                      loading={isDeleting}
                      onClick={() => deleting(record._id)}
                    />
                  </>
                )}
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default AdvancePaymentList;
