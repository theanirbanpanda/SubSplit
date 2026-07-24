import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi, loginApi, logoutApi } from './api/authApi';

// Async Thunks for API integration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      if (response?.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
      return response;
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.errors && typeof data.errors === 'object') {
          errorMessage = Object.values(data.errors).join(', ');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      if (response?.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
      return response;
    } catch (err) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
    } catch (err) {
      // Ignore network/API errors on logout and still clean up local auth state
    } finally {
      dispatch(logout());
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || null;
        state.token = action.payload?.data?.accessToken || null;
        state.isAuthenticated = !!action.payload?.data?.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || null;
        state.token = action.payload?.data?.accessToken || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
