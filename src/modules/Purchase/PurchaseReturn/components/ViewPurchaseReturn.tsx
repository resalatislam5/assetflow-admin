import {
  Card,
  Descriptions,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useGetSinglePurchaseReturnQuery } from '../api/purchaseReturnEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import type { IPurchaseReturnItem } from '../types/purchaseReturnTypes';

type Props = {
  id: string | number;
};

const ViewPurchaseReturn = ({ id }: Props) => {
  const { data, isLoading } = useGetSinglePurchaseReturnQuery(id);
  const purchaseReturn = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!purchaseReturn) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'APPROVED':
        return 'blue';
      case 'PENDING':
        return 'gold';
      case 'CANCELLED':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Return Number'>
          <strong style={{ fontSize: 15, color: '#0958d9' }}>
            {purchaseReturn.return_number}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Purchase Invoice'>
          <strong>{purchaseReturn.purchase_number}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={getStatusColor(purchaseReturn.status)}>
            {purchaseReturn.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Return Date'>
          {purchaseReturn.return_date ? dateAndTimeFormat(purchaseReturn.return_date) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Supplier'>
          <div>
            <strong>{purchaseReturn.supplier_name}</strong>
            {purchaseReturn.supplier_phone && (
              <div style={{ color: '#888' }}>{purchaseReturn.supplier_phone}</div>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Branch'>
          {purchaseReturn.branch_name || 'Central / All'}
        </Descriptions.Item>
        <Descriptions.Item label='Warehouse'>
          <strong>{purchaseReturn.warehouse_name || 'N/A'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Refund Deposit Account'>
          {purchaseReturn.payment_account_name || 'None / Balance Adjustment'}
        </Descriptions.Item>
        <Descriptions.Item label='Total Return Value'>
          <strong style={{ color: '#ff4d4f', fontSize: 16 }}>
            ৳ {Number(purchaseReturn.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Cash / Bank Refund'>
          <strong style={{ color: '#52c41a', fontSize: 16 }}>
            ৳ {Number(purchaseReturn.refund_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </Descriptions.Item>
        {purchaseReturn.reason && (
          <Descriptions.Item label='Reason / Notes' span={2}>
            {purchaseReturn.reason}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 20, marginBottom: 8 }}>
        Returned Line Items
      </Typography.Title>

      <Table<IPurchaseReturnItem>
        dataSource={purchaseReturn.items}
        rowKey='id'
        pagination={false}
        size='small'
        bordered
        columns={[
          {
            title: '#',
            key: 'index',
            width: 50,
            align: 'center',
            render: (_t, _r, index) => index + 1,
          },
          {
            title: 'Product Title',
            key: 'product_title',
            dataIndex: 'product_title',
            render: (title, record) => (
              <div>
                <strong>{title}</strong>
                {record.variant_name && <span style={{ color: '#888' }}> ({record.variant_name})</span>}
                {record.product_sku && <div style={{ fontSize: 12, color: '#999' }}>SKU: {record.product_sku}</div>}
              </div>
            ),
          },
          {
            title: 'Returned Qty',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            align: 'center',
          },
          {
            title: 'Unit Cost',
            dataIndex: 'unit_cost',
            key: 'unit_cost',
            width: 120,
            align: 'right',
            render: (val) => `৳ ${Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
          {
            title: 'Line Total',
            dataIndex: 'total_cost',
            key: 'total_cost',
            width: 130,
            align: 'right',
            render: (val, record) => {
              const amount = val !== undefined ? val : Number(record.quantity) * Number(record.unit_cost);
              return (
                <strong style={{ color: '#ff4d4f' }}>
                  ৳ {Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
              );
            },
          },
          {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (text) => text || '-',
          },
        ]}
      />
    </Card>
  );
};

export default ViewPurchaseReturn;
