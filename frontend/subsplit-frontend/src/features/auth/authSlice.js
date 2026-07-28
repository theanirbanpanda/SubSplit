import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi, loginApi, logoutApi, getCurrentUserApi, uploadProfileImageApi, updateUserProfileApi } from './api/authApi';
import { isTokenValid } from '../../utils/tokenUtils';

// Async Thunks for API integration
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserApi();
      return response;
    } catch (err) {
      let errorMessage = 'Failed to fetch user profile.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'auth/uploadProfilePicture',
  async (fileOrDataUrl, { rejectWithValue }) => {
    try {
      const response = await uploadProfileImageApi(fileOrDataUrl);
      return response;
    } catch (err) {
      let errorMessage = 'Failed to upload profile picture.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfileApi(profileData);
      return response;
    } catch (err) {
      let errorMessage = 'Failed to update profile.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      if (response?.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        dispatch(fetchCurrentUser());
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
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      if (response?.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        dispatch(fetchCurrentUser());
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

const rawToken = localStorage.getItem('token');
const validToken = isTokenValid(rawToken) ? rawToken : null;
if (rawToken && !validToken) {
  localStorage.removeItem('token');
}

const initialState = {
  user: null,
  token: validToken,
  isAuthenticated: !!validToken,
  isInitialized: !validToken,
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
      state.isInitialized = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || null;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = action.payload;
        localStorage.removeItem('token');
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.data?.accessToken || null;
        state.isAuthenticated = !!action.payload?.data?.accessToken;
        state.isInitialized = true;
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
        state.token = action.payload?.data?.accessToken || null;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        const userObj = action.payload?.data || action.payload;
        if (state.user && userObj) {
          state.user = {
            ...state.user,
            ...(typeof userObj === 'object' ? userObj : {}),
          };
        }
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Profile Details
      .addCase(updateUserProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const userObj = action.payload?.data || action.payload;
        if (state.user && userObj) {
          state.user = {
            ...state.user,
            ...(typeof userObj === 'object' ? userObj : {}),
          };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
