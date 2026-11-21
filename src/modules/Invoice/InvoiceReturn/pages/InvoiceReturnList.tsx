import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  RollbackOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Tooltip,
} from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useGetOrderReturnListQuery,
  useGetOrderReturnSummaryQuery,
} from '../api/invoiceReturnEndpoints';
import { SelectBranch } from '../../../../common/SelectWithApi';
import UpdateReturnStatusModal from '../components/UpdateReturnStatusModal';
import ViewReturnDrawer from '../components/ViewReturnDrawer';
import type {
  IOrderReturn,
  IOrderReturnQuery,
  RefundStatus,
  ReturnReason,
  ReturnStatus,
} from '../types/invoiceReturnTypes';

const OrderReturnList = () => {
  const { can_update } = useCheckPermission('INVOICE_RETURN');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IOrderReturnQuery>();

  const { data, isLoading, isFetching } = useGetOrderReturnListQuery(query);
  const { data: summaryData, isLoading: isSummaryLoading } = useGetOrderReturnSummaryQuery();

  const summary = summaryData?.data;

  const handleStatusFilter = (value?: string) => {
    setQuery({ status: (value as ReturnStatus) || undefined, page: 1 });
  };

  const handleRefundStatusFilter = (value?: string) => {
    setQuery({ refund_status: (value as RefundStatus) || undefined, page: 1 });
  };

  const getReturnStatusTag = (status: ReturnStatus) => {
    switch (status) {
      case 'PENDING':
      case 'REQUESTED':
        return <Tag color='orange'>REQUESTED</Tag>;
      case 'APPROVED':
        return <Tag color='blue'>APPROVED</Tag>;
      case 'PICKED_UP':
        return <Tag color='geekblue'>PICKED UP</Tag>;
      case 'RECEIVED':
        return <Tag color='purple'>RECEIVED</Tag>;
      case 'REFUNDED':
        return <Tag color='cyan'>REFUNDED</Tag>;
      case 'COMPLETED':
        return <Tag color='green'>COMPLETED</Tag>;
      case 'REJECTED':
        return <Tag color='red'>REJECTED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getReasonTag = (reason: ReturnReason) => {
    switch (reason) {
      case 'DEFECTIVE':
        return <Tag color='red'>Defective</Tag>;
      case 'WRONG_ITEM':
        return <Tag color='orange'>Wrong Item</Tag>;
      case 'EXCHANGE':
        return <Tag color='purple'>Exchange</Tag>;
      case 'CUSTOMER_RETURN':
        return <Tag color='magenta'>Customer Return</Tag>;
      case 'DAMAGED_IN_TRANSIT':
        return <Tag color='volcano'>Damaged</Tag>;
      case 'SIZE_FIT_ISSUE':
        return <Tag color='blue'>Size Issue</Tag>;
      case 'NOT_AS_DESCRIBED':
        return <Tag color='purple'>Not As Described</Tag>;
      case 'CHANGE_OF_MIND':
        return <Tag color='cyan'>Changed Mind</Tag>;
      case 'OTHER':
      default:
        return <Tag color='default'>Other</Tag>;
    }
  };

  return (
    <ContainerLayout
      title='Invoice Returns & Refunds'
      options={{
        showButton: false,
        showSearch: true,
      }}
      additionalFilter={
        <>
          <Col xs={24} sm={12} lg={4}>
            <SelectBranch
              standalone
              placeholder='Filter by Branch'
              allowClear
              value={query.branch_id}
              onChange={(val) =>
                setQuery({
                  branch_id: val ? Number(val) : undefined,
                  page: 1,
                })
              }
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Status'
              allowClear
              value={query.status}
              onChange={handleStatusFilter}
              options={[
                { label: 'Pending', value: 'PENDING' },
                { label: 'Requested', value: 'REQUESTED' },
                { label: 'Approved', value: 'APPROVED' },
                { label: 'Picked Up', value: 'PICKED_UP' },
                { label: 'Received', value: 'RECEIVED' },
                { label: 'Refunded', value: 'REFUNDED' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Rejected', value: 'REJECTED' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Refund'
              allowClear
              value={query.refund_status}
              onChange={handleRefundStatusFilter}
              options={[
                { label: 'Pending', value: 'PENDING' },
                { label: 'Processed', value: 'PROCESSED' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Rejected', value: 'REJECTED' },
              ]}
            />
          </Col>
        </>
      }
    >
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#f0f5ff', borderColor: '#adc6ff', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#1d39c4', fontSize: 13, fontWeight: 500 }}>Total Returns</span>}
              value={summary?.totalReturns ?? 0}
              prefix={<RollbackOutlined style={{ color: '#2f54eb', marginRight: 4 }} />}
              valueStyle={{ color: '#1d39c4', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#fffbe6', borderColor: '#ffe58f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#d46b08', fontSize: 13, fontWeight: 500 }}>Requested</span>}
              value={summary?.requestedReturns ?? 0}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 4 }} />}
              valueStyle={{ color: '#d46b08', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#e6f4ff', borderColor: '#91caff', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#0958d9', fontSize: 13, fontWeight: 500 }}>Approved</span>}
              value={summary?.approvedReturns ?? 0}
              prefix={<CheckCircleOutlined style={{ color: '#1677ff', marginRight: 4 }} />}
              valueStyle={{ color: '#0958d9', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#fff1f0', borderColor: '#ffa39e', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#cf1322', fontSize: 13, fontWeight: 500 }}>Rejected</span>}
              value={summary?.rejectedReturns ?? 0}
              prefix={<CloseCircleOutlined style={{ color: '#f5222d', marginRight: 4 }} />}
              valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#237804', fontSize: 13, fontWeight: 500 }}>Refunded</span>}
              value={summary?.refundedReturns ?? 0}
              prefix={<DollarOutlined style={{ color: '#52c41a', marginRight: 4 }} />}
              valueStyle={{ color: '#237804', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4}>
          <Card
            size='small'
            loading={isSummaryLoading}
            bordered
            style={{ background: '#f9f0ff', borderColor: '#d3adf7', borderRadius: 8 }}
          >
            <Statistic
              title={<span style={{ color: '#531dab', fontSize: 13, fontWeight: 500 }}>Total Refunded</span>}
              value={summary?.totalRefundAmount ?? 0}
              prefix={<DollarOutlined style={{ color: '#722ed1', marginRight: 4 }} />}
              suffix='৳'
              valueStyle={{ color: '#531dab', fontWeight: 700, fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IOrderReturn>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            title: 'Return #',
            dataIndex: 'return_number',
            key: 'return_number',
            width: 170,
            render: (retNum: string, record) => (
              <Button
                type='link'
                style={{ padding: 0, fontWeight: 600 }}
                onClick={() =>
                  dispatch(
                    openModal({
                      title: `Return Details: ${record.return_number}`,
                      content: <ViewReturnDrawer id={record.id} />,
                      open: true,
                      width: 800,
                    })
                  )
                }
              >
                {retNum}
              </Button>
            ),
          },
          {
            title: 'Invoice #',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            width: 160,
            render: (_: string, record) => (
              <strong>{record.invoice_number || record.order_number || '—'}</strong>
            ),
          },
          {
            title: 'Customer',
            key: 'customer',
            render: (_, record) => (
              <div>
                <strong>{record.customer_name || 'Customer'}</strong>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {record.customer_phone && <span>{record.customer_phone} &bull; </span>}
                  {record.customer_email}
                </div>
              </div>
            ),
          },
          {
            title: 'Branch',
            dataIndex: 'branch_name',
            key: 'branch_name',
            width: 140,
            render: (branch: string) =>
              branch ? <Tag color='geekblue'>{branch}</Tag> : <Tag>Central</Tag>,
          },
          {
            title: 'Reason',
            dataIndex: 'return_reason',
            key: 'return_reason',
            width: 140,
            render: (reason: ReturnReason) => getReasonTag(reason),
          },
          {
            title: 'Refund Amount',
            dataIndex: 'refund_amount',
            key: 'refund_amount',
            width: 130,
            align: 'right',
            render: (amt: number) => (
              <strong style={{ color: '#0958d9' }}>
                ৳{Number(amt || 0).toLocaleString()}
              </strong>
            ),
          },
          {
            title: 'Return Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status: ReturnStatus) => getReturnStatusTag(status),
          },
          {
            title: 'Refund Status',
            dataIndex: 'refund_status',
            key: 'refund_status',
            width: 120,
            align: 'center',
            render: (refStatus: RefundStatus) => (
              <Tag color={refStatus === 'PROCESSED' ? 'green' : refStatus === 'REJECTED' ? 'red' : 'orange'}>
                {refStatus}
              </Tag>
            ),
          },
          {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (val: string) => dateAndTimeFormat(val),
          },
          {
            title: 'Action',
            key: 'action',
            width: 110,
            align: 'center',
            render: (_, record: IOrderReturn) => (
              <Space size='small'>
                <Tooltip title='View Return Details'>
                  <Button
                    size='small'
                    icon={<EyeOutlined />}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Return Details: ${record.return_number}`,
                          content: <ViewReturnDrawer id={record.id} />,
                          open: true,
                          width: 800,
                        })
                      )
                    }
                  />
                </Tooltip>

                <Tooltip title='Update Return Status'>
                  <Button
                    size='small'
                    type='primary'
                    ghost
                    icon={<SyncOutlined />}
                    disabled={!can_update}
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: `Update Return: ${record.return_number}`,
                          content: <UpdateReturnStatusModal record={record} />,
                          open: true,
                          width: 600,
                        })
                      )
                    }
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default OrderReturnList;
