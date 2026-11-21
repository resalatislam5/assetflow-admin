import { Card, Descriptions, Spin, Tag, Typography } from 'antd';
import { useGetSingleBrandQuery } from '../api/brandEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { CustomImage } from '../../../../common/components/Image';

type Props = {
  id: string | number;
};

const ViewBrand = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleBrandQuery(id);
  const brand = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!brand) {
    return null;
  }

  return (
    <Card className='modal-container'>
      <Descriptions bordered column={2}>
        <Descriptions.Item label='Brand Name' span={2}>
          <strong>{brand.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Slug'>{brand.slug}</Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={brand.status === 'ACTIVE' ? 'green' : 'red'}>
            {brand.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Official Website' span={2}>
          {brand.website ? (
            <Typography.Link href={brand.website} target='_blank'>
              {brand.website}
            </Typography.Link>
          ) : (
            'N/A'
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Products Count'>
          {brand.products_count ?? 0}
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {brand.created_at ? dateAndTimeFormat(brand.created_at) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Brand Logo' span={2}>
          <CustomImage
            src={brand.logo}
            alt={brand.name}
            width={100}
            height={100}
            style={{ objectFit: 'contain', borderRadius: 8, border: '1px solid #f0f0f0', padding: 4 }}
          />
        </Descriptions.Item>
        <Descriptions.Item label='Description' span={2}>
          {brand.description || 'No description provided'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewBrand;
