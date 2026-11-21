import { Card, Descriptions, Image, Space, Spin, Table, Tag } from 'antd';
import { useGetSingleProductQuery } from '../api/productEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { CustomImage } from '../../../../common/components/Image';
import type { IProductVariant } from '../types/productTypes';

type Props = {
  id: string | number;
};

const ViewProduct = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleProductQuery(id);
  const product = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const statusColorMap: Record<string, string> = {
    ACTIVE: 'green',
    DRAFT: 'orange',
    ARCHIVED: 'default',
  };

  return (
    <Card className='modal-container'>
      <Descriptions bordered column={2}>
        <Descriptions.Item label='Product Title' span={2}>
          <strong>{product.title}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='SKU'>{product.sku}</Descriptions.Item>
        <Descriptions.Item label='Short Code'>
          {product.short_code ? <Tag color='cyan'>{product.short_code}</Tag> : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Slug'>{product.slug}</Descriptions.Item>
        <Descriptions.Item label='Product Type'>
          <Tag color='geekblue'>{product.product_type || 'STANDARD'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Tracking Type'>
          <Tag color={product.tracking_type === 'NONE' ? 'default' : 'purple'}>
            {product.tracking_type || 'NONE'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Category'>
          {product.category_name ? (
            <Tag color='blue'>{product.category_name}</Tag>
          ) : (
            'None'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Brand'>
          {product.brand_name ? (
            <Tag color='purple'>{product.brand_name}</Tag>
          ) : (
            'None'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Unit'>
          {product.unit || 'PCS'}
          {product.allow_fractional_qty && (
            <Tag color='green' style={{ marginLeft: 8 }}>
              Fractional
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Purchase Price'>
          ৳{Number(product.purchase_price || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label='Base / Selling Price'>
          <strong>৳{Number(product.base_price).toFixed(2)}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='MRP'>
          ৳{Number(product.mrp || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label='Wholesale Price'>
          ৳{Number(product.wholesale_price || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label='Min Selling Price'>
          ৳{Number(product.min_selling_price || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label='Special Price'>
          {product.special_price
            ? `৳${Number(product.special_price).toFixed(2)}${
                product.special_price_start || product.special_price_end
                  ? ` (${product.special_price_start ? dateAndTimeFormat(product.special_price_start) : 'Open'} – ${product.special_price_end ? dateAndTimeFormat(product.special_price_end) : 'Open'})`
                  : ''
              }`
            : 'None'}
        </Descriptions.Item>
        <Descriptions.Item label='Tax & VAT'>
          {Number(product.vat_rate || 0).toFixed(2)}% ({product.tax_type || 'INCLUSIVE'})
        </Descriptions.Item>
        <Descriptions.Item label='Low Stock Alert Qty'>
          {product.alert_quantity ?? 5}
        </Descriptions.Item>
        <Descriptions.Item label='Warranty'>
          {product.has_warranty
            ? `${product.warranty_days || 0} Days`
            : 'No Warranty'}
        </Descriptions.Item>
        <Descriptions.Item label='POS Favorite'>
          {product.is_pos_favorite ? (
            <Tag color='magenta'>YES (Order: {product.pos_display_order || 0})</Tag>
          ) : (
            <Tag>NO</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={statusColorMap[product.status] || 'default'}>
            {product.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Featured'>
          {product.is_featured ? (
            <Tag color='gold'>FEATURED</Tag>
          ) : (
            <Tag>STANDARD</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Barcode'>
          {product.barcode || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Weight'>
          {product.weight_grams ? `${product.weight_grams}g` : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {product.created_at ? dateAndTimeFormat(product.created_at) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Updated At'>
          {product.updated_at ? dateAndTimeFormat(product.updated_at) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Short Description' span={2}>
          {product.short_description || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Full Description' span={2}>
          {product.description || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Thumbnail (Primary Image)' span={2}>
          {product.primary_image ? (
            <CustomImage
              src={product.primary_image}
              alt={product.title}
              width={100}
              height={100}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          ) : (
            'No Thumbnail'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Gallery Images' span={2}>
          {product.images?.filter((img) => !img.is_primary && img.image_url !== product.primary_image).length ? (
            <Image.PreviewGroup>
              <Space wrap size='middle'>
                {product.images
                  .filter((img) => !img.is_primary && img.image_url !== product.primary_image)
                  .map((img) => (
                    <div key={img.id || img.image_url} style={{ textAlign: 'center' }}>
                      <CustomImage
                        src={img.image_url}
                        alt={img.alt_text || product.title}
                        width={90}
                        height={90}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    </div>
                  ))}
              </Space>
            </Image.PreviewGroup>
          ) : (
            'No Gallery Images'
          )}
        </Descriptions.Item>
      </Descriptions>

      {product.variants && product.variants.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4>Product Variants ({product.variants.length})</h4>
          <Table<IProductVariant>
            dataSource={product.variants}
            rowKey='id'
            pagination={false}
            size='small'
            bordered
            columns={[
              { title: 'Variant Name', dataIndex: 'variant_name', key: 'variant_name' },
              { title: 'SKU', dataIndex: 'sku', key: 'sku' },
              {
                title: 'Short Code',
                dataIndex: 'short_code',
                key: 'short_code',
                render: (val) => val || '—',
              },
              {
                title: 'Barcode',
                dataIndex: 'barcode',
                key: 'barcode',
                render: (val) => val || '—',
              },
              {
                title: 'Purchase Price',
                dataIndex: 'purchase_price',
                key: 'purchase_price',
                render: (val) => (val !== undefined && val !== null ? `৳${Number(val).toFixed(2)}` : '—'),
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (val) => `৳${Number(val).toFixed(2)}`,
              },
              {
                title: 'MRP',
                dataIndex: 'mrp',
                key: 'mrp',
                render: (val) => (val ? `৳${Number(val).toFixed(2)}` : '—'),
              },
              {
                title: 'Wholesale Price',
                dataIndex: 'wholesale_price',
                key: 'wholesale_price',
                render: (val) => (val ? `৳${Number(val).toFixed(2)}` : '—'),
              },
              {
                title: 'Min Selling Price',
                dataIndex: 'min_selling_price',
                key: 'min_selling_price',
                render: (val) => (val ? `৳${Number(val).toFixed(2)}` : '—'),
              },
              {
                title: 'Special Price',
                dataIndex: 'special_price',
                key: 'special_price',
                render: (val) => (val ? `৳${Number(val).toFixed(2)}` : '—'),
              },
              {
                title: 'Status',
                dataIndex: 'is_active',
                key: 'is_active',
                render: (active) => (
                  <Tag color={active ? 'green' : 'red'}>
                    {active ? 'ACTIVE' : 'INACTIVE'}
                  </Tag>
                ),
              },
            ]}
          />
        </div>
      )}
    </Card>
  );
};

export default ViewProduct;
