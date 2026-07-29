import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchNotificationsApi,
  fetchUnreadCountApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
  clearAllNotificationsApi,
} from './api/notificationsApi';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchNotificationsApi();
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUnreadCountApi();
      return response.data?.count || 0;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await markAsReadApi(id);
      return response.data || id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await markAllAsReadApi();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      await deleteNotificationApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete notification');
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notifications/clearAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      await clearAllNotificationsApi();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear notifications');
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter((item) => !item.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const targetId = typeof updatedItem === 'object' ? updatedItem.id : updatedItem;
        state.items = state.items.map((item) =>
          item.id === targetId ? { ...item, isRead: true } : item
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      // Mark all read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({ ...item, isRead: true }));
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const target = state.items.find((item) => item.id === deletedId);
        if (target && !target.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter((item) => item.id !== deletedId);
      })
      // Clear all
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
      });
  },
});

export const { clearNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
