import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthState } from './auth.type';
import type { User } from '../../../lib/utils/types.utils';

const initialState: AuthState = {
  user: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (
      state: AuthState,
      action: PayloadAction<Required<AuthState>>,
    ) => {
      state.user = action.payload.user;
    },
    removeAuthUser: (state: AuthState) => {
      state.user = undefined;
    },
    changeImagePath: (
      state: AuthState,
      action: PayloadAction<Required<Pick<User, 'imagePath'>>>,
    ) => {
      state.user = {
        ...state.user as User,
        imagePath: action.payload.imagePath,
      };
    },
  },
});

export const { setAuthUser, removeAuthUser, changeImagePath } = authSlice.actions;
export default authSlice.reducer;
