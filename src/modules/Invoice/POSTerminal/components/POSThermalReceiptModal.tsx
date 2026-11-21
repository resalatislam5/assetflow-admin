import { PrinterOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Typography } from 'antd';
import type { IPOSCompletedOrder } from '../types/posTerminalTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  order: IPOSCompletedOrder | null;
}

const POSThermalReceiptModal = ({ open, onClose, order }: Props) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
        <Button
          key='print'
          type='primary'
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          Print Receipt
        </Button>,
      ]}
      width={400}
      centered
      title='Sales Receipt'
    >
      <div
        id='thermal-receipt'
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#000',
          padding: '8px 4px',
          lineHeight: 1.4,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            AssetFlow Ltd.
          </Typography.Title>
          <div style={{ fontSize: 11, color: '#555' }}>
            Retail & Wholesale Point of Sale
          </div>
          {order.branch_name && (
            <div style={{ fontSize: 11, fontWeight: 'bold' }}>
              Branch: {order.branch_name}
            </div>
          )}
          <div style={{ fontSize: 10, color: '#666' }}>
            {new Date(order.created_at || order.invoice_date).toLocaleString()}
          </div>
        </div>

        <Divider style={{ margin: '6px 0', borderColor: '#bbb' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span>Invoice #:</span>
          <strong>{order.invoice_number || order.order_number}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span>Customer:</span>
          <span>{order.customer_name || 'Walk-in Customer'}</span>
        </div>
        {order.customer_phone && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span>Phone:</span>
            <span>{order.customer_phone}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span>Payment:</span>
          <span>{order.payment_method}</span>
        </div>

        <Divider style={{ margin: '6px 0', borderColor: '#bbb' }} />

        <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px dashed #999', textAlign: 'left' }}>
              <th style={{ paddingBottom: 4 }}>Item</th>
              <th style={{ textAlign: 'center', paddingBottom: 4 }}>Qty</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>Price</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px dotted #e0e0e0' }}>
                <td style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <div>{item.product_title}</div>
                  {item.variant_name && (
                    <span style={{ fontSize: 10, color: '#666' }}>
                      ({item.variant_name})
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 4 }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: 'right', paddingTop: 4, paddingBottom: 4 }}>
                  ৳{Number(item.unit_price).toFixed(2)}
                </td>
                <td style={{ textAlign: 'right', paddingTop: 4, paddingBottom: 4, fontWeight: 'bold' }}>
                  ৳{Number(item.total_amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Divider style={{ margin: '6px 0', borderColor: '#bbb' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span>Subtotal:</span>
          <span>৳{Number(order.subtotal_amount || 0).toFixed(2)}</span>
        </div>
        {Number(order.discount_amount || 0) > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cf1322' }}>
            <span>Discount:</span>
            <span>-৳{Number(order.discount_amount).toFixed(2)}</span>
          </div>
        )}
        {Number(order.tax_amount || 0) > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span>VAT / Tax:</span>
            <span>+৳{Number(order.tax_amount).toFixed(2)}</span>
          </div>
        )}

        <Divider style={{ margin: '6px 0', borderColor: '#000' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 'bold' }}>
          <span>Grand Total:</span>
          <span>৳{Number(order.grand_total_amount || 0).toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4 }}>
          <span>Tendered:</span>
          <span>৳{Number(order.tendered_amount || order.paid_amount || 0).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span>Paid:</span>
          <span>৳{Number(order.paid_amount || 0).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 'bold', color: '#389e0d' }}>
          <span>Change Returned:</span>
          <span>৳{Number(order.change_amount || 0).toFixed(2)}</span>
        </div>

        <Divider style={{ margin: '8px 0', borderColor: '#bbb' }} />

        <div style={{ textAlign: 'center', fontSize: 10, color: '#666', marginTop: 8 }}>
          Thank you for shopping with us!
          <div>Please keep this receipt for warranty and returns.</div>
        </div>
      </div>
    </Modal>
  );
};

export default POSThermalReceiptModal;
