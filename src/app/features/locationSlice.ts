import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LocationState {
  currentScope: 'ALL' | 'BRANCH' | 'WAREHOUSE';
  selectedBranchId: number | null;
  selectedWarehouseId: number | null;
  locationName: string;
}

const initialState: LocationState = {
  currentScope: (localStorage.getItem('assetflow_scope') as 'ALL' | 'BRANCH' | 'WAREHOUSE') || 'ALL',
  selectedBranchId: localStorage.getItem('assetflow_branch_id')
    ? Number(localStorage.getItem('assetflow_branch_id'))
    : null,
  selectedWarehouseId: localStorage.getItem('assetflow_warehouse_id')
    ? Number(localStorage.getItem('assetflow_warehouse_id'))
    : null,
  locationName: localStorage.getItem('assetflow_location_name') || 'All Locations (Global)',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocationScope: (
      state,
      action: PayloadAction<{
        scope: 'ALL' | 'BRANCH' | 'WAREHOUSE';
        branchId?: number | null;
        warehouseId?: number | null;
        locationName?: string;
      }>,
    ) => {
      state.currentScope = action.payload.scope;
      state.selectedBranchId = action.payload.branchId ?? null;
      state.selectedWarehouseId = action.payload.warehouseId ?? null;
      state.locationName = action.payload.locationName || (
        action.payload.scope === 'ALL'
          ? 'All Locations (Global)'
          : action.payload.scope === 'BRANCH'
            ? `Branch #${action.payload.branchId}`
            : `Warehouse #${action.payload.warehouseId}`
      );

      localStorage.setItem('assetflow_scope', state.currentScope);
      if (state.selectedBranchId !== null) {
        localStorage.setItem('assetflow_branch_id', String(state.selectedBranchId));
      } else {
        localStorage.removeItem('assetflow_branch_id');
      }

      if (state.selectedWarehouseId !== null) {
        localStorage.setItem('assetflow_warehouse_id', String(state.selectedWarehouseId));
      } else {
        localStorage.removeItem('assetflow_warehouse_id');
      }

      localStorage.setItem('assetflow_location_name', state.locationName);
    },
    resetLocation: (state) => {
      state.currentScope = 'ALL';
      state.selectedBranchId = null;
      state.selectedWarehouseId = null;
      state.locationName = 'All Locations (Global)';
      localStorage.removeItem('assetflow_scope');
      localStorage.removeItem('assetflow_branch_id');
      localStorage.removeItem('assetflow_warehouse_id');
      localStorage.removeItem('assetflow_location_name');
    },
  },
});

export const { setLocationScope, resetLocation } = locationSlice.actions;
export default locationSlice.reducer;
