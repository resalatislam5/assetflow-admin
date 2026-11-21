import { EnvironmentOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { openModal } from '../../../../app/features/modalSlice';
import { useAppDispatch } from '../../../../app/hooks/hooks';
import { getGoogleMapUrl } from '../../../../common/utils/geoHelper';
import DeleteButton from '../../../../common/Button/DeleteButton';
import EditButton from '../../../../common/Button/EditButton';
import ViewButton from '../../../../common/Button/ViewButton';
import useCheckPermission from '../../../../common/hooks/useCheckPermission';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import AntTable from '../../../../common/Table/AntTable';
import { getStatusTag } from '../../../../common/utils/status';
import ContainerLayout from '../../../../layout/components/ContainerLayout';
import {
  useDeleteAttendanceMutation,
  useGetAttendanceQuery,
} from '../api/attendanceEndpoints';
import CreateAttendance from '../components/CreateAttendance';
import UpdateAttendance from '../components/UpdateAttendance';
import ViewAttendance from '../components/ViewAttendance';
import type { IAttendance } from '../types/attendanceTypes';

const AttendanceList = () => {
  const { can_create, can_delete, can_update } =
    useCheckPermission('ATTENDANCE');
  const dispatch = useAppDispatch();
  const { query } = useQueryParams();
  const { data, isLoading, isFetching } = useGetAttendanceQuery({
    params: query,
  });
  const [deleting, { isLoading: isDeleting }] = useDeleteAttendanceMutation();

  return (
    <ContainerLayout
      onClick={() =>
        dispatch(
          openModal({
            title: 'Create Attendance',
            content: <CreateAttendance />,
            open: true,
            width: 800,
          }),
        )
      }
      title='Attendance List'
      options={{ showButton: can_create }}
    >
      <AntTable
        dataSource={data?.data}
        rowKey={'_id'}
        bordered
        size='small'
        loading={isFetching || isLoading}
        total={data?.total}
        columns={[
          {
            dataIndex: 'date',
            key: 'date',
            title: 'Date',
            render: (text) => dayjs(text).format('DD MMM, YYYY'),
          },
          {
            dataIndex: 'employee_name',
            key: 'employee_name',
            title: 'Employee Name',
          },
          {
            dataIndex: 'employee_code',
            key: 'employee_code',
            title: 'Employee Code',
          },
          {
            dataIndex: 'status',
            key: 'status',
            title: 'Status',
            render: (text) => getStatusTag(text),
          },
          {
            dataIndex: 'check_in',
            key: 'check_in',
            title: 'Check In',
            render: (text) => (text ? dayjs(text).format('hh:mm A') : '-'),
          },
          {
            dataIndex: 'check_out',
            key: 'check_out',
            title: 'Check Out',
            render: (text) => (text ? dayjs(text).format('hh:mm A') : '-'),
          },
          {
            dataIndex: 'location',
            key: 'location',
            title: 'Location',
            render: (text, record: IAttendance) => {
              if (!text && !record?.latitude) return <span style={{ color: '#aaa' }}>-</span>;
              return (
                <Tooltip title='Click to open in Google Maps'>
                  <a
                    href={getGoogleMapUrl(record?.latitude, record?.longitude, text)}
                    target='_blank'
                    rel='noreferrer'
                    style={{ color: '#1677ff', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
                    <span>{text || `${record?.latitude}, ${record?.longitude}`}</span>
                  </a>
                </Tooltip>
              );
            },
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_text, record: IAttendance) => (
              <Space size='middle'>
                <ViewButton
                  onClick={() =>
                    dispatch(
                      openModal({
                        title: 'Attendance Details',
                        content: <ViewAttendance _id={record?._id} />,
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
                        title: 'Update Attendance',
                        content: <UpdateAttendance _id={record?._id} />,
                        open: true,
                        width: 800,
                      }),
                    )
                  }
                />
                <DeleteButton
                  can_delete={can_delete}
                  loading={isDeleting}
                  onClick={() => deleting(record._id)}
                />
              </Space>
            ),
          },
        ]}
      />
    </ContainerLayout>
  );
};

export default AttendanceList;
