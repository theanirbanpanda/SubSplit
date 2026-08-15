import api from '../../../services/api';

export const fetchAdminUsersApi = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const fetchAdminUserDetailsApi = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const toggleBlockUserApi = async (userId) => {
  const response = await api.patch(`/admin/users/${userId}/toggle-block`);
  return response.data;
};

export const fetchAdminListingsApi = async () => {
  const response = await api.get('/admin/listings');
  return response.data;
};

export const updateAdminListingStatusApi = async (listingId, status) => {
  const response = await api.patch(`/admin/listings/${listingId}/status?status=${status}`);
  return response.data;
};

export const deleteAdminListingApi = async (listingId) => {
  const response = await api.delete(`/admin/listings/${listingId}`);
  return response.data;
};

export const fetchAdminPendingProofsApi = async () => {
  const response = await api.get('/admin/pending-proofs');
  return response.data;
};

export const verifyAndSettleProofApi = async (requestId) => {
  const response = await api.post(`/admin/join-requests/${requestId}/verify-and-settle`);
  return response.data;
};

export const rejectProofApi = async (requestId, reason) => {
  const response = await api.post(`/admin/join-requests/${requestId}/reject-proof`, { reason });
  return response.data;
};

export const fetchAdminAnalyticsApi = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export const fetchAdminLogsApi = async () => {
  const response = await api.get('/admin/logs');
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
