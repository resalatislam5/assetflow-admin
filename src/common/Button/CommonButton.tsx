import { Button, type ButtonProps } from 'antd';
import Iconify from '../Table/Iconify';

interface Props extends ButtonProps {
  text?: string;
  type?: ButtonProps['type'];
  icon?: string;
  size?: ButtonProps['size'];
}
const CommonButton = ({ icon, text, type, size, ...rest }: Props) => {
  return (
    <Button
      icon={<Iconify icon={icon || ''} />}
      {...rest}
      type={type ? type : 'primary'}
      size={size}
    >
      {text}
    </Button>
  );
};

export default CommonButton;
