import {
  CloseCircleFilled,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Upload,
  type FormItemProps,
  type InputNumberProps,
  type SelectProps,
  type UploadFile,
  type UploadProps,
} from 'antd';
import type { Rule } from 'antd/es/form';
import type { RcFile } from 'antd/es/upload';
import type { Dayjs } from 'dayjs';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useState, type ChangeEvent } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { datePresets } from '../utils/constant';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../utils/dateFormat';
import { imageUrl } from '../utils/quarry';

type Props = {
  label: string;
  name: string | (string | number)[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal';
  rules?: Rule[];
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  size?: 'small' | 'middle' | 'large';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  allowClear?: boolean;
  readOnly?: boolean;
} & FormItemProps;

export const FormInputEmail = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  allowClear = true,
  ...rest
}: Props) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          { required: required, message: `${label} is required` },
          { type: 'email' },
          ...(rules || []),
        ]}
        {...rest}
      >
        <Input
          type='email'
          autoComplete='email'
          placeholder={placeholder ? placeholder : `Enter Your ${label}`}
          disabled={disabled}
          size={size}
          onChange={onChange}
          allowClear={allowClear}
        />
      </Form.Item>
    </Col>
  );
};

export const FormInputPassword = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  allowClear = true,
  ...rest
}: Props) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          { required: required, message: `${label} is required` },

          ...(rules || []),
        ]}
        {...rest}
      >
        <Input.Password
          type='password'
          autoComplete='password'
          placeholder={placeholder ? placeholder : `Enter Your ${label}`}
          disabled={disabled}
          size={size}
          onChange={onChange}
          allowClear={allowClear}
        />
      </Form.Item>
    </Col>
  );
};

export const FormInputText = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  readOnly,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  value,
  allowClear = true,
  noStyleLabel,
  defaultValue,
  ...rest
}: Props & {
  value?: string | null;
  noStyleLabel?: string;
  defaultValue?: string;
}) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          {
            required: required,
            message: `${noStyleLabel ? noStyleLabel : label} is required`,
          },

          ...(rules || []),
        ]}
        {...rest}
      >
        <Input
          type='text'
          placeholder={placeholder ? placeholder : `Enter Your ${label}`}
          disabled={disabled}
          readOnly={readOnly}
          size={size}
          onChange={onChange}
          value={value || ''}
          allowClear={allowClear}
          defaultValue={defaultValue}
        />
      </Form.Item>
    </Col>
  );
};

export const FormInputDate = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  noStyleLabel,
  // value,
  allowClear = true,
  defaultValue,
  disabledDate,
  picker,
  showTime,
  format,
  ...rest
}: Omit<Props, 'onChange' | 'defaultValue'> & {
  value?: string | null;
  noStyleLabel?: string;
  onChange?: (date: Dayjs | null) => void;
  defaultValue?: Dayjs | null;
  disabledDate?: (current: Dayjs) => boolean;
  picker?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
  showTime?: boolean;
  format?: string;
}) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          {
            required: required,
            message: `${noStyleLabel ? noStyleLabel : label} is required`,
          },

          ...(rules || []),
        ]}
        {...rest}
      >
        <DatePicker
          style={{ width: '100%' }}
          placeholder={placeholder ? placeholder : `Enter Your ${label}`}
          disabled={disabled}
          size={size}
          onChange={onChange}
          // value={value || ''}
          allowClear={allowClear}
          defaultValue={defaultValue}
          disabledDate={disabledDate}
          picker={picker}
          showTime={showTime}
          format={format || (showTime ? DATE_TIME_FORMAT : DATE_FORMAT)}
        />
      </Form.Item>
    </Col>
  );
};
export const FormInputDateRange = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  noStyleLabel,
  // value,
  allowClear = true,
  defaultValue,
  disabledDate,
  showTime,
  format,
  ...rest
}: Omit<Props, 'onChange' | 'defaultValue'> & {
  value?: string | null;
  noStyleLabel?: string;
  onChange?: (date: [Dayjs | null, Dayjs | null] | null) => void;
  defaultValue?: [Dayjs | null, Dayjs | null];
  disabledDate?: (current: Dayjs) => boolean;
  showTime?: boolean;
  format?: string;
}) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          {
            required: required,
            message: `${noStyleLabel ? noStyleLabel : label} is required`,
          },

          ...(rules || []),
        ]}
        {...rest}
      >
        <DatePicker.RangePicker
          style={{ width: '100%' }}
          disabled={disabled}
          size={size}
          onChange={onChange}
          // value={value || ''}
          allowClear={allowClear}
          defaultValue={defaultValue}
          presets={datePresets}
          disabledDate={disabledDate}
          showTime={showTime}
          format={format || (showTime ? DATE_TIME_FORMAT : DATE_FORMAT)}
        />
      </Form.Item>
    </Col>
  );
};

