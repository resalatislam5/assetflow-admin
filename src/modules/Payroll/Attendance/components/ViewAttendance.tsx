import { EnvironmentOutlined } from '@ant-design/icons';
import { Descriptions, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { dateAndTimeFormat } from '../../../../common/utils/helper.function';
import { getGoogleMapUrl } from '../../../../common/utils/geoHelper';
import { useGetSingleAttendanceQuery } from '../api/attendanceEndpoints';

const ViewAttendance = ({ _id }: { _id: string }) => {
  const { data, isLoading } = useGetSingleAttendanceQuery(_id, {
    skip: !_id,
  });

  if (isLoading) return <Skeleton active />;

  const {
    status,
    check_out,
    check_in,
    location,
    latitude,
    longitude,
    remarks,
    employee_code,
    employee_name,
    date,
  } = data?.data || {};

  return (
    <Descriptions bordered column={2} size='small'>
      <Descriptions.Item label='Employee Name'>
        {employee_name || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label='Employee Code'>
        {employee_code || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label='Date'>
        {dateAndTimeFormat(date)}
      </Descriptions.Item>
      <Descriptions.Item label='Status'>{status || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label='Check In'>
        {check_in ? dayjs(check_in).format('hh:mm A') : 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label='Check Out'>
        {check_out ? dayjs(check_out).format('hh:mm A') : 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label='Location' span={2}>
        {location || latitude ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
            <a
              href={getGoogleMapUrl(latitude, longitude, location)}
              target='_blank'
              rel='noreferrer'
            >
              {location || `${latitude}, ${longitude}`} (View on Map)
            </a>
          </span>
        ) : (
          'N/A'
        )}
      </Descriptions.Item>
      <Descriptions.Item label='Remarks' span={2}>
        {remarks || 'N/A'}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ViewAttendance;
