import { Form } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { useCreateProductMutation } from '../api/productEndpoints';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import { cleanImageKey } from '../../../../common/utils/toUploadFileList ';
import SingleContainer from '../../../../layout/components/SingleContainer';
import ProductInputs from '../components/ProductInputs';
import type { ICreateProduct } from '../types/productTypes';

const CreateProductPage = () => {
  const [form] = Form.useForm<ICreateProduct>();
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const onFinish = (values: ICreateProduct) => {
    const payload: ICreateProduct = {
      ...values,
      purchase_price:
        values.purchase_price !== undefined &&
        values.purchase_price !== null &&
        (values.purchase_price as unknown as string) !== ''
          ? Number(values.purchase_price)
          : undefined,
      base_price: Number(values.base_price),
      mrp:
        values.mrp !== undefined &&
        values.mrp !== null &&
        (values.mrp as unknown as string) !== ''
          ? Number(values.mrp)
          : 0,
      wholesale_price:
        values.wholesale_price !== undefined &&
        values.wholesale_price !== null &&
        (values.wholesale_price as unknown as string) !== ''
          ? Number(values.wholesale_price)
          : 0,
      min_selling_price:
        values.min_selling_price !== undefined &&
        values.min_selling_price !== null &&
        (values.min_selling_price as unknown as string) !== ''
          ? Number(values.min_selling_price)
          : 0,
      special_price:
        values.special_price !== undefined &&
        values.special_price !== null &&
        (values.special_price as unknown as string) !== ''
          ? Number(values.special_price)
          : undefined,
      special_price_start: values.special_price_start
        ? dayjs(values.special_price_start).toISOString()
        : undefined,
      special_price_end: values.special_price_end
        ? dayjs(values.special_price_end).toISOString()
        : undefined,
      vat_rate:
        values.vat_rate !== undefined &&
        values.vat_rate !== null &&
        (values.vat_rate as unknown as string) !== ''
          ? Number(values.vat_rate)
          : 0,
      alert_quantity:
        values.alert_quantity !== undefined &&
        values.alert_quantity !== null &&
        (values.alert_quantity as unknown as string) !== ''
          ? Number(values.alert_quantity)
          : 5,
      has_warranty: Boolean(values.has_warranty),
      warranty_days:
        values.warranty_days !== undefined &&
        values.warranty_days !== null &&
        (values.warranty_days as unknown as string) !== ''
          ? Number(values.warranty_days)
          : 0,
      allow_fractional_qty: Boolean(values.allow_fractional_qty),
      is_pos_favorite: Boolean(values.is_pos_favorite),
      pos_display_order:
        values.pos_display_order !== undefined &&
        values.pos_display_order !== null &&
        (values.pos_display_order as unknown as string) !== ''
          ? Number(values.pos_display_order)
          : 0,
      weight_grams:
        values.weight_grams !== undefined &&
        values.weight_grams !== null &&
        (values.weight_grams as unknown as string) !== ''
          ? Number(values.weight_grams)
          : undefined,
      has_variants: Boolean(values.has_variants),
      variants:
        values.has_variants && values.variants?.length
          ? values.variants.map((v) => ({
              ...v,
              purchase_price:
                v.purchase_price !== undefined &&
                v.purchase_price !== null &&
                (v.purchase_price as unknown as string) !== ''
                  ? Number(v.purchase_price)
                  : undefined,
              price: Number(v.price),
              mrp:
                v.mrp !== undefined &&
                v.mrp !== null &&
                (v.mrp as unknown as string) !== ''
                  ? Number(v.mrp)
                  : 0,
              wholesale_price:
                v.wholesale_price !== undefined &&
                v.wholesale_price !== null &&
                (v.wholesale_price as unknown as string) !== ''
                  ? Number(v.wholesale_price)
                  : 0,
              min_selling_price:
                v.min_selling_price !== undefined &&
                v.min_selling_price !== null &&
                (v.min_selling_price as unknown as string) !== ''
                  ? Number(v.min_selling_price)
                  : 0,
              special_price:
                v.special_price !== undefined &&
                v.special_price !== null &&
                (v.special_price as unknown as string) !== ''
                  ? Number(v.special_price)
                  : undefined,
              image_url: v.image_url ? cleanImageKey(v.image_url) : undefined,
              is_active: v.is_active !== undefined ? Boolean(v.is_active) : true,
            }))
          : [],
    };
    const formData = sanitizeFormData(payload, {
      fileKeys: ['upload_thumbnail', 'upload_images'],
    });

    createProduct(formData)
      .unwrap()
      .then(() => {
        form.resetFields();
        navigate('/catalog/products');
      });
  };

  return (
    <SingleContainer title='Create Product'>
      <ProductInputs form={form} onFinish={onFinish} loading={isLoading} />
    </SingleContainer>
  );
};

export default CreateProductPage;
