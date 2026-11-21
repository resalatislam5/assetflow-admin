import { Typography } from 'antd';
import AntTable from '../../../../common/Table/AntTable';
import { useGetSingleRoleQuery } from '../api/roleEndpoints';

import type { IPermission } from '../types/roleTypes';

const checkIcon = (value: boolean) => (
  <Typography.Text style={{ fontSize: 16 }}>
    {value ? '✅' : '❌'}
  </Typography.Text>
);
const ViewRole = ({ id }: { id: string | number }) => {
  const { data, isLoading } = useGetSingleRoleQuery(id, {
    skip: !id,
  });

  return (
    <div>
      <AntTable<IPermission>
        dataSource={data?.data?.permissions || []}
        loading={isLoading}
        rowKey={(record) => String(record.id ?? record.module_id)}
        pagination={false}
        total={data?.data?.permissions?.length}
        columns={[
          {
            key: 'module_name',
            dataIndex: 'module_name',
            title: 'Permission Name',
          },
          {
            key: 'can_read',
            dataIndex: 'can_read',
            title: 'Read',
            render: (text) => checkIcon(text),
          },
          {
            key: 'can_create',
            dataIndex: 'can_create',
            title: 'Create',
            render: (text) => checkIcon(text),
          },
          {
            key: 'can_update',
            dataIndex: 'can_update',
            title: 'Update',
            render: (text) => checkIcon(text),
          },
          {
            key: 'can_delete',
            dataIndex: 'can_delete',
            title: 'Delete',
            render: (text) => checkIcon(text),
          },
        ]}
      />
    </div>
  );
};

export default ViewRole;
