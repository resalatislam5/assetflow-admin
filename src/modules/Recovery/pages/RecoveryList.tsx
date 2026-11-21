import { Popconfirm, Space, Tooltip } from 'antd';

import { openModal } from '../../../app/features/modalSlice';
import { useAppDispatch } from '../../../app/hooks/hooks';
import CommonButton from '../../../common/Button/CommonButton';
import ViewButton from '../../../common/Button/ViewButton';
import useCheckPermission from '../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../common/hooks/useQueryParams';
import AntTable from '../../../common/Table/AntTable';
import { dateAndTimeFormat } from '../../../common/utils/helper.function';
import ContainerLayout from '../../../layout/components/ContainerLayout';
import {
  useGetRecoveryListQuery,
  useRestoreMutation,
} from '../api/recovaryEndpoints';
import ViewRecovery from '../components/ViewRecovery';
import type { IRecoveryList, IRecoveryQuery } from '../types/recoverTypes';

const RecoveryList = () => {
  const { can_update } = useCheckPermission('RECOVERY');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams<IRecoveryQuery>();
  const { data, isLoading, isFetching } = useGetRecoveryListQuery(query);
  const [restore, { isLoading: isRestoreLoading }] = useRestoreMutation();
  return (
    <ContainerLayout
      title='Recovery List'
      options={{ showButton: false }}
      // additionalFilter={
      //   <>
      //     <SelectStudent
      //       label='Student'
      //       name='student_id'
      //       sm={8}
      //       md={8}
      //       lg={4}
      //       onChange={(e) => setQuery({ student_id: e })}
      //       noStyle
      //     />
      //   </>
      // }
    >
      <AntTable<IRecoveryList>
        dataSource={data?.data}
        rowKey={'id'}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'createdAt',
            key: 'createdAt',
            title: 'Date',
            render: (text) => dateAndTimeFormat(text),
            // width: 130,
          },
          {
            dataIndex: 'deleted_by_name',
            key: 'deleted_by_name',
            title: 'Deleted By',
          },
          { dataIndex: 'model', key: 'model', title: 'Deleted From' },

          {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_text, record) => (
              <Space size='middle'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'View Recovery',
                        open: true,
                        content: <ViewRecovery id={record?.id} />,
                        width: 1000,
                      }),
                    )
                  }
                />
                {can_update && (
                  <Tooltip title='Recovery'>
                    <Popconfirm
                      title='Are you sure to restore this item?'
                      onConfirm={() => restore(String(record?.id))}
                      okText='Yes'
                      cancelText='No'
                    >
                      <CommonButton
                        size='small'
                        text='Recovery'
                        icon={'solar:refresh-circle-outline'}
                        danger
                        loading={isRestoreLoading}
                      />
                    </Popconfirm>
                  </Tooltip>
                )}
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default RecoveryList;
