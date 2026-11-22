import { Col, Select, Space, Tag } from 'antd';
import { useNavigate } from 'react-router';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { ImagePreview } from '../../../../common/components/Image';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import ViewButton from '../../../../common/Button/ViewButton';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { SelectBrand, SelectCategory } from '../../../../common/SelectWithApi/Select';
import {
  useDeleteProductMutation,
  useGetProductListQuery,
} from '../api/productEndpoints';
import ViewProduct from '../components/ViewProduct';
import type { IProductList, IProductQuery } from '../types/productTypes';

const ProductList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('PRODUCT');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { query, setQuery } = useQueryParams<IProductQuery>();
  const { data, isLoading, isFetching } = useGetProductListQuery(query);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const statusColorMap: Record<string, string> = {
    ACTIVE: 'green',
    DRAFT: 'orange',
    ARCHIVED: 'default',
  };

  return (
    <ContainerLayout
      onClick={() => navigate('/catalog/products/create')}
      title='Product List'
      options={{ showButton: can_create }}
      additionalFilter={
        <>
          <Col xs={24} sm={12} lg={4}>
            <SelectCategory
              standalone
              placeholder='Filter by Category'
              value={query.category_id ? Number(query.category_id) : undefined}
              onChange={(val) => setQuery({ category_id: val })}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <SelectBrand
              standalone
              placeholder='Filter by Brand'
              value={query.brand_id ? Number(query.brand_id) : undefined}
              onChange={(val) => setQuery({ brand_id: val })}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Filter by Status'
              allowClear
              value={query.status}
              onChange={(val) => setQuery({ status: val })}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Archived', value: 'ARCHIVED' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Product Type'
              allowClear
              value={query.product_type}
              onChange={(val) => setQuery({ product_type: val })}
              options={[
                { label: 'Standard', value: 'STANDARD' },
                { label: 'Service', value: 'SERVICE' },
                { label: 'Combo', value: 'COMBO' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder='Tracking Type'
              allowClear
              value={query.tracking_type}
              onChange={(val) => setQuery({ tracking_type: val })}
              options={[
                { label: 'None', value: 'NONE' },
                { label: 'Serial / IMEI', value: 'SERIAL' },
                { label: 'Batch / Lot', value: 'BATCH' },
              ]}
            />
          </Col>
        </>
      }
    >
      <AntTable<IProductList>
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            dataIndex: 'primary_image',
            key: 'primary_image',
            title: 'Image',
            width: 70,
            render: (image: string) => (
              <ImagePreview src={image} width={44} height={44} />
            ),
          },
          {
            dataIndex: 'title',
            key: 'title',
            title: 'Product Title',
            render: (title: string, record: IProductList) => (
              <div>
                <strong style={{ fontSize: 13 }}>{title}</strong>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                  SKU: {record.sku}
                  {record.short_code && (
                    <span style={{ marginLeft: 8, color: '#1890ff' }}>
                      [{record.short_code}]
                    </span>
                  )}
                </div>
              </div>
            ),
          },
          {
            dataIndex: 'product_type',
            key: 'product_type',
            title: 'Type',
            width: 110,
            render: (type: string, record: IProductList) => (
              <Space orientation='vertical' size={2}>
                <Tag color='geekblue'>{type || 'STANDARD'}</Tag>
                {record.tracking_type && record.tracking_type !== 'NONE' && (
                  <Tag color='purple'>{record.tracking_type}</Tag>
                )}
              </Space>
            ),
          },
          {
            dataIndex: 'category_name',
            key: 'category_name',
            title: 'Category',
            width: 120,
            render: (cat: string) => (cat ? <Tag color='blue'>{cat}</Tag> : '—'),
          },
          {
            dataIndex: 'brand_name',
            key: 'brand_name',
            title: 'Brand',
            width: 110,
            render: (brand: string) => (brand ? <Tag color='purple'>{brand}</Tag> : '—'),
          },
          {
            dataIndex: 'base_price',
            key: 'base_price',
            title: 'Price (৳)',
            width: 130,
            render: (price: number, record: IProductList) => {
              const now = new Date();
              const hasStart = Boolean(record.special_price_start);
              const hasEnd = Boolean(record.special_price_end);
              const isStarted = !hasStart || new Date(record.special_price_start as string) <= now;
              const isNotEnded = !hasEnd || new Date(record.special_price_end as string) >= now;
              const isActive = Boolean(record.special_price) && isStarted && isNotEnded;

              return (
                <div>
                  <strong>৳{Number(price).toFixed(2)}</strong>
                  {record.mrp && Number(record.mrp) > 0 ? (
                    <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                      MRP: ৳{Number(record.mrp).toFixed(2)}
                    </div>
                  ) : null}
                  {record.special_price && (
                    <div
                      style={{
                        fontSize: 11,
                        color: isActive ? '#16a34a' : '#8c8c8c',
                        fontWeight: 500,
                      }}
                    >
                      Sale: ৳{Number(record.special_price).toFixed(2)}
                      {!isActive && (
                        <span style={{ fontSize: 10, display: 'block', color: '#999' }}>
                          {!isStarted ? 'Scheduled' : 'Expired'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            dataIndex: 'unit',
            key: 'unit',
            title: 'Unit',
            width: 80,
            render: (unit: string) => unit || 'PCS',
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 90,
            render: (status: string) => (
              <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
            ),
          },
          {
            dataIndex: 'is_pos_favorite',
            key: 'is_pos_favorite',
            title: 'POS Pin',
            width: 90,
            render: (_, record: IProductList) =>
              record.is_pos_favorite ? <Tag color='magenta'>POS</Tag> : null,
          },
          {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Created At',
            width: 140,
            render: (text: string) => (text ? dateAndTimeFormat(text) : 'N/A'),
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
              <Space>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Product',
                        content: <ViewProduct id={record.id} />,
                        open: true,
                        width: 1000,
                      }),
                    )
                  }
                />
                <EditButton
                  can_update={can_update}
                  onClick={() => navigate(`/catalog/products/edit/${record.id}`)}
                />
                <DeleteButton
                  can_delete={can_delete}
                  onClick={() => deleteProduct(record.id)}
                  loading={isDeleting}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default ProductList;
