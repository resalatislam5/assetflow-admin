import { Card, Form, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from '../api/productEndpoints';
import { sanitizeFormData } from '../../../../common/utils/sanitizeFormData';
import { toUploadFileList, cleanImageKey } from '../../../../common/utils/toUploadFileList ';
import ProductInputs from './ProductInputs';
import type { ICreateProduct, IProductImage } from '../types/productTypes';

type Props = {
  id: string | number;
};

const UpdateProduct = ({ id }: Props) => {
  const [form] = Form.useForm<ICreateProduct>();
  const { data, isLoading: isFetching } = useGetSingleProductQuery(id);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      const hasVariants = Boolean(
        p.has_variants || (p.variants && p.variants.length > 0),
      );
      const primaryImageObj =
        p.images?.find((img) => img.is_primary) ||
        (p.primary_image ? { image_url: p.primary_image } : p.images?.[0]);
      const primaryImageKey = primaryImageObj?.image_url;
      const galleryImageKeys = (p.images || [])
        .filter((img) => !img.is_primary && img.image_url !== primaryImageKey)
        .map((img) => img.image_url);

      form.setFieldsValue({
        title: p.title,
        slug: p.slug,
        short_code: p.short_code,
        product_type: p.product_type || 'STANDARD',
        tracking_type: p.tracking_type || 'NONE',
        category_id:
          p.category_id !== undefined && p.category_id !== null
            ? String(p.category_id)
            : undefined,
        brand_id:
          p.brand_id !== undefined && p.brand_id !== null
            ? String(p.brand_id)
            : undefined,
        unit: p.unit || 'PCS',
        allow_fractional_qty: Boolean(p.allow_fractional_qty),
        sku: p.sku,
        barcode: p.barcode,
        purchase_price:
          p.purchase_price !== undefined && p.purchase_price !== null
            ? Number(p.purchase_price)
            : undefined,
        base_price: Number(p.base_price),
        mrp: p.mrp !== undefined && p.mrp !== null ? Number(p.mrp) : 0,
        wholesale_price:
          p.wholesale_price !== undefined && p.wholesale_price !== null
            ? Number(p.wholesale_price)
            : 0,
        min_selling_price:
          p.min_selling_price !== undefined && p.min_selling_price !== null
            ? Number(p.min_selling_price)
            : 0,
        special_price:
          p.special_price !== undefined && p.special_price !== null
            ? Number(p.special_price)
            : undefined,
        special_price_start: p.special_price_start
          ? (dayjs(p.special_price_start) as unknown as string)
          : undefined,
        special_price_end: p.special_price_end
          ? (dayjs(p.special_price_end) as unknown as string)
          : undefined,
        vat_rate: p.vat_rate !== undefined && p.vat_rate !== null ? Number(p.vat_rate) : 0,
        tax_type: p.tax_type || 'INCLUSIVE',
        alert_quantity:
          p.alert_quantity !== undefined && p.alert_quantity !== null
            ? Number(p.alert_quantity)
            : 5,
        has_warranty: Boolean(p.has_warranty),
        warranty_days:
          p.warranty_days !== undefined && p.warranty_days !== null
            ? Number(p.warranty_days)
            : 0,
        status: p.status,
        is_featured: Boolean(p.is_featured),
        is_pos_favorite: Boolean(p.is_pos_favorite),
        pos_display_order:
          p.pos_display_order !== undefined && p.pos_display_order !== null
            ? Number(p.pos_display_order)
            : 0,
        weight_grams:
          p.weight_grams !== undefined && p.weight_grams !== null
            ? Number(p.weight_grams)
            : undefined,
        tags: p.tags || [],
        short_description: p.short_description,
        description: p.description,
        has_variants: hasVariants,
        variants:
          p.variants?.map((v) => ({
            id: v.id,
            variant_name: v.variant_name,
            sku: v.sku,
            short_code: v.short_code,
            barcode: v.barcode,
            purchase_price:
              v.purchase_price !== undefined && v.purchase_price !== null
                ? Number(v.purchase_price)
                : undefined,
            price: Number(v.price),
            mrp: v.mrp !== undefined && v.mrp !== null ? Number(v.mrp) : 0,
            wholesale_price:
              v.wholesale_price !== undefined && v.wholesale_price !== null
                ? Number(v.wholesale_price)
                : 0,
            min_selling_price:
              v.min_selling_price !== undefined && v.min_selling_price !== null
                ? Number(v.min_selling_price)
                : 0,
            special_price:
              v.special_price !== undefined && v.special_price !== null
                ? Number(v.special_price)
                : undefined,
            is_active: v.is_active !== undefined ? Boolean(v.is_active) : true,
            attributes_json: v.attributes_json || {},
          })) || [],
        upload_thumbnail: primaryImageKey
          ? toUploadFileList([primaryImageKey])
          : [],
        upload_images: toUploadFileList(galleryImageKeys),
      });
    }
  }, [data, form]);

  const onFinish = (values: ICreateProduct) => {
    const existingThumbnail: IProductImage[] = (values.upload_thumbnail || [])
      .filter(
        (file): file is typeof file & { url: string } =>
          !file.originFileObj &&
          typeof file.url === 'string' &&
          file.url.length > 0,
      )
      .map((file) => ({
        image_url: cleanImageKey(file.response ? String(file.response) : file.url),
        is_primary: true,
        display_order: 0,
      }));

    const existingGallery: IProductImage[] = (values.upload_images || [])
      .filter(
        (file): file is typeof file & { url: string } =>
          !file.originFileObj &&
          typeof file.url === 'string' &&
          file.url.length > 0,
      )
      .map((file, idx) => ({
        image_url: cleanImageKey(file.response ? String(file.response) : file.url),
        is_primary: false,
        display_order: idx + 1,
      }));

    const existingImages: IProductImage[] = [
      ...existingThumbnail,
      ...existingGallery,
    ];

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
      images: existingImages,
    };

    const formData = sanitizeFormData(payload, {
      fileKeys: ['upload_thumbnail', 'upload_images'],
    });

    updateProduct({ body: formData, id });
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <Card className='modal-container'>
      <ProductInputs
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        editMode
      />
    </Card>
  );
};

export default UpdateProduct;
