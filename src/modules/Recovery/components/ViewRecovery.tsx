import { Descriptions } from 'antd';
import { useGetSingleRecoveryQuery } from '../api/recovaryEndpoints';

const ViewRecovery = ({ id, _id }: { id?: string | number; _id?: string }) => {
  const targetId = String(id || _id || '');
  const { data } = useGetSingleRecoveryQuery(targetId, {
    skip: !targetId,
  });

  return (
    <div>
      <Descriptions
        column={2}
        size='small'
        bordered
        items={Object.entries(data?.data?.data || {}).map(([key, value]) => ({
          key: key,
          label: key,
          children: typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''),
        }))}
      />
    </div>
  );
};

export default ViewRecovery;
