import {
  FileImageOutlined,
  FilePdfOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Image, type ImageProps } from 'antd';
import { openModal } from '../../app/features/modalSlice';
import { useAppDispatch } from '../../app/hooks/hooks';
import { imageUrl } from '../utils/quarry';

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

const isPdf = (url: string) => {
  return url?.toLowerCase().endsWith('.pdf');
};

const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
};

export const ImagePreview = ({
  src,
  alt = 'file',
  width = 30,
  height = 30,
}: Props) => {
  const fullUrl = imageUrl + src;
  const dispatch = useAppDispatch();

  // PDF
  if (isPdf(src)) {
    return (
      <>
        <div
          onClick={() =>
            dispatch(
              openModal({
                open: true,
                content: (
                  <iframe
                    title='pdf'
                    src={fullUrl}
                    style={{
                      width: '100%',
                      minHeight: '80vh',
                      border: 'none',
                    }}
                  />
                ),
                title: src,
                width: 1000,
              }),
            )
          }
          style={{
            width,
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #eee',
            borderRadius: 8,
            cursor: 'pointer',
            background: '#fafafa',
          }}
        >
          <FilePdfOutlined style={{ fontSize: 28, color: 'red' }} />
        </div>
      </>
    );
  }

  // Image
  if (isImage(src)) {
    return (
      <Image
        src={fullUrl}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit: 'cover', borderRadius: 8 }}
      />
    );
  }

  // fallback
  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #ccc',
        borderRadius: 8,
      }}
    >
      <FileImageOutlined style={{ fontSize: 24 }} />
    </div>
  );
};

export const CustomImage = ({
  src,
  alt,

  ...rest
}: {
  src: string | undefined | null;
  alt?: string;
  width?: number;
  height?: number;
} & ImageProps) => {
  if (!src) return <UserOutlined />;
  const fullUrl = imageUrl + src;
  return <Image src={fullUrl} alt={alt} {...rest} />;
};
