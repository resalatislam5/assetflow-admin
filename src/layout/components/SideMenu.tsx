import { Icon } from '@iconify/react';
import {
  Divider,
  Input,
  Layout,
  Menu,
  Skeleton,
  theme,
  type MenuProps,
} from 'antd';
import type { SliderProps } from 'antd/es/slider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { addUser } from '../../app/features/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { useCheckPermissionQuery } from '../../auth/api/authEndpoint';
import Iconify from '../../common/Table/Iconify';
import { useBreakpoint } from '../../common/utils/constant';
import type { INavItem } from '../types/layoutTypes';
import { navItems } from '../utils/navItems';
import HeaderTime from './HeaderTime';
import { imageUrl } from '../../common/utils/quarry';

interface IMenuEntry {
  key?: React.Key;
  children?: IMenuEntry[];
}

interface Props extends SliderProps {
  handleCollapse: (value: boolean) => void;
  collapsed: boolean;
  startResize: () => void;
  width?: string | number;
  style?: React.CSSProperties;
}

function normalizePath(path: string): string {
  if (path === '/') return '/';
  const cleanPath = path.replace(/\/+$/, '');

  const allNavKeys: string[] = [];
  for (const item of navItems) {
    if (item.children) {
      for (const child of item.children) {
        if (child.key) allNavKeys.push(String(child.key));
        else if (child.to) allNavKeys.push(String(child.to));
      }
    } else {
      if (item.key) allNavKeys.push(String(item.key));
      else if (item.to) allNavKeys.push(String(item.to));
    }
  }

  if (allNavKeys.includes(cleanPath)) {
    return cleanPath;
  }

  const matched = allNavKeys
    .filter((key) => key !== '/' && (cleanPath === key || cleanPath.startsWith(key + '/')))
    .sort((a, b) => b.length - a.length)[0];

  if (matched) {
    return matched;
  }

  const pathSplit = cleanPath.split('/');
  const catchLastPathElement = pathSplit.pop();
  if (Number(catchLastPathElement)) {
    return pathSplit.join('/');
  }

  return cleanPath;
}

const { Sider } = Layout;

