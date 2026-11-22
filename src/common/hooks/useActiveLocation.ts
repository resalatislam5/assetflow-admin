import { useAppSelector } from '../../app/hooks/hooks';

export interface IActiveLocation {
  currentScope: 'ALL' | 'BRANCH' | 'WAREHOUSE';
  selectedBranchId: number | null;
  selectedWarehouseId: number | null;
  locationName: string;
  isAll: boolean;
  isBranch: boolean;
  isWarehouse: boolean;
}

export const useActiveLocation = (): IActiveLocation => {
  const { currentScope, selectedBranchId, selectedWarehouseId, locationName } =
    useAppSelector((state) => state.location);
  const user = useAppSelector((state) => state.auth.user);

  const effectiveScope: 'ALL' | 'BRANCH' | 'WAREHOUSE' =
    user?.data_scope === 'BRANCH'
      ? 'BRANCH'
      : user?.data_scope === 'WAREHOUSE'
        ? 'WAREHOUSE'
        : currentScope;

  const effectiveBranchId =
    user?.data_scope === 'BRANCH'
      ? (user.branch_id ? Number(user.branch_id) : selectedBranchId)
      : selectedBranchId;

  const effectiveWarehouseId =
    user?.data_scope === 'WAREHOUSE'
      ? (user.warehouse_id ? Number(user.warehouse_id) : selectedWarehouseId)
      : selectedWarehouseId;

  return {
    currentScope: effectiveScope,
    selectedBranchId: effectiveBranchId,
    selectedWarehouseId: effectiveWarehouseId,
    locationName,
    isAll: effectiveScope === 'ALL',
    isBranch: effectiveScope === 'BRANCH' && !!effectiveBranchId,
    isWarehouse: effectiveScope === 'WAREHOUSE' && !!effectiveWarehouseId,
  };
};

export default useActiveLocation;
