import { Popconfirm, Space } from 'antd';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { openModal } from '../../../../app/features/modalSlice';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import AntTable from '../../../../common/Table/AntTable';
import { getStatusTag } from '../../../../common/utils/status';
import ViewButton from '../../../../common/Button/ViewButton';
import EditButton from '../../../../common/Button/EditButton';
import DeleteButton from '../../../../common/Button/DeleteButton';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import {
  useDeleteSupplierMutation,
  useGetSupplierListQuery,
} from '../api/supplierEndpoints';
import type { ISupplierList } from '../types/supplierTypes';
import CreateSupplier from '../components/CreateSupplier';
import UpdateSupplier from '../components/UpdateSupplier';
import ViewSupplier from '../components/ViewSupplier';

const SupplierList = () => {
  const { can_create, can_delete, can_update } = useCheckPermission('SUPPLIER');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetSupplierListQuery(query);
  const [deleteSupplier, { isLoading: isDeleting }] =
    useDeleteSupplierMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Supplier',
            content: <CreateSupplier />,
            open: true,
            width: 700,
          }),
        )
      }
      title='Supplier List'
      options={{ showButton: can_create }}
    >
      <AntTable<ISupplierList>
        dataSource={data?.data}
        rowKey='id'
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'name',
            key: 'name',
            title: 'Supplier Name',
            render: (name, record) => (
              <Space direction='vertical' size={0}>
                <strong>{name}</strong>
                {record.company_name && (
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {record.company_name}
                  </span>
                )}
              </Space>
            ),
          },
          {
            dataIndex: 'phone',
            key: 'phone',
            title: 'Contact',
            render: (_text, record) => (
              <Space direction='vertical' size={0}>
                {record.phone && <span>{record.phone}</span>}
                {record.email && (
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {record.email}
                  </span>
                )}
                {!record.phone && !record.email && <span>-</span>}
              </Space>
            ),
          },
          {
            dataIndex: 'opening_balance',
            key: 'opening_balance',
            title: 'Opening (৳)',
            align: 'right',
            width: 120,
            render: (val) =>
              Number(val || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              }),
          },
          {
            dataIndex: 'current_balance',
            key: 'current_balance',
            title: 'Payable Due (৳)',
            align: 'right',
            width: 140,
            render: (val) => {
              const due = Number(val || 0);
              return (
                <strong style={{ color: due > 0 ? '#ff4d4f' : '#52c41a' }}>
                  ৳ {due.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
              );
            },
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            width: 90,
            render: (text) => getStatusTag(text),
          },
          {
            dataIndex: 'created_at',
            key: 'created_at',
            title: 'Created At',
            width: 150,
            render: (text) => dateAndTimeFormat(text),
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_text, record) => (
              <Space size='small'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Supplier',
                        content: <ViewSupplier id={record.id} />,
                        open: true,
                        width: 700,
                      }),
                    )
                  }
                />
                {can_update && (
                  <EditButton
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: 'Update Supplier',
                          content: <UpdateSupplier id={record.id} />,
                          open: true,
                          width: 700,
                        }),
                      )
                    }
                  />
                )}
                {can_delete && (
                  <Popconfirm
                    title='Delete Supplier'
                    description='Are you sure you want to delete this supplier?'
                    onConfirm={() => deleteSupplier(record.id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <DeleteButton loading={isDeleting} />
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default SupplierList;
