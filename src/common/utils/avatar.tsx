import { Image, type ImageProps } from 'antd';
import { imageUrl } from './quarry';

interface Props extends ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}
export const AvatarImg = ({ src, alt, height, width, ...rest }: Props) => {
  const fullUrl = src
    ? src.startsWith('http')
      ? src
      : `${imageUrl}${src}`
    : '';

  return (
    <Image
      src={fullUrl}
      alt={alt}
      width={width || 30}
      height={height || 30}
      {...rest}
    />
  );
};
