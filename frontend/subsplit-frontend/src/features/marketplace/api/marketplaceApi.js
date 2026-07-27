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
