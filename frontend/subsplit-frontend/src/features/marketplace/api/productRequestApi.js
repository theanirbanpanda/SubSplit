import api from '../../../services/api';

export const submitProductRequestApi = async (data) => {
  const response = await api.post('/product-requests', data);
  return response.data;
};

export const fetchMyProductRequestsApi = async () => {
  const response = await api.get('/product-requests/my');
  return response.data;
};

export const fetchAllProductRequestsAdminApi = async () => {
  const response = await api.get('/product-requests/admin');
  return response.data;
};

export const reviewProductRequestAdminApi = async (id, status, adminNotes = '') => {
  const response = await api.patch(`/product-requests/admin/${id}/review`, { status, adminNotes });
  return response.data;
};
