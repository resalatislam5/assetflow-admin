import { Icon } from '@iconify/react';
import { Badge, Select, Space, Tag } from 'antd';
import { useMemo } from 'react';
import { api } from '../../app/api/api';
import { setLocationScope } from '../../app/features/locationSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { useGetNavbarLocationsQuery } from '../api/locationEndpoint';

const NavbarLocationSelector = () => {
  const dispatch = useAppDispatch();
  const { currentScope, selectedBranchId, selectedWarehouseId } =
    useAppSelector((state) => state.location);
  const { user } = useAppSelector((state) => state.auth);
  const { data: locations, isLoading } = useGetNavbarLocationsQuery();

  const isSuperAdminOrAll =
    user?.data_scope === 'ALL' ||
    user?.is_super_admin ||
    locations?.can_select_all;

  const activeValue = useMemo(() => {
    if (currentScope === 'BRANCH' && selectedBranchId) {
      return `BRANCH_${selectedBranchId}`;
    }
    if (currentScope === 'WAREHOUSE' && selectedWarehouseId) {
      return `WAREHOUSE_${selectedWarehouseId}`;
    }
    return 'ALL';
  }, [currentScope, selectedBranchId, selectedWarehouseId]);

  const handleChange = (value: string) => {
    if (value === 'ALL') {
      dispatch(
        setLocationScope({
          scope: 'ALL',
          branchId: null,
          warehouseId: null,
          locationName: 'All Locations (Global)',
        }),
      );
    } else if (value.startsWith('BRANCH_')) {
      const branchId = Number(value.replace('BRANCH_', ''));
      const branch = locations?.branches?.find((b) => b.id === branchId);
      dispatch(
        setLocationScope({
          scope: 'BRANCH',
          branchId,
          warehouseId: null,
          locationName: branch ? `Branch: ${branch.name}` : `Branch #${branchId}`,
        }),
      );
    } else if (value.startsWith('WAREHOUSE_')) {
      const warehouseId = Number(value.replace('WAREHOUSE_', ''));
      const warehouse = locations?.warehouses?.find((w) => w.id === warehouseId);
      dispatch(
        setLocationScope({
          scope: 'WAREHOUSE',
          branchId: null,
          warehouseId,
          locationName: warehouse ? `Warehouse: ${warehouse.name}` : `Warehouse #${warehouseId}`,
        }),
      );
    }

    dispatch(api.util.invalidateTags(['STOCK', 'INVENTORY', 'PRODUCT', 'ORDER', 'PURCHASE', 'ACCOUNT', 'EXPENSE', 'CUSTOMER']));
  };

  if (!isSuperAdminOrAll) {
    if (user?.data_scope === 'WAREHOUSE') {
      return (
        <Tag
          color='cyan'
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Icon icon='solar:box-minimalistic-bold-duotone' style={{ fontSize: 16 }} />
          <span>Warehouse: {user.warehouse_name || `WH #${user.warehouse_id}`}</span>
        </Tag>
      );
    }

    return (
      <Tag
        color='emerald'
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          color: '#10B981',
          borderColor: '#A7F3D0',
          backgroundColor: '#ECFDF5',
        }}
      >
        <Icon icon='solar:buildings-bold-duotone' style={{ fontSize: 16 }} />
        <span>Branch: {user?.branch_name || `Branch #${user?.branch_id}`}</span>
      </Tag>
    );
  }

  const options = [
    {
      value: 'ALL',
      label: (
        <Space size={6}>
          <Icon icon='solar:global-bold-duotone' style={{ color: '#10B981', fontSize: 16 }} />
          <span style={{ fontWeight: 600 }}>All Locations (Global)</span>
        </Space>
      ),
    },
    ...(locations?.branches && locations.branches.length > 0
      ? [
          {
            label: <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>BRANCHES</span>,
            options: locations.branches.map((b) => ({
              value: `BRANCH_${b.id}`,
              label: (
                <Space size={6}>
                  <Icon icon='solar:buildings-bold-duotone' style={{ color: '#059669', fontSize: 15 }} />
                  <span>{b.name}</span>
                  {b.is_main_branch && <Badge count='HQ' style={{ backgroundColor: '#10B981', fontSize: 10 }} />}
                </Space>
              ),
            })),
          },
        ]
      : []),
    ...(locations?.warehouses && locations.warehouses.length > 0
      ? [
          {
            label: <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>WAREHOUSES</span>,
            options: locations.warehouses.map((w) => ({
              value: `WAREHOUSE_${w.id}`,
              label: (
                <Space size={6}>
                  <Icon icon='solar:box-minimalistic-bold-duotone' style={{ color: '#0284C7', fontSize: 15 }} />
                  <span>{w.name}</span>
                </Space>
              ),
            })),
          },
        ]
      : []),
  ];

  return (
    <Select
      value={activeValue}
      onChange={handleChange}
      loading={isLoading}
      options={options}
      style={{ minWidth: 230 }}
      popupMatchSelectWidth={260}
      dropdownStyle={{ borderRadius: 10 }}
    />
  );
};

export default NavbarLocationSelector;
