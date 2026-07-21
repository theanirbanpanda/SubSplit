import api from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

export const loginApi = async (credentials) => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

export const logoutApi = async () => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return { message: 'Logged out locally' };
    }
    throw err;
  }
};

export const registerApi = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      await api.post(API_ENDPOINTS.USERS.BASE, userData);
      const loginResponse = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: userData.email,
        password: userData.password,
      });
      return loginResponse.data;
    }
    throw err;
  }
};

export const getCurrentUserApi = async () => {
  const response = await api.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

export const refreshTokenApi = async () => {
  const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
  return response.data;
};
