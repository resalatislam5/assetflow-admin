import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  InboxOutlined,
  SendOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Popconfirm, Row, Select, Space, Statistic, Tag, Tooltip } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { SelectBranch, SelectWarehouse } from '../../../../common/SelectWithApi';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useCancelStockTransferMutation,
  useGetStockTransfersQuery,
  useSendStockTransferMutation,
} from '../api/stockTransferEndpoints';
import CreateStockTransferModal from '../components/CreateStockTransferModal';
import ReceiveStockTransferModal from '../components/ReceiveStockTransferModal';
import ViewStockTransferModal from '../components/ViewStockTransferModal';
import type { IStockTransfer, IStockTransferQuery, StockTransferStatus } from '../types/stockTransferTypes';

const StockTransferList = () => {
  const { can_create, can_update } = useCheckPermission('INVENTORY');
  const dispatch = useAppDispatch();
  const { query, setQuery } = useQueryParams<IStockTransferQuery>();

  const { data, isLoading, isFetching } = useGetStockTransfersQuery(query);
  const [sendTransfer] = useSendStockTransferMutation();
  const [cancelTransfer] = useCancelStockTransferMutation();

  const transfers = data?.data || [];
  const totalTransfers = data?.total || transfers.length;

  const inTransitCount = transfers.filter(
    (t) => t.status === 'IN_TRANSIT' || t.status === 'SENT'
  ).length;

  const pendingCount = transfers.filter(
    (t) => t.status === 'PENDING' || t.status === 'DRAFT'
  ).length;

  const receivedCount = transfers.filter(
    (t) => t.status === 'RECEIVED' || t.status === 'PARTIALLY_RECEIVED'
  ).length;

  const getStatusTag = (status: StockTransferStatus) => {
    switch (status) {
      case 'DRAFT':
        return <Tag color='default'>DRAFT</Tag>;
      case 'PENDING':
        return <Tag color='warning' icon={<ClockCircleOutlined />}>REQUESTED</Tag>;
      case 'SENT':
      case 'IN_TRANSIT':
        return <Tag color='processing' icon={<SyncOutlined spin />}>IN TRANSIT</Tag>;
      case 'RECEIVED':
        return <Tag color='success' icon={<CheckCircleOutlined />}>RECEIVED</Tag>;
      case 'PARTIALLY_RECEIVED':
        return <Tag color='orange' icon={<InboxOutlined />}>PARTIALLY RECEIVED</Tag>;
      case 'CANCELLED':
        return <Tag color='error' icon={<CloseCircleOutlined />}>CANCELLED</Tag>;
      default:
        return <Tag color='default'>{status}</Tag>;
    }
  };

  return (
    <ContainerLayout
      title='Stock Transfers'
      options={{
        showButton: can_create,
        showSearch: true,
      }}
      buttonText='New Transfer'
      onClick={() =>
        dispatch(
          openModal({
            title: 'Initiate Inter-Location Stock Transfer',
            content: <CreateStockTransferModal />,
            open: true,
            width: 800,
          })
        )
      }
      additionalFilter={
        <>
          <Col xs={24} sm={12} lg={4}>
            <SelectBranch
              standalone
              placeholder='Origin Branch'
              value={query.from_branch_id ? Number(query.from_branch_id) : undefined}
              onChange={(val) => setQuery({ from_branch_id: val, page: 1 })}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <SelectWarehouse
              standalone
              placeholder='Origin Warehouse'
              value={query.from_warehouse_id ? Number(query.from_warehouse_id) : undefined}
              onChange={(val) => setQuery({ from_warehouse_id: val, page: 1 })}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <SelectWarehouse
              standalone
              placeholder='Destination Warehouse'
              value={query.to_warehouse_id ? Number(query.to_warehouse_id) : undefined}
              onChange={(val) => setQuery({ to_warehouse_id: val, page: 1 })}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Transfer Status'
              allowClear
              value={query.status}
              onChange={(val) => setQuery({ status: val, page: 1 })}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Requested / Pending', value: 'PENDING' },
                { label: 'In Transit', value: 'IN_TRANSIT' },
                { label: 'Received', value: 'RECEIVED' },
                { label: 'Partially Received', value: 'PARTIALLY_RECEIVED' },
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
            />
          </Col>
        </>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#f0f5ff', border: '1px solid #adc6ff' }}>
            <Statistic
              title='Total Transfers'
              value={totalTransfers}
              valueStyle={{ color: '#1d39c4' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#fffbe6', border: '1px solid #ffe58f' }}>
            <Statistic
              title='Pending / Requested'
              value={pendingCount}
              valueStyle={{ color: '#d46b08' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#e6f4ff', border: '1px solid #91caff' }}>
            <Statistic
              title='In Transit'
              value={inTransitCount}
              valueStyle={{ color: '#0958d9' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size='small' bordered={false} style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Statistic
              title='Completed / Received'
              value={receivedCount}
              valueStyle={{ color: '#237804' }}
            />
          </Card>
        </Col>
      </Row>

      <AntTable<IStockTransfer>
        dataSource={transfers}
        rowKey='id'
        loading={isLoading || isFetching}
        total={totalTransfers}
        columns={[
          {
            title: 'Voucher Number',
            dataIndex: 'transfer_number',
            key: 'transfer_number',
            width: 170,
            render: (text: string, record) => (
              <Button
                type='link'
                style={{ padding: 0, fontWeight: 600 }}
                onClick={() =>
                  dispatch(
                    openModal({
                      title: `Stock Transfer Voucher: ${record.transfer_number}`,
                      content: <ViewStockTransferModal id={record.id} />,
                      open: true,
                      width: 1000,
                    })
                  )
                }
              >
                {text}
              </Button>
            ),
          },
          {
            title: 'Created Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            render: (date: string) => dateAndTimeFormat(date),
          },
          {
            title: 'Origin (From)',
            key: 'from',
            render: (_, record) => (
              <div>
                <strong>{record.from_warehouse_name}</strong>
                <div style={{ fontSize: 11, color: '#999' }}>
                  {record.from_branch_name ? `Branch: ${record.from_branch_name}` : 'Central Godown'}
                </div>
              </div>
            ),
          },
          {
            title: 'Destination (To)',
            key: 'to',
            render: (_, record) => (
              <div>
                <strong>{record.to_warehouse_name}</strong>
                <div style={{ fontSize: 11, color: '#999' }}>
                  {record.to_branch_name ? `Branch: ${record.to_branch_name}` : 'Central Godown'}
                </div>
              </div>
            ),
          },
          {
            title: 'Items',
            dataIndex: 'items_count',
            key: 'items_count',
            width: 90,
            align: 'center',
            render: (count: number) => <span>{count} lines</span>,
          },
          {
            title: 'Total Sent',
            dataIndex: 'total_quantity_sent',
            key: 'total_quantity_sent',
            width: 110,
            align: 'center',
            render: (qty: number) => <span style={{ fontWeight: 600, color: '#1677ff' }}>{qty}</span>,
          },
          {
            title: 'Total Recv',
            dataIndex: 'total_quantity_received',
            key: 'total_quantity_received',
            width: 110,
            align: 'center',
            render: (qty: number, record) => {
              const rec = Number(qty || 0);
              const sent = Number(record.total_quantity_sent || 0);
              const color = rec === sent ? '#389e0d' : rec > 0 ? '#fa8c16' : '#999';
              return <span style={{ fontWeight: 600, color }}>{rec}</span>;
            },
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (status: StockTransferStatus) => getStatusTag(status),
          },
          {
            title: 'Action',
            key: 'action',
            width: 170,
            align: 'center',
            render: (_, record) => {
              const isPending = record.status === 'PENDING' || record.status === 'DRAFT';
              const isInTransit = record.status === 'IN_TRANSIT' || record.status === 'SENT';
              const canCancel = record.status !== 'RECEIVED' && record.status !== 'PARTIALLY_RECEIVED' && record.status !== 'CANCELLED';

              return (
                <Space size='small'>
                  <Tooltip title='View Voucher'>
                    <Button
                      size='small'
                      icon={<EyeOutlined />}
                      onClick={() =>
                        dispatch(
                          openModal({
                            title: `Stock Transfer Voucher: ${record.transfer_number}`,
                            content: <ViewStockTransferModal id={record.id} />,
                            open: true,
                            width: 1000,
                          })
                        )
                      }
                    />
                  </Tooltip>

                  {isPending && can_update && (
                    <Tooltip title='Dispatch Transfer'>
                      <Popconfirm
                        title='Dispatch stock transfer into transit?'
                        onConfirm={() => sendTransfer(record.id)}
                      >
                        <Button
                          size='small'
                          type='primary'
                          icon={<SendOutlined />}
                        />
                      </Popconfirm>
                    </Tooltip>
                  )}

                  {isInTransit && can_update && (
                    <Tooltip title='Receive Goods'>
                      <Button
                        size='small'
                        type='primary'
                        ghost
                        icon={<InboxOutlined />}
                        onClick={() =>
                          dispatch(
                            openModal({
                              title: `Receive Stock Transfer: ${record.transfer_number}`,
                              content: <ReceiveStockTransferModal record={record} />,
                              open: true,
                              width: 800,
                            })
                          )
                        }
                      />
                    </Tooltip>
                  )}

                  {canCancel && can_update && (
                    <Tooltip title='Cancel Transfer'>
                      <Popconfirm
                        title='Cancel this transfer and restore stock?'
                        okText='Yes, Cancel'
                        cancelText='No'
                        onConfirm={() => cancelTransfer(record.id)}
                      >
                        <Button
                          size='small'
                          danger
                          icon={<StopOutlined />}
                        />
                      </Popconfirm>
                    </Tooltip>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default StockTransferList;
