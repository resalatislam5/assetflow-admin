import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ICheckPermission } from '../../auth/types/authTypes';

type InitialStateType = {
  user?: ICheckPermission;
};

const initialState: InitialStateType = {
  user: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    permissions: [],
    logo: '',
    favicon: '',
    company_name: '',
    domain_name: '',
    support_email: '',
    address: '',
    phone: '',
    phone_2: '',
    enrollment_color: '',
    short_company_name: '',
    seal_stamp: '',
    signature: '',
  },
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<InitialStateType>) => {
      state.user = action.payload.user;
    },

    logOut: (state) => {
      state.user = initialState.user;
      localStorage.removeItem('assetflow_token');
    },
  },
});

export const { addUser, logOut } = authSlice.actions;
export default authSlice.reducer;
