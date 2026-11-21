import { Breadcrumb, type BreadcrumbProps } from 'antd';
import { Link, useLocation } from 'react-router';
import Iconify from '../Table/Iconify';

const DISABLE_PATHS = [
  'administration',
  'configuration',
  'report',
  'catalog',
  'customer',
  'account',
  'payroll',
];

const PATH_NAME_MAP: Record<string, string> = {
  products: 'Product List',
  categories: 'Category List',
  brands: 'Brand List',
  customers: 'Customer List',
  employee: 'Employee List',
  account: 'Account List',
  roles: 'Role List',
  user: 'User List',
  create: 'Create',
  edit: 'Update',
};

const DynamicBreadcrumb = ({ ...rest }: BreadcrumbProps) => {
  const location = useLocation();

  const rawSnippets = location.pathname.split('/').filter(Boolean);
  const pathSnippets = rawSnippets.filter((path) => !Number(path));

  const items = pathSnippets.map((path, index, arr) => {
    const rawIndex = rawSnippets.indexOf(path);
    const url = '/' + rawSnippets.slice(0, rawIndex + 1).join('/');
    const isDisabled = DISABLE_PATHS.includes(path) || index === arr.length - 1;
    const formattedName =
      PATH_NAME_MAP[path] ||
      path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

    return {
      title: isDisabled ? (
        <span style={{ fontWeight: index === arr.length - 1 ? 600 : 400 }}>
          {formattedName}
        </span>
      ) : (
        <Link to={url}>{formattedName}</Link>
      ),
    };
  });

  return (
    <Breadcrumb
      separator='>'
      {...rest}
      items={[
        {
          title: (
            <Link to={'/'} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Iconify icon='solar:home-2-bold-duotone' style={{ fontSize: 14 }} />
              <span>Dashboard</span>
            </Link>
          ),
        },
        ...items,
      ]}
    />
  );
};

export default DynamicBreadcrumb;
