import api from './api';
import { logout } from '../features/auth/authSlice';

export const setupInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token || localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};
