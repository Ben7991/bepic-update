import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Incentive } from '../../../pages/dashboard/incentives/Incentive.types';

type IncentiveState = {
  status: 'pending' | 'fullfilled' | 'error';
  errorMessage?: string;
  count: number;
  data: Array<Incentive>;
};

const initialState: IncentiveState = {
  status: 'pending',
  errorMessage: undefined,
  count: 0,
  data: [],
};

const incentiveSlice = createSlice({
  name: 'incentive',
  initialState,
  reducers: {
    loadIncentives: (
      state: IncentiveState,
      action: PayloadAction<Omit<IncentiveState, 'errorMessage'>>,
    ): void => {
      state.count = action.payload.count;
      state.data = action.payload.data;
      state.status = action.payload.status;
    },
    addIncentive: (
      state: IncentiveState,
      action: PayloadAction<Incentive>,
    ): void => {
      state.count++;
      state.data = [
        action.payload,
        ...(state.data.length > 10 ? state.data.slice(0, 9) : state.data),
      ];
    },
    updateIncentive: (
      state: IncentiveState,
      action: PayloadAction<Incentive>,
    ): void => {
      const preferredIncentiveIndex = state.data.findIndex(
        (item) => item.id === action.payload.id,
      );
      state.data[preferredIncentiveIndex] = action.payload;
    },
    removeIncentive: (
      state: IncentiveState,
      action: PayloadAction<number>,
    ): void => {
      const preferredIncentiveIndex = state.data.findIndex(
        (item) => item.id === action.payload,
      );
      const deleteCount = 1;
      state.data.splice(preferredIncentiveIndex, deleteCount);
    },
    setIncentiveError: (
      state: IncentiveState,
      action: PayloadAction<Required<Pick<IncentiveState, 'errorMessage'>>>,
    ): void => {
      state.errorMessage = action.payload.errorMessage;
      state.status = 'error';
    },
  },
});

export const {
  loadIncentives,
  addIncentive,
  updateIncentive,
  removeIncentive,
  setIncentiveError,
} = incentiveSlice.actions;
export default incentiveSlice.reducer;
