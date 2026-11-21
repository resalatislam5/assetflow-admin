import { Form, Spin } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import SingleContainer from '../../../../layout/components/SingleContainer';
import InvoiceInputs from '../components/InvoiceInputs';
import {
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
} from '../api/invoiceEndpoints';
import { useGetProductSelectQuery } from '../../../../common/SelectWithApi/SelectEndpoints';
import type { ICreateOrder } from '../types/invoiceTypes';

const UpdateOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ICreateOrder>();
  const navigate = useNavigate();
  const { data: orderDetails, isLoading: isFetchingOrder } =
    useGetSingleOrderQuery(id || '');
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const { data: productData } = useGetProductSelectQuery();

  const products = productData?.data || [];
  const fullOrder = orderDetails?.data;

  useEffect(() => {
    if (fullOrder) {
      const addr = (fullOrder.shipping_address_snapshot || {}) as unknown as Record<
        string,
        string
      >;
      const items = (fullOrder.items || []).map((item) => ({
        warehouse_id: item.warehouse_id ? Number(item.warehouse_id) : undefined,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_title: item.product_title,
        variant_name: item.variant_name,
        sku: item.sku,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
      }));

      form.setFieldsValue({
        customer_id: fullOrder.customer_id,
        warehouse_id: fullOrder.warehouse_id ? Number(fullOrder.warehouse_id) : undefined,
        payment_method: fullOrder.payment_method,
        recipient_name:
          addr.recipient_name ||
          addr.full_name ||
          fullOrder.customer_name ||
          '',
        recipient_phone:
          addr.recipient_phone ||
          addr.phone ||
          fullOrder.customer_phone ||
          '',
        division_id: addr.division_id ? Number(addr.division_id) : undefined,
        district_id: addr.district_id ? Number(addr.district_id) : undefined,
        upazila_id: addr.upazila_id ? Number(addr.upazila_id) : undefined,
        upazila_thana: addr.upazila_thana || addr.upazila_name || '',
        upazila_name: addr.upazila_name || addr.upazila_thana || '',
        division: addr.division || '',
        district: addr.district || addr.city || '',
        street_address:
          addr.street_address ||
          addr.address_line ||
          '',
        shipping_amount: Number(fullOrder.shipping_amount || 0),
        discount_amount: Number(fullOrder.discount_amount || 0),
        points_to_redeem: fullOrder.points_redeemed ? Number(fullOrder.points_redeemed) : undefined,
        coupon_code: fullOrder.coupon_code || '',
        customer_notes: fullOrder.customer_notes || '',
        admin_notes: fullOrder.admin_notes || '',
        items: items.length > 0 ? items : undefined,
      });
    }
  }, [form, fullOrder]);

  const onFinish = (values: ICreateOrder) => {
    if (!id) return;

    const addressSnapshot = {
      recipient_name: values.recipient_name,
      recipient_phone: values.recipient_phone,
      division_id: values.division_id ? Number(values.division_id) : undefined,
      district_id: values.district_id ? Number(values.district_id) : undefined,
      upazila_id: values.upazila_id ? Number(values.upazila_id) : undefined,
      street_address: values.street_address,
    };

    const formattedItems = (values.items || []).map((item) => {
      const prod = products.find((p) => String(p.id) === String(item.product_id));
      return {
        warehouse_id: item.warehouse_id
          ? Number(item.warehouse_id)
          : values.warehouse_id
            ? Number(values.warehouse_id)
            : undefined,
        product_id: Number(item.product_id),
        product_title: item.product_title || prod?.title || 'Product',
        sku: item.sku || prod?.sku || 'SKU',
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        variant_id: item.variant_id ? Number(item.variant_id) : undefined,
        variant_name: item.variant_name || '',
      };
    });

    const payload: Partial<ICreateOrder> = {
      customer_id: Number(values.customer_id),
      warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : undefined,
      recipient_name: values.recipient_name,
      recipient_phone: values.recipient_phone,
      division_id: values.division_id ? Number(values.division_id) : undefined,
      district_id: values.district_id ? Number(values.district_id) : undefined,
      upazila_id: values.upazila_id ? Number(values.upazila_id) : undefined,
      upazila_thana: values.upazila_thana || values.upazila_name || '',
      upazila_name: values.upazila_name || values.upazila_thana || '',
      division: values.division,
      district: values.district,
      street_address: values.street_address,
      payment_method: values.payment_method,
      shipping_amount: Number(values.shipping_amount || 0),
      discount_amount: Number(values.discount_amount || 0),
      coupon_code: values.coupon_code || '',
      customer_notes: values.customer_notes || '',
      admin_notes: values.admin_notes || '',
      items: formattedItems,
      shipping_address_snapshot: addressSnapshot,
      billing_address_snapshot: addressSnapshot,
    };

    updateOrder({ id, body: payload })
      .unwrap()
      .then(() => {
        form.resetFields();
        navigate(`/invoices/${id}`);
      });
  };

  if (isFetchingOrder) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin tip='Loading invoice details...' size='large' />
      </div>
    );
  }

  return (
    <SingleContainer
      title={`Update Invoice: ${fullOrder?.invoice_number || fullOrder?.order_number || `#${id}`}`}
    >
      <InvoiceInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode={true}
      />
    </SingleContainer>
  );
};

export default UpdateOrderPage;

