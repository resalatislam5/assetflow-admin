import { EnvironmentOutlined, LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Form, Row, Tag, type FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import FromSubmit from '../../../../common/Button/FromSubmit';
import {
  FormInputDate,
  FormInputSelect,
  FormInputText,
} from '../../../../common/Form/FormIInput';
import { SelectEmployee } from '../../../../common/SelectWithApi/Select';
import { getFriendlyLocationName } from '../../../../common/utils/geoHelper';
import type { ICreateAttendance } from '../types/attendanceTypes';

type Props = {
  onFinish: (arg: ICreateAttendance) => void;
  form: FormInstance;
  loading: boolean;
  editMode?: boolean;
};

const AttendanceInputs = ({ onFinish, form, loading, editMode }: Props) => {
  const [detecting, setDetecting] = useState(false);
  const [autoLocation, setAutoLocation] = useState<string>('');

  // Automatically capture location on creation
  useEffect(() => {
    if (!editMode && navigator.geolocation) {
      setDetecting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const friendlyName = await getFriendlyLocationName(
            latitude,
            longitude,
          );
          setAutoLocation(friendlyName);
          form.setFieldsValue({
            location: friendlyName,
            latitude,
            longitude,
          });
          setDetecting(false);
        },
        () => {
          setDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    }
  }, [editMode, form]);

  const existingLocation = form.getFieldValue('location');

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{ status: 'PRESENT', date: dayjs() }}
    >
      <Row gutter={[8, 8]}>
        <SelectEmployee name='employee_id' label='Employee' required />

        <FormInputDate name='date' label='Date' required />

        <FormInputSelect
          name='status'
          label='Status'
          required
          options={[
            { label: 'PRESENT', value: 'PRESENT' },
            { label: 'ABSENT', value: 'ABSENT' },
            { label: 'HALF DAY', value: 'HALF_DAY' },
            { label: 'LEAVE', value: 'LEAVE' },
          ]}
        />
        <FormInputDate name='check_in' label='Check In Time' picker='time' />
        <FormInputDate name='check_out' label='Check Out Time' picker='time' />

        <FormInputText name='remarks' label='Remarks' />
        {/* Location Display (Auto-captured / Read-only) */}
        <Col xs={24}>
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: 'block',
                marginBottom: 6,
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              Location (Auto-Captured)
            </label>
            {editMode ? (
              <Tag color='blue' style={{ padding: '4px 10px', fontSize: 13 }}>
                <EnvironmentOutlined style={{ marginRight: 6 }} />
                {existingLocation || 'Not recorded at creation'}
              </Tag>
            ) : detecting ? (
              <Alert
                type='info'
                showIcon={false}
                message={
                  <span>
                    <LoadingOutlined style={{ marginRight: 6 }} />{' '}
                    Auto-detecting current location via GPS...
                  </span>
                }
              />
            ) : autoLocation ? (
              <Tag color='green' style={{ padding: '4px 10px', fontSize: 13 }}>
                <EnvironmentOutlined style={{ marginRight: 6 }} />
                {autoLocation}
              </Tag>
            ) : (
              <Tag
                color='default'
                style={{ padding: '4px 10px', fontSize: 13 }}
              >
                <EnvironmentOutlined style={{ marginRight: 6 }} />
                Automatic GPS enabled
              </Tag>
            )}
          </div>
        </Col>

        <Form.Item name='location' hidden>
          <input type='hidden' />
        </Form.Item>
        <Form.Item name='latitude' hidden>
          <input type='hidden' />
        </Form.Item>
        <Form.Item name='longitude' hidden>
          <input type='hidden' />
        </Form.Item>
      </Row>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: 12,
        }}
      >
        <FromSubmit text={editMode ? 'Update' : 'Create'} loading={loading} />
      </div>
    </Form>
  );
};

export default AttendanceInputs;
