import api from '../../../services/api';

export const fetchMarketplaceListingsApi = async (params = {}) => {
  const response = await api.get('/marketplace/listings', { params });
  return response.data;
};

export const fetchMarketplaceCategoriesApi = async () => {
  const response = await api.get('/marketplace/categories');
  return response.data;
};

export const fetchTopHostsApi = async () => {
  const response = await api.get('/marketplace/hosts');
  return response.data;
};

export const fetchListingByIdApi = async (id) => {
  const response = await api.get(`/marketplace/listings/${id}`);
  return response.data;
};

export const createListingApi = async (listingData) => {
  const response = await api.post('/marketplace/listings', listingData);
  return response.data;
};

export const updateListingApi = async (id, listingData) => {
  const response = await api.put(`/marketplace/listings/${id}`, listingData);
  return response.data;
};

export const deleteListingApi = async (id) => {
  const response = await api.delete(`/marketplace/listings/${id}`);
  return response.data;
};

export const fetchMyListingsApi = async () => {
  const response = await api.get('/marketplace/listings/my-listings');
  return response.data;
};

export const fetchSimilarListingsApi = async (id) => {
  const response = await api.get(`/marketplace/listings/${id}/similar`);
  return response.data;
};

export const fetchListingReviewsApi = async (id) => {
  const response = await api.get(`/marketplace/listings/${id}/reviews`);
  return response.data;
};

export const submitListingReviewApi = async (id, reviewData) => {
  const response = await api.post(`/marketplace/listings/${id}/reviews`, reviewData);
  return response.data;
};

export const submitJoinRequestApi = async (id, requestData = {}) => {
  const response = await api.post(`/marketplace/listings/${id}/join-requests`, requestData);
  return response.data;
};

export const checkJoinStatusApi = async (id) => {
  const response = await api.get(`/marketplace/listings/${id}/join-requests/status`);
  return response.data;
};

export const fetchMyJoinRequestsApi = async () => {
  const response = await api.get('/marketplace/join-requests/my-requests');
  return response.data;
};

export const fetchHostJoinRequestsApi = async () => {
  const response = await api.get('/marketplace/join-requests/host-requests');
  return response.data;
};

export const acceptJoinRequestApi = async (requestId, credentialsData) => {
  const response = await api.put(`/marketplace/join-requests/${requestId}/accept`, credentialsData);
  return response.data;
};

export const submitProofAndSettleApi = async (requestId, proofData) => {
  const response = await api.post(`/marketplace/join-requests/${requestId}/submit-proof-and-settle`, proofData);
  return response.data;
};

export const rejectJoinRequestApi = async (requestId) => {
  const response = await api.put(`/marketplace/join-requests/${requestId}/reject`);
  return response.data;
};