const SideMenu = ({
  handleCollapse,
  collapsed,
  startResize,
  width,
  style,
}: Props) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation();
  const screens = useBreakpoint();

  const onOpenChange = useCallback((keys: string[]) => setOpenKeys(keys), []);
  const { data, isLoading } = useCheckPermissionQuery();

  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.data?.permissions) {
      dispatch(addUser({ user: data?.data }));
    }
  }, [data, dispatch]);

  const menuItems = useMemo(() => {
    if (!data?.data?.permissions) return [];

    const searchStr = searchTerm.toLowerCase();

    const highlightMatch = (text: string) => {
      if (!searchStr) return text;
      const idx = text.toLowerCase().indexOf(searchStr);
      if (idx > -1) {
        return (
          <span>
            {text.substring(0, idx)}
            <span
              style={{
                backgroundColor: '#ffc069',
                padding: '0 2px',
                borderRadius: '4px',
              }}
            >
              {text.substring(idx, idx + searchStr.length)}
            </span>
            {text.substring(idx + searchStr.length)}
          </span>
        );
      }
      return text;
    };

    return navItems
      .map((item) => {
        if (item.children) {
          const children = item.children.filter((child) => {
            const hasPermission = data?.data?.permissions.some(
              (p) => p.name === child.name,
            );
            const matchesSearch = child.label.toLowerCase().includes(searchStr);
            return hasPermission && matchesSearch;
          });

          const parentMatches = item.label.toLowerCase().includes(searchStr);

          if (children.length) {
            return { ...item, children };
          }

          if (parentMatches) {
            const permittedChildren = item.children.filter((child) =>
              data?.data?.permissions.some((p) => p.name === child.name),
            );
            if (permittedChildren.length)
              return { ...item, children: permittedChildren };
          }
          return null;
        }

        const hasPermission = data?.data?.permissions.some(
          (p) => p.name === item.name,
        );
        const matchesSearch = item.label.toLowerCase().includes(searchStr);

        return hasPermission && matchesSearch ? item : null;
      })
      .filter((item): item is INavItem => item !== null)
      .map((item) => {
        return {
          key: item.key,
          label: item.children ? (
            <p style={{ margin: 0 }}>{highlightMatch(item.label)}</p>
          ) : (
            <Link to={item.to}>{highlightMatch(item.label)}</Link>
          ),
          icon: <Icon icon={item.icon} />,
          children: item.children
            ? item.children.map((child) => ({
                key: child.key,
                label: <Link to={child.to}>{highlightMatch(child.label)}</Link>,
                icon: <Icon icon={child.icon} />,
              }))
            : undefined,
        };
      });
  }, [data?.data, dispatch, searchTerm]);

  useEffect(() => {
    if (!menuItems.length) return;

    if (searchTerm) {
      const parentKeys = (menuItems as IMenuEntry[])
        .filter((item) => item.children && item.children.length > 0)
        .map((item) => String(item.key));
      setOpenKeys(parentKeys);
    } else {
      const findParentKeys = (items: IMenuEntry[], path: string): string[] => {
        for (const item of items) {
          if (item.children) {
            const matchedChild = item.children.find((child) =>
              path.startsWith(String(child.key)),
            );

            if (matchedChild) {
              return [String(item.key)];
            }
          }
        }
        return [];
      };

      const keys = findParentKeys(menuItems as IMenuEntry[], normalizePath(location.pathname));
      setOpenKeys(keys);
    }
  }, [location.pathname, menuItems, searchTerm]);

  useEffect(() => {
    if (!screens.md) {
      handleCollapse(true);
    } else {
      handleCollapse(false);
    }
  }, [screens, handleCollapse]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const skeletonItems = Array.from({ length: 6 }).map((_, i) => ({
    key: `skeleton-${i}`,
    label: (
      <div style={{ width: '100%' }}>
        <Skeleton.Input
          active
          size='small'
          block
          style={{
            height: 16,
            borderRadius: 4,
          }}
        />
      </div>
    ),
    disabled: true,
  }));

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={width}
      style={{
        ...style,
        background: colorBgContainer,
        position: 'fixed',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <div
        onMouseDown={startResize}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: 5,
          cursor: 'col-resize',
        }}
      />
      <div
        style={{
          margin: '14px 0 0 0',
          textAlign: 'center',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {collapsed ? (
          <Link to='/' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={user?.favicon ? imageUrl + user.favicon : '/logo-icon.png'}
              style={{ width: 34, height: 34, objectFit: 'contain' }}
              alt='AssetFlow Icon'
            />
          </Link>
        ) : (
          <div style={{ padding: '4px 12px 6px' }}>
            <Link to='/' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
              <img
                src={user?.logo ? imageUrl + user.logo : '/logo-horizontal.png'}
                alt='AssetFlow'
                style={{ maxHeight: 36, width: 'auto', maxWidth: '90%', objectFit: 'contain' }}
              />
            </Link>
            <HeaderTime />
          </div>
        )}
        <Divider style={{ margin: '6px 0 0 0' }} />
        {!collapsed && (
          <div
            style={{
              padding: '8px 12px 10px 12px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <Input
              placeholder='Search...'
              allowClear
              prefix={
                <span style={{ color: '#bfbfbf', display: 'flex', alignItems: 'center' }}>
                  <Iconify icon='material-symbols:search' />
                </span>
              }
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
      <Menu
        mode='inline'
        selectedKeys={[normalizePath(location.pathname)]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={(() => {
          if (isLoading) return skeletonItems;

          const searchStr = searchTerm.toLowerCase();
          const finalItems: NonNullable<MenuProps['items']> = [...menuItems];

          if (finalItems.length === 0 && searchStr) {
            finalItems.push({
              key: 'not-found',
              label: 'No matches found',
              disabled: true,
              style: { textAlign: 'center', color: '#999', cursor: 'default' },
            });
          }

          return finalItems;
        })()}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default SideMenu;
