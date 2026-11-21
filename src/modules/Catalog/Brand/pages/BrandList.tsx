import { Space, Typography } from 'antd';
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
  useDeleteBrandMutation,
  useGetBrandListQuery,
} from '../api/brandEndpoints';
import CreateBrand from '../components/CreateBrand';
import UpdateBrand from '../components/UpdateBrand';
import ViewBrand from '../components/ViewBrand';
import type { IBrandList } from '../types/brandTypes';

const BrandList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('BRAND');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetBrandListQuery(query);
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Brand',
            content: <CreateBrand />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Brand List'
      options={{ showButton: can_create }}
    >
      <AntTable<IBrandList>
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading || isFetching}
        bordered
        total={data?.total}
        columns={[
          {
            dataIndex: 'logo',
            key: 'logo',
            title: 'Logo',
            width: 80,
            render: (logo: string) => (
              <ImagePreview src={logo} width={42} height={42} />
            ),
          },
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Brand Name',
            render: (text: string, record: IBrandList) => (
              <div>
                <strong>{text}</strong>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.slug}</div>
              </div>
            ),
          },
          {
            dataIndex: 'website',
            key: 'website',
            title: 'Website',
            render: (website: string) =>
              website ? (
                <Typography.Link href={website} target='_blank'>
                  {website}
                </Typography.Link>
              ) : (
                '—'
              ),
          },
          {
            dataIndex: 'products_count',
            key: 'products_count',
            title: 'Products',
            width: 100,
            render: (count: number) => count ?? 0,
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
                        title: 'View Brand',
                        content: <ViewBrand id={record.id} />,
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
                        title: 'Update Brand',
                        content: <UpdateBrand id={record.id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  onClick={() => deleteBrand(record.id)}
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

export default BrandList;
