import { Select, Space, Tag, Typography } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import ViewButton from '../../../../common/Button/ViewButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteSupportTicketMutation,
  useGetSupportTicketListQuery,
} from '../api/supportTicketEndpoints';
import UpdateSupportTicket from '../components/UpdateSupportTicket';
import ViewSupportTicket from '../components/ViewSupportTicket';
import type { ISupportTicket } from '../types/supportTicketTypes';

const TOPIC_LABELS: Record<string, string> = {
  ORDER_STATUS: 'Order Status',
  RETURN_REFUND: 'Return & Refund',
  PRODUCT_WARRANTY: 'Product Warranty',
  PAYMENT_ISSUE: 'Payment Issue',
  GENERAL_QUERY: 'General Query',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'gold',
  IN_PROGRESS: 'blue',
  RESOLVED: 'green',
  CLOSED: 'default',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'default',
  MEDIUM: 'blue',
  HIGH: 'volcano',
  URGENT: 'red',
};

const SupportTicketList = () => {
  const { can_delete, can_update } = useCheckPermission('SUPPORT_TICKET');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams();
  const { data, isLoading, isFetching } = useGetSupportTicketListQuery(query);
  const [deleteTicket, { isLoading: isDeleting }] =
    useDeleteSupportTicketMutation();

  const handleTopicFilter = (value: unknown) => {
    setQuery({
      topic: value ? String(value) : undefined,
    });
  };

  const handleStatusFilter = (value: unknown) => {
    setQuery({
      status: value ? String(value) : undefined,
    });
  };

  const handlePriorityFilter = (value: unknown) => {
    setQuery({
      priority: value ? String(value) : undefined,
    });
  };

  return (
    <ContainerLayout
      title='Customer Support Tickets'
      options={{ showButton: false }}
      additionalFilter={
        <Space wrap size='small'>
          <Select
            placeholder='Filter by Status'
            allowClear
            style={{ width: 140 }}
            value={query.status || undefined}
            onChange={handleStatusFilter}
            options={[
              { value: 'PENDING', label: 'PENDING' },
              { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
              { value: 'RESOLVED', label: 'RESOLVED' },
              { value: 'CLOSED', label: 'CLOSED' },
            ]}
          />
          <Select
            placeholder='Filter by Topic'
            allowClear
            style={{ width: 160 }}
            value={query.topic || undefined}
            onChange={handleTopicFilter}
            options={[
              { value: 'ORDER_STATUS', label: 'Order Status' },
              { value: 'RETURN_REFUND', label: 'Return & Refund' },
              { value: 'PRODUCT_WARRANTY', label: 'Product Warranty' },
              { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
              { value: 'GENERAL_QUERY', label: 'General Query' },
            ]}
          />
          <Select
            placeholder='Filter by Priority'
            allowClear
            style={{ width: 130 }}
            value={query.priority || undefined}
            onChange={handlePriorityFilter}
            options={[
              { value: 'LOW', label: 'LOW' },
              { value: 'MEDIUM', label: 'MEDIUM' },
              { value: 'HIGH', label: 'HIGH' },
              { value: 'URGENT', label: 'URGENT' },
            ]}
          />
        </Space>
      }
    >
      <AntTable<ISupportTicket>
        rowKey='id'
        columns={[
          {
            title: 'Ticket #',
            dataIndex: 'ticket_number',
            key: 'ticket_number',
            render: (ticketNumber: string, record) => (
              <div>
                <Typography.Text strong style={{ color: '#1890ff' }}>
                  {ticketNumber}
                </Typography.Text>
                <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2 }}>
                  {record.name}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>
                  {record.phone}
                </div>
              </div>
            ),
          },
          {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            render: (topic: string) => (
              <Tag color='geekblue'>{TOPIC_LABELS[topic] || topic}</Tag>
            ),
          },
          {
            title: 'Related Order',
            dataIndex: 'order_number',
            key: 'order_number',
            render: (orderNumber?: string) =>
              orderNumber ? <Tag color='cyan'>{orderNumber}</Tag> : '-',
          },
          {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            align: 'center',
            render: (priority: string) => (
              <Tag color={PRIORITY_COLORS[priority] || 'default'}>
                {priority}
              </Tag>
            ),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => (
              <Tag color={STATUS_COLORS[status] || 'default'}>{status}</Tag>
            ),
          },
          {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (createdAt: string) => dateAndTimeFormat(createdAt),
          },
          {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
              <Space size='small'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        open: true,
                        title: `Ticket Details - ${record.ticket_number}`,
                        content: <ViewSupportTicket id={record.id} />,
                        width: 700,
                      })
                    )
                  }
                />
                {can_update && (
                  <EditButton
                    onClick={() =>
                      dispatch(
                        openModal({
                          open: true,
                          title: 'Update Support Ticket',
                          content: <UpdateSupportTicket id={record.id} />,
                          width: 500,
                        })
                      )
                    }
                  />
                )}
                {can_delete && (
                  <DeleteButton
                    onClick={() => deleteTicket(record.id)}
                    loading={isDeleting}
                  />
                )}
              </Space>
            ),
          },
        ]}
        dataSource={data?.data}
        loading={isLoading || isFetching}
        total={data?.total}
      />
    </ContainerLayout>
  );
};

export default SupportTicketList;
