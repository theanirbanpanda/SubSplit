import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchMySubscriptionsApi,
  fetchSubscriptionCredentialsApi,
  cancelSubscriptionApi,
  toggleAutoRenewApi,
  fetchSubscriptionSummaryApi,
} from './api/subscriptionsApi';

export const fetchMySubscriptions = createAsyncThunk(
  'subscriptions/fetchMySubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMySubscriptionsApi();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

export const fetchSubscriptionSummary = createAsyncThunk(
  'subscriptions/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSubscriptionSummaryApi();
      return response.data || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription summary');
    }
  }
);

export const fetchSubscriptionCredentials = createAsyncThunk(
  'subscriptions/fetchCredentials',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchSubscriptionCredentialsApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credentials');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancelSubscription',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cancelSubscriptionApi(id);
      return { id, updated: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

export const toggleAutoRenew = createAsyncThunk(
  'subscriptions/toggleAutoRenew',
  async ({ id, autoRenew }, { rejectWithValue }) => {
    try {
      const response = await toggleAutoRenewApi(id, autoRenew);
      return { id, autoRenew: response.data?.autoRenew ?? autoRenew };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update auto-renew');
    }
  }
);

const initialState = {
  subscriptions: [],
  summaryStats: null,
  activeCredentials: null,
  loading: false,
  credentialsLoading: false,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearActiveCredentials: (state) => {
      state.activeCredentials = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMySubscriptions
      .addCase(fetchMySubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchMySubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchSubscriptionSummary
      .addCase(fetchSubscriptionSummary.fulfilled, (state, action) => {
        state.summaryStats = action.payload;
      })
      // fetchSubscriptionCredentials
      .addCase(fetchSubscriptionCredentials.pending, (state) => {
        state.credentialsLoading = true;
      })
      .addCase(fetchSubscriptionCredentials.fulfilled, (state, action) => {
        state.credentialsLoading = false;
        state.activeCredentials = action.payload;
      })
      .addCase(fetchSubscriptionCredentials.rejected, (state) => {
        state.credentialsLoading = false;
      })
      // cancelSubscription
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(s => String(s.id) === String(action.payload.id));
        if (index !== -1) {
          state.subscriptions[index].statusDisplay = 'Cancelled';
          state.subscriptions[index].autoRenew = false;
        }
      })
      // toggleAutoRenew
      .addCase(toggleAutoRenew.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(s => String(s.id) === String(action.payload.id));
        if (index !== -1) {
          state.subscriptions[index].autoRenew = action.payload.autoRenew;
        }
      });
  },
});

export const { clearActiveCredentials } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
