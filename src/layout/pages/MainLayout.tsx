import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Icon } from '@iconify/react';
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Layout,
  Space,
  theme,
  Tooltip,
  type MenuProps,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useCallback, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router';
import { toggleTheme } from '../../app/features/themeSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { imageUrl } from '../../common/utils/quarry';
import SideMenu from '../components/SideMenu';
import NavbarLocationSelector from '../components/NavbarLocationSelector';
const { Header } = Layout;

const items: MenuProps['items'] = [
  {
    key: 'profile',
    label: (
      <Link
        to='/profile'
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <UserOutlined style={{ fontSize: 13, color: '#10B981' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#1e1e2e' }}>
          Profile
        </span>
      </Link>
    ),
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    danger: true,
    label: (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        onClick={() => {
          localStorage.removeItem('assetflow_token');
          setTimeout(() => (window.location.href = '/auth/login'), 50);
        }}
      >
        <LogoutOutlined style={{ fontSize: 13 }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>Logout</span>
      </div>
    ),
  },
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(260);

  const [resizing, setResizing] = useState(false);
  const raf = useRef<number | null>(null);

  const startResize = () => {
    setResizing(true);
  };

  const stopResize = () => {
    setResizing(false);
  };

  const resize = (e: React.MouseEvent) => {
    if (!resizing) return;

    if (raf.current) return;

    raf.current = requestAnimationFrame(() => {
      const newWidth = e.clientX;

      if (newWidth >= 180 && newWidth <= 420) {
        setWidth(newWidth);
      }

      raf.current = null;
    });
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);

  const handleCollapse = useCallback((value: boolean) => {
    setCollapsed(value);
  }, []);

  return (
    <Layout
      style={{ minHeight: '100vh', overflow: 'hidden' }}
      onMouseMove={(e) => resize(e)}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
    >
      <SideMenu
        handleCollapse={handleCollapse}
        collapsed={collapsed}
        startResize={startResize}
        width={width}
        style={{
          position: 'relative',
          transition: resizing ? 'none' : 'width 0.12s ease-out',
        }}
      />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : width,
          minHeight: '100vh',
          transition: resizing ? 'none' : 'margin-left 0.12s ease-out',
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <Space size={16} align='center'>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <NavbarLocationSelector />
          </Space>
          <Flex gap={12} align='center' style={{ marginRight: 30 }}>
            <Tooltip title='Theme'>
              <Button
                shape='circle'
                onClick={() => dispatch(toggleTheme())}
                style={{
                  width: 34,
                  height: 34,
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 6px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
                icon={
                  mode === 'light' ? (
                    <Icon
                      style={{ fontSize: 18 }}
                      icon={'material-symbols:dark-mode'}
                    />
                  ) : (
                    <Icon
                      style={{ fontSize: 18 }}
                      icon={'material-symbols:light-mode'}
                    />
                  )
                }
              />
            </Tooltip>

            <Tooltip title='Profile'>
              <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement='bottomRight'
                styles={{ itemContent: { minWidth: 100 } }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    cursor: 'pointer',
                    borderRadius: '50%',
                  }}
                  onMouseEnter={(e) => {
                    const avatar = e.currentTarget.firstChild as HTMLElement;
                    if (avatar) avatar.style.borderColor = '#818cf8';
                  }}
                  onMouseLeave={(e) => {
                    const avatar = e.currentTarget.firstChild as HTMLElement;
                    if (avatar) avatar.style.borderColor = '#c7d2fe';
                  }}
                >
                  <Avatar
                    size={34}
                    src={user?.avatar ? imageUrl + user.avatar : undefined}
                    icon={!user?.avatar ? <UserOutlined /> : undefined}
                    style={{
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      border: '2px solid #c7d2fe',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </span>
              </Dropdown>
            </Tooltip>
          </Flex>
        </Header>
        <Content
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1 }}>
            <Outlet />
          </div>
          <Layout.Footer
            style={{
              textAlign: 'center',
              padding: '12px 24px',
              background: colorBgContainer,
              borderTop: `1px solid ${mode === 'dark' ? '#303030' : '#f0f0f0'}`,
              boxShadow:
                mode === 'dark'
                  ? '0 -1px 4px rgba(0, 0, 0, 0.2)'
                  : '0 -1px 4px rgba(0, 0, 0, 0.02)',
              fontSize: '12.5px',
              color: mode === 'dark' ? '#a1a1aa' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
              transition: 'all 0.3s ease',
            }}
          >
            <span>
              © {new Date().getFullYear()}{' '}
              <strong
                style={{
                  color: mode === 'dark' ? '#e4e4e7' : '#334155',
                }}
              >
                {user?.company_name || 'EMS'}
              </strong>
              . All rights reserved.
            </span>
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
                  color: mode === 'dark' ? '#818cf8' : '#4f46e5',
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
                    color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                  }}
                />
              </a>
            </span>
          </Layout.Footer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
