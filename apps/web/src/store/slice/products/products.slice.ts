import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../pages/dashboard/products/Products.types';

type ProductState = {
  status: 'pending' | 'fullfilled' | 'error';
  errorMessage?: string;
  count: number;
  data: Array<Product>;
};

const initialState: ProductState = {
  status: 'pending',
  errorMessage: undefined,
  count: 0,
  data: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    loadProducts: (
      state: ProductState,
      action: PayloadAction<Omit<ProductState, 'errorMessage'>>,
    ): void => {
      state.count = action.payload.count;
      state.data = action.payload.data;
      state.status = action.payload.status;
    },
    addProduct: (state: ProductState, action: PayloadAction<Product>): void => {
      state.count++;
      state.data = [
        action.payload,
        ...(state.data.length > 10 ? state.data.slice(0, 9) : state.data),
      ];
    },
    updateProduct: (
      state: ProductState,
      action: PayloadAction<Product>,
    ): void => {
      const preferredProductIndex = state.data.findIndex(
        (item) => item.id === action.payload.id,
      );
      state.data[preferredProductIndex] = action.payload;
    },
    setProductError: (
      state: ProductState,
      action: PayloadAction<Required<Pick<ProductState, 'errorMessage'>>>,
    ): void => {
      state.errorMessage = action.payload.errorMessage;
      state.status = 'error';
    },
  },
});

export const { loadProducts, addProduct, updateProduct, setProductError } =
  productSlice.actions;
export default productSlice.reducer;
