import { Col, ConfigProvider, Image, Row, theme } from 'antd';
import { Outlet } from 'react-router';
import { auth_3 } from '../../common/ui/image';
import { useBreakpoint } from '../../common/utils/constant';
import { Icon } from '@iconify/react';

const AuthLayout = () => {
  const { lg, md, sm } = useBreakpoint();
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#10B981',
          colorPrimaryHover: '#059669',
          colorPrimaryActive: '#047857',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 45%, #FED7AA 100%)',
          padding: '20px',
        }}
      >
        <Row
          style={{
            height: '600px',
            backgroundColor: '#fff',
            maxWidth: '1100px',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '28px',
            borderRadius: '24px',
            boxShadow:
              '0 20px 40px -15px rgba(255, 107, 0, 0.15), 0 0 25px rgba(0, 0, 0, 0.04)',
            position: 'relative',
          }}
          gutter={[lg ? 100 : sm ? 40 : 20, 0]}
        >
          <Col md={12} xs={24}>
            <Outlet />
          </Col>
          <Col
            md={12}
            hidden={!md}
            style={{
              height: '100%',
              width: '100%',
              paddingInline: '0px !important',
              paddingLeft: 30,
            }}
          >
            <div style={{ width: 'inherit', height: '100%' }}>
              <Image
                src={auth_3}
                alt='AssetFlow'
                style={{
                  objectFit: 'cover',
                  height: '544px',
                  borderRadius: '18px',
                  width: '100%',
                }}
                preview={false}
              />
            </div>
          </Col>
        </Row>
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: '#172554',
            fontSize: 13,
          }}
        >
          {/* © 2026{' '}
          <strong style={{ color: '#10B981', fontWeight: 600 }}>
            AssetFlow
          </strong>
          . All Rights Reserved. */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Developed & Maintained by
            <a
              href='https://rsartech.com'
              target='_blank'
              rel='noopener noreferrer'
              style={{
                fontWeight: 700,
                letterSpacing: '0.4px',
                // color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                color: '#10B981',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              RSARTECH
              <Icon
                icon='solar:arrow-right-up-linear'
                style={{
                  fontSize: 13,
                  // color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                  color: '#10B981',
                }}
              />
            </a>
          </span>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AuthLayout;
