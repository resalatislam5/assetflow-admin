import { Flex, Image, QRCode, Typography } from 'antd';
import { useAppSelector } from '../../app/hooks/hooks';
import { imageUrl } from '../utils/quarry';

type PrintHeaderProps = {
  logo?: string;
};

const PrintHeader = ({ logo }: PrintHeaderProps = {}) => {
  const { user } = useAppSelector((state) => state.auth);
  const rawLogo = logo || user?.logo;
  const logoSrc = rawLogo
    ? rawLogo.startsWith('http')
      ? rawLogo
      : `${imageUrl}${rawLogo}`
    : undefined;

  return (
    <div>
      <Flex justify='space-between' align='center'>
        {logoSrc ? (
          <Image src={logoSrc} height={100} preview={false} />
        ) : (
          <div style={{ height: 100 }} />
        )}
        <Flex align='center'>
          <QRCode
            type='canvas'
            value={user?.domain_name || user?.company_name || ''}
            style={{ width: 105, height: 95, border: 'none' }}
          />
          <Flex vertical style={{ maxWidth: 200 }}>
            <Typography.Text>{user?.address}</Typography.Text>
            <Typography.Text>{user?.phone || user?.phone_2}</Typography.Text>
            <Typography.Text>{user?.support_email}</Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default PrintHeader;
