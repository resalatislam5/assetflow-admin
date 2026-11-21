import { Icon } from '@iconify/react';
import type { CSSProperties } from 'react';

interface Props {
  icon: string;
  fontSize?: string | number;
  style?: CSSProperties;
  className?: string;
}

const Iconify = ({ icon, fontSize, style, className, ...rest }: Props) => {
  return (
    <Icon
      icon={icon}
      fontSize={fontSize || '18px'}
      style={style}
      className={className}
      {...rest}
    />
  );
};

export default Iconify;
