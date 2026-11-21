import {
  Card,
  Descriptions,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useGetSinglePurchaseQuery } from '../api/purchaseEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import type { IPurchaseItem } from '../types/purchaseTypes';

type Props = {
  id: string | number;
};

const ViewPurchase = ({ id }: Props) => {
  const { data, isLoading } = useGetSinglePurchaseQuery(id);
  const purchase = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!purchase) {
    return null;
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'green';
      case 'PARTIALLY_PAID':
        return 'orange';
      case 'UNPAID':
        return 'red';
      default:
        return 'default';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'green';
      case 'PARTIALLY_RECEIVED':
        return 'orange';
      case 'ORDERED':
        return 'blue';
      case 'PENDING':
        return 'gold';
      case 'CANCELLED':
      case 'RETURNED':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card size='small' className='modal-container'>
      <Descriptions bordered column={2} size='small'>
        <Descriptions.Item label='Invoice Number'>
          <strong style={{ fontSize: 15, color: '#0958d9' }}>
            {purchase.purchase_number}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Order Status'>
          <Tag color={getOrderStatusColor(purchase.status)}>
            {purchase.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Payment Status'>
          <Tag color={getPaymentStatusColor(purchase.payment_status)}>
            {purchase.payment_status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Supplier'>
          <div>
            <strong>{purchase.supplier_name}</strong>
            {purchase.supplier_company && <div>{purchase.supplier_company}</div>}
            {purchase.supplier_phone && <div style={{ color: '#888' }}>{purchase.supplier_phone}</div>}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Branch'>
          {purchase.branch_name || 'All / Central'}
        </Descriptions.Item>
        <Descriptions.Item label='Warehouse'>
          <strong>{purchase.warehouse_name || 'N/A'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Purchase Date'>
          {purchase.purchase_date ? dateAndTimeFormat(purchase.purchase_date) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Payment Account'>
          {purchase.payment_account_name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Subtotal'>
          ৳ {Number(purchase.subtotal_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Descriptions.Item>
        <Descriptions.Item label='Discount'>
          - ৳ {Number(purchase.discount_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Descriptions.Item>
        <Descriptions.Item label='Shipping Cost'>
          + ৳ {Number(purchase.shipping_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Descriptions.Item>
        <Descriptions.Item label='Grand Total'>
          <strong style={{ fontSize: 16, color: '#0958d9' }}>
            ৳ {Number(purchase.grand_total || purchase.grand_total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Paid Amount'>
          <strong style={{ color: '#52c41a' }}>
            ৳ {Number(purchase.paid_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label='Due Payable'>
          <strong style={{ color: Number(purchase.due_amount || 0) > 0 ? '#ff4d4f' : '#52c41a' }}>
            ৳ {Number(purchase.due_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </Descriptions.Item>
        {purchase.notes && (
          <Descriptions.Item label='Notes' span={2}>
            {purchase.notes}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 20, marginBottom: 8 }}>
        Purchased Line Items
      </Typography.Title>

      <Table<IPurchaseItem>
        dataSource={purchase.items}
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
            title: 'Batch / Expiry',
            key: 'batch',
            width: 140,
            render: (_t, record) => (
              <div>
                <div>{record.batch_number || '-'}</div>
                {record.expiry_date && (
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    Exp: {record.expiry_date.slice(0, 10)}
                  </div>
                )}
              </div>
            ),
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 90,
            align: 'center',
          },
          {
            title: 'Unit Cost',
            dataIndex: 'unit_cost',
            key: 'unit_cost',
            width: 120,
            align: 'right',
            render: (val, record) => `৳ ${Number(val !== undefined ? val : record.purchase_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
          {
            title: 'Line Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            width: 130,
            align: 'right',
            render: (val, record) => {
              const total = val !== undefined ? val : (record.total_cost ?? Number(record.quantity) * Number(record.unit_cost || record.purchase_price || 0));
              return (
                <strong>
                  ৳ {Number(total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
              );
            },
          },
        ]}
      />
    </Card>
  );
};

export default ViewPurchase;