export const FormInputNumber = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  value,
  readOnly,
  noStyleLabel,
  step,
  max,
  min,
  precision,
  ...rest
}: Omit<Props, 'onChange'> & {
  value?: string | number | null;
  noStyleLabel?: string;
  step?: number;
  max?: number;
  min?: number;
  onChange?: (value: number | string | null) => void;
  precision?: InputNumberProps['precision'];
}) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          {
            required: required,
            message: `${label ? label : noStyleLabel} is required`,
          },

          ...(rules || []),
        ]}
        {...rest}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder={placeholder ? placeholder : `Enter Your ${label}`}
          disabled={disabled}
          size={size}
          onChange={onChange}
          value={value || ''}
          readOnly={readOnly}
          step={step}
          max={max}
          min={min}
          precision={precision}
        />
      </Form.Item>
    </Col>
  );
};

export const FormInputMobile = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  // size = 'middle',
  onChange,
  value,
  allowClear = true,
  ...rest
}: Omit<Props, 'onChange'> & {
  value?: string | null;
  onChange?: (value: string) => void;
}) => {
  const [phone, setPhone] = useState('');
  const form = Form.useFormInstance();
  const phone2 = Form.useWatch(name, form);

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          { required: required, message: `${label} is required` },
          {
            validator: (_, value) => {
              if (!value || value === '880' || value === '+880') {
                if (required) {
                  return Promise.reject(`${label} is required`);
                }
                return Promise.resolve();
              }
              const phoneStr = value.startsWith('+') ? value : `+${value}`;
              if (!isValidPhoneNumber(phoneStr)) {
                return Promise.reject('Invalid phone number');
              }
              return Promise.resolve();
            },
          },

          ...(rules || []),
        ]}
        {...rest}
      >
        <div style={{ position: 'relative' }}>
          <PhoneInput
            placeholder={placeholder ? placeholder : `Enter Your ${label}`}
            disabled={disabled}
            onChange={(value) => {
              setPhone(value);
              onChange?.(value);
            }}
            value={value || phone2 || ''}
            country='bd'
            inputStyle={{
              width: '100%',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              fontSize: '14px',
            }}
            buttonStyle={{
              border: '1px solid #d9d9d9',
              borderRadius: '6px 0 0 6px',
            }}
            containerStyle={{ width: '100%' }}
          />
          {phone && allowClear && (
            <CloseCircleFilled
              onClick={() => setPhone('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                width: '12px',
                height: '12px',
                color: '#c4c2c2ff',
              }}
            />
          )}
        </div>
      </Form.Item>
    </Col>
  );
};

export interface ISelectOption {
  label: React.ReactNode;
  value?: string | number | boolean | null;
  disabled?: boolean;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: ISelectOption[];
}

export type FormInputSelectProps = Props &
  Omit<SelectProps, 'options'> & {
    options?: ISelectOption[];
  };

export const FormInputSelect = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  options,
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  allowClear = true,
  defaultValue,
  ...rest
}: FormInputSelectProps) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          { required, message: `${label} is required` },
          ...(rules || []),
        ]}
        {...rest}
      >
        <Select
          placeholder={placeholder || `Select ${label}`}
          disabled={disabled}
          size={size}
          options={options as SelectProps['options']}
          onChange={onChange}
          allowClear={allowClear}
          style={{ width: '100%' }}
          defaultValue={defaultValue}
        />
      </Form.Item>
    </Col>
  );
};

interface ImageUploadProps {
  label: string;
  name: string;
  required?: boolean;
  option?: { label: string; value: string }[];
  placeholder?: string;
  accept?: string | undefined;
  type?: string;
  setFileList?: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  offPrefixCls?: boolean;
  fileList?: UploadFile[];
  buttonText?: string;
  style?: React.CSSProperties | undefined;
  maxCount?: number | undefined;
  span?: number;
  md?: number;
  lg?: number;
  onRemove?:
    | ((file: UploadFile) => void | boolean | Promise<void | boolean>)
    | undefined;
}

