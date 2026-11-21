import { Space, Tag } from 'antd';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import AntTable from '../../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { getStatusTag } from '../../../../common/utils/status';
import { ImagePreview } from '../../../../common/components/Image';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import ViewButton from '../../../../common/Button/ViewButton';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import {
  useDeleteCategoryMutation,
  useGetCategoryListQuery,
} from '../api/categoryEndpoints';
import CreateCategory from '../components/CreateCategory';
import UpdateCategory from '../components/UpdateCategory';
import ViewCategory from '../components/ViewCategory';
import type { ICategoryList } from '../types/categoryTypes';

const CategoryList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('CATEGORY');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetCategoryListQuery(query);
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Category',
            content: <CreateCategory />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Category List'
      options={{ showButton: can_create }}
    >
      <AntTable<ICategoryList>
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            dataIndex: 'image',
            key: 'image',
            title: 'Image',
            width: 80,
            render: (image: string) => (
              <ImagePreview src={image} width={42} height={42} />
            ),
          },
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Name',
            render: (text: string, record: ICategoryList) => (
              <div>
                <strong>{text}</strong>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.slug}</div>
              </div>
            ),
          },
          {
            dataIndex: 'parent_name',
            key: 'parent_name',
            title: 'Parent Category',
            render: (text: string) =>
              text ? <Tag color='blue'>{text}</Tag> : <Tag>Root</Tag>,
          },
          {
            dataIndex: 'display_order',
            key: 'display_order',
            title: 'Order',
            width: 80,
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 100,
            render: (text) => getStatusTag(text),
          },
          {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Created At',
            width: 160,
            render: (text: string) => (text ? dateAndTimeFormat(text) : 'N/A'),
          },
          {
            title: 'Action',
            key: 'action',
            width: 180,
            render: (_, record) => (
              <Space>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Category',
                        content: <ViewCategory id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <EditButton
                  can_update={can_update}
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Update Category',
                        content: <UpdateCategory id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  onClick={() => deleteCategory(record.id)}
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

export default CategoryList;
