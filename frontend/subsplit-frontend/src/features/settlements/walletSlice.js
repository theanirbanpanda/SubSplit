import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMyWalletApi, addMoneyToWalletApi } from './api/walletApi';

export const fetchMyWallet = createAsyncThunk(
  'wallet/fetchMyWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMyWalletApi();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallet details');
    }
  }
);

export const addMoneyToWallet = createAsyncThunk(
  'wallet/addMoneyToWallet',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await addMoneyToWalletApi(amount);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add money to wallet');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchMyWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMoneyToWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
      });
  },
});

export default walletSlice.reducer;