export const FormFileUpload = ({
  label,
  name,
  required,
  fileList,
  setFileList,
  offPrefixCls,
  buttonText,
  accept = 'image/*,application/pdf',
  style,
  maxCount,
  span = 24,
  md = 24,
  lg = 12,
  onRemove,
}: ImageUploadProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewType, setPreviewType] = useState<'image' | 'pdf'>('image');

  const getBase64 = (file: Blob | File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    const isPdf =
      file.type === 'application/pdf' ||
      file.name?.toLowerCase().endsWith('.pdf');

    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }

    const src = file.url
      ? file.url.startsWith('http')
        ? file.url
        : `${imageUrl}${file.url}`
      : file.preview || '';

    setPreviewImage(src);
    setPreviewType(isPdf ? 'pdf' : 'image');
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (setFileList) {
      setFileList(Array.isArray(newFileList) ? newFileList : [newFileList]);
    }
  };

  const handleCancel = () => setPreviewOpen(false);

  const beforeUpload = (file: RcFile) => {
    const acceptTypes = accept.split(',').map((a) => a.trim());

    const allowsImages =
      acceptTypes.includes('image/*') ||
      acceptTypes.some((t) => t.startsWith('image/'));

    const allowsPdf = acceptTypes.includes('application/pdf');

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!allowsImages && isImage) {
      message.error('You can only upload PDF files!');
      return Upload.LIST_IGNORE;
    }

    if (!allowsPdf && isPdf) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }

    if (!isImage && !isPdf) {
      const allowed = [
        allowsImages ? 'Images (JPG, PNG, WebP)' : null,
        allowsPdf ? 'PDF' : null,
      ]
        .filter(Boolean)
        .join(' or ');
      message.error(`You can only upload ${allowed} files!`);
      return Upload.LIST_IGNORE;
    }

    // Validate file size
    const fileSizeMB = file.size / 1024 / 1024;
    const maxSize = isPdf ? 10 : 2;
    if (fileSizeMB >= maxSize) {
      message.error(
        `File must be smaller than ${maxSize}MB! (Current size: ${fileSizeMB.toFixed(2)}MB)`,
      );
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{buttonText || 'Upload File'}</div>
    </button>
  );

  return (
    <Col span={span} md={md} lg={lg}>
      <Form.Item
        label={label}
        name={name}
        rules={[
          { required: required || false, message: `Please input this field` },
        ]}
        valuePropName='fileList'
        getValueFromEvent={(e: { fileList?: UploadFile[] } | UploadFile[]) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
      >
        <Upload
          style={style}
          prefixCls={offPrefixCls ? '' : 'ant-custom-upload'}
          action={() =>
            new Promise((resolve) => {
              resolve('');
            })
          }
          beforeUpload={beforeUpload}
          accept={accept}
          maxCount={maxCount}
          listType='picture-card'
          fileList={fileList || []}
          onPreview={handlePreview}
          onChange={handleChange}
          onRemove={onRemove}
          itemRender={(originNode, file, _, actions) => {
            const isPdf =
              file.type === 'application/pdf' ||
              file.name?.toLowerCase().endsWith('.pdf');

            if (!isPdf) return originNode;

            return (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid #d9d9d9',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafafa',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <FilePdfOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                <div
                  style={{
                    fontSize: 11,
                    marginTop: 6,
                    padding: '0 6px',
                    textAlign: 'center',
                    wordBreak: 'break-all',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    color: '#555',
                  }}
                >
                  {file.name}
                </div>

                {/* Hover overlay with Preview & Delete */}
                <div
                  className='pdf-upload-actions'
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    borderRadius: 8,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.opacity = '1')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.opacity = '0')
                  }
                >
                  <EyeOutlined
                    style={{ color: '#fff', fontSize: 18, cursor: 'pointer' }}
                    onClick={() => actions.preview()}
                  />
                  <DeleteOutlined
                    style={{ color: '#fff', fontSize: 18, cursor: 'pointer' }}
                    onClick={() => actions.remove()}
                  />
                </div>
              </div>
            );
          }}
        >
          {fileList && fileList.length >= (maxCount || 1) ? null : uploadButton}
        </Upload>
      </Form.Item>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        width={previewType === 'pdf' ? '80%' : undefined}
        styles={{
          body: {
            padding: previewType === 'pdf' ? 0 : undefined,
          },
        }}
      >
        {previewType === 'pdf' ? (
          <object
            data={previewImage}
            type='application/pdf'
            style={{ width: '100%', height: '75vh', display: 'block' }}
          >
            <div style={{ textAlign: 'center', padding: 24 }}>
              <FilePdfOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
              <p style={{ marginTop: 12 }}>Unable to preview PDF in browser.</p>
              <a href={previewImage} download={previewTitle}>
                Click here to download
              </a>
            </div>
          </object>
        ) : (
          <img alt='preview' style={{ width: '100%' }} src={previewImage} />
        )}
      </Modal>
    </Col>
  );
};

export const FormInputTextArea = ({
  label,
  name,
  placeholder,
  required,
  disabled,
  layout = 'vertical',
  xs = 24,
  sm = 24,
  md = 24,
  lg = 12,
  xl,
  xxl,
  rules,
  size = 'middle',
  onChange,
  value,
  allowClear = true,
  readOnly,
  rows = 2,
  ...rest
}: Props & {
  value?: string | null;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          { required: required, message: `${label} is required` },
          ...(rules || []),
        ]}
        {...rest}
      >
        <Input.TextArea
          rows={rows}
          placeholder={placeholder ? placeholder : `Enter Your ${label}`}
          disabled={disabled}
          size={size}
          onChange={onChange}
          value={value || ''}
          allowClear={allowClear}
          readOnly={readOnly}
        />
      </Form.Item>
    </Col>
  );
};
