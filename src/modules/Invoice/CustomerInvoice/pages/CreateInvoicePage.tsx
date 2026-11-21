import { Form } from 'antd';
import { useNavigate } from 'react-router';
import SingleContainer from '../../../../layout/components/SingleContainer';
import InvoiceInputs from '../components/InvoiceInputs';
import { useCreateOrderMutation } from '../api/invoiceEndpoints';
import { useGetProductSelectQuery } from '../../../../common/SelectWithApi/SelectEndpoints';
import type { ICreateOrder } from '../types/invoiceTypes';

const CreateOrderPage = () => {
  const [form] = Form.useForm<ICreateOrder>();
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: productData } = useGetProductSelectQuery();

  const products = productData?.data || [];

  const onFinish = (values: ICreateOrder) => {
    const addressSnapshot = {
      recipient_name: values.recipient_name,
      recipient_phone: values.recipient_phone,
      division_id: values.division_id ? Number(values.division_id) : undefined,
      district_id: values.district_id ? Number(values.district_id) : undefined,
      upazila_id: values.upazila_id ? Number(values.upazila_id) : undefined,
      street_address: values.street_address,
    };

    const formattedItems = (values.items || []).map((item) => {
      const prod = products.find(
        (p) => String(p.id) === String(item.product_id),
      );
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

    const payload: ICreateOrder = {
      customer_id: Number(values.customer_id),
      warehouse_id: values.warehouse_id
        ? Number(values.warehouse_id)
        : undefined,
      recipient_name: values.recipient_name,
      recipient_phone: values.recipient_phone,
      division_id: values.division_id ? Number(values.division_id) : undefined,
      district_id: values.district_id ? Number(values.district_id) : undefined,
      upazila_id: values.upazila_id ? Number(values.upazila_id) : undefined,
      street_address: values.street_address,
      payment_method: values.payment_method,
      shipping_amount: Number(values.shipping_amount || 0),
      discount_amount: Number(values.discount_amount || 0),
      points_to_redeem: values.points_to_redeem
        ? Number(values.points_to_redeem)
        : undefined,
      coupon_code: values.coupon_code || '',
      customer_notes: values.customer_notes || '',
      admin_notes: values.admin_notes || '',
      items: formattedItems,
      shipping_address_snapshot: addressSnapshot,
      billing_address_snapshot: addressSnapshot,
    };

    createOrder(payload)
      .unwrap()
      .then(() => {
        form.resetFields();
        navigate('/invoices');
      });
  };

  return (
    <SingleContainer title='Create Customer Invoice'>
      <InvoiceInputs form={form} onFinish={onFinish} loading={isLoading} />
    </SingleContainer>
  );
};

export default CreateOrderPage;
