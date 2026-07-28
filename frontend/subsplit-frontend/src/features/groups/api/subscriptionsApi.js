import api from '../../../services/api';

export const fetchMySubscriptionsApi = async () => {
  const response = await api.get('/memberships/my-subscriptions');
  return response.data;
};

export const fetchMySubscriptionByIdApi = async (id) => {
  const response = await api.get(`/memberships/my-subscriptions/${id}`);
  return response.data;
};

export const fetchSubscriptionCredentialsApi = async (id) => {
  const response = await api.get(`/memberships/my-subscriptions/${id}/credentials`);
  return response.data;
};

export const cancelSubscriptionApi = async (id) => {
  const response = await api.post(`/memberships/my-subscriptions/${id}/cancel`);
  return response.data;
};

export const toggleAutoRenewApi = async (id, autoRenew) => {
  const response = await api.put(`/memberships/my-subscriptions/${id}/auto-renew`, { autoRenew });
  return response.data;
};

export const fetchSubscriptionSummaryApi = async () => {
  const response = await api.get('/memberships/summary');
  return response.data;
};
