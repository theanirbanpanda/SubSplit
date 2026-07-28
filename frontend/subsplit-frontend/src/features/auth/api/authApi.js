import api from '../../../services/api';

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const uploadProfileImageApi = async (formDataOrDataUrl) => {
  if (formDataOrDataUrl instanceof FormData) {
    const response = await api.post('/users/profile-image', formDataOrDataUrl, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } else {
    const response = await api.post('/users/profile-image', { profileImage: formDataOrDataUrl });
    return response.data;
  }
};

export const updateUserProfileApi = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const fetchKycStatusApi = async () => {
  const response = await api.get('/users/kyc-status');
  return response.data;
};

export const submitKycDocumentApi = async (formDataOrParams) => {
  const response = await api.post('/users/kyc/submit', formDataOrParams);
  return response.data;
};


