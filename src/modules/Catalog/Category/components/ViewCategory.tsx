import { Card, Descriptions, Spin, Tag } from 'antd';
import { useGetSingleCategoryQuery } from '../api/categoryEndpoints';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { CustomImage } from '../../../../common/components/Image';

type Props = {
  id: string | number;
};

const ViewCategory = ({ id }: Props) => {
  const { data, isLoading } = useGetSingleCategoryQuery(id);
  const category = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <Card className='modal-container'>
      <Descriptions bordered column={2}>
        <Descriptions.Item label='Category Name' span={2}>
          <strong>{category.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label='Slug'>{category.slug}</Descriptions.Item>
        <Descriptions.Item label='Parent Category'>
          {category.parent_name || 'Root Category'}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={category.status === 'ACTIVE' ? 'green' : 'red'}>
            {category.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Display Order'>
          {category.display_order ?? 0}
        </Descriptions.Item>
        <Descriptions.Item label='Subcategories Count'>
          {category.children_count ?? 0}
        </Descriptions.Item>
        <Descriptions.Item label='Products Count'>
          {category.products_count ?? 0}
        </Descriptions.Item>
        <Descriptions.Item label='Image' span={2}>
          <CustomImage
            src={category.image}
            alt={category.name}
            width={100}
            height={100}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        </Descriptions.Item>
        <Descriptions.Item label='Created At' span={2}>
          {category.created_at ? dateAndTimeFormat(category.created_at) : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label='Description' span={2}>
          {category.description || 'No description provided'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewCategory;
