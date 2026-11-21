import { Card, Descriptions, Spin, Tag, Typography } from 'antd';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { useGetSingleSupportTicketQuery } from '../api/supportTicketEndpoints';

type Props = {
  id: string | number;
};

const TOPIC_LABELS: Record<string, string> = {
  ORDER_STATUS: 'Order Status & Tracking',
  RETURN_REFUND: 'Return & Refund Policy',
  PRODUCT_WARRANTY: 'Product & Warranty Information',
  PAYMENT_ISSUE: 'Payment & Billing Assistance',
  GENERAL_QUERY: 'General Query / Other Assistance',
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

const ViewSupportTicket = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleSupportTicketQuery(id);
  const ticket = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <Card size='small' className='modal-container' style={{ border: 'none' }}>
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Ticket Number'>
          <strong style={{ color: '#1890ff' }}>{ticket.ticket_number}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={STATUS_COLORS[ticket.status] || 'default'}>
            {ticket.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label='Priority'>
          <Tag color={PRIORITY_COLORS[ticket.priority] || 'default'}>
            {ticket.priority}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Topic'>
          <Tag color='geekblue'>{TOPIC_LABELS[ticket.topic] || ticket.topic}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label='Customer Name'>
          <strong>{ticket.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Phone Number'>
          <Typography.Text copyable>{ticket.phone}</Typography.Text>
        </Descriptions.Item>

        <Descriptions.Item label='Email Address' span={2}>
          <Typography.Text copyable>{ticket.email}</Typography.Text>
        </Descriptions.Item>

        {ticket.order_number && (
          <Descriptions.Item label='Related Order' span={2}>
            <Tag color='cyan'>{ticket.order_number}</Tag>
          </Descriptions.Item>
        )}

        {ticket.subject && (
          <Descriptions.Item label='Subject' span={2}>
            <strong>{ticket.subject}</strong>
          </Descriptions.Item>
        )}

        <Descriptions.Item label='Message' span={2}>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f9f9f9',
              padding: '10px 14px',
              borderRadius: 6,
              border: '1px solid #ebebeb',
            }}
          >
            {ticket.message}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label='Admin Notes / Resolution' span={2}>
          {ticket.admin_notes ? (
            <div
              style={{
                whiteSpace: 'pre-wrap',
                background: '#f0f5ff',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #adc6ff',
                color: '#1d39c4',
              }}
            >
              {ticket.admin_notes}
            </div>
          ) : (
            <Typography.Text type='secondary'>No notes added yet</Typography.Text>
          )}
        </Descriptions.Item>

        {ticket.resolved_by_name && (
          <Descriptions.Item label='Resolved By'>
            {ticket.resolved_by_name}
          </Descriptions.Item>
        )}

        {ticket.resolved_at && (
          <Descriptions.Item label='Resolved At'>
            {dateAndTimeFormat(ticket.resolved_at)}
          </Descriptions.Item>
        )}

        <Descriptions.Item label='Created At' span={ticket.resolved_by_name ? 1 : 2}>
          {dateAndTimeFormat(ticket.created_at)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewSupportTicket;

