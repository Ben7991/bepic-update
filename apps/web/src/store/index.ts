import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slice/auth/auth.slice';
import incentiveReducer from './slice/incentives/incentive.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incentive: incentiveReducer,
  },
});
