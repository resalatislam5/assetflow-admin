import { Button, Flex, theme, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import Iconify from '../../common/Table/Iconify';
import DynamicBreadcrumb from '../../common/ui/DynamicBreadcrumb';

interface Props {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
}

const SingleContainer = ({ children, title, showBackButton = true }: Props) => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div style={{ padding: '20px 24px 24px 24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Flex align='center' gap={8} style={{ marginBottom: 6 }}>
          {showBackButton && (
            <Button
              type='text'
              size='small'
              icon={<Iconify icon='ic:round-arrow-back' style={{ fontSize: 16 }} />}
              onClick={() => navigate(-1)}
              style={{ padding: 0, height: 'auto', minWidth: 20 }}
            />
          )}
          <DynamicBreadcrumb />
        </Flex>

        <Typography.Title
          level={2}
          style={{
            margin: '4px 0 14px 0',
            fontWeight: 700,
            fontSize: 24,
            color: '#1f2937',
          }}
        >
          {title}
        </Typography.Title>

        {showBackButton && (
          <div>
            <Button
              type='primary'
              onClick={() => navigate(-1)}
              style={{
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 4,
                padding: '0 16px',
                height: 32,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
              }}
            >
              <Iconify icon='material-symbols:undo-rounded' style={{ fontSize: 16 }} />
              PREVIOUS PAGE
            </Button>
          </div>
        )}
      </div>

      <Content
        style={{
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div>{children}</div>
      </Content>
    </div>
  );
};

export default SingleContainer;
