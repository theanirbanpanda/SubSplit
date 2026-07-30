import api from '../../../services/api';

export const raiseDisputeApi = async (disputeData) => {
  const response = await api.post('/disputes', disputeData);
  return response.data;
};

export const fetchMyDisputesApi = async () => {
  const response = await api.get('/disputes/my');
  return response.data;
};

export const fetchAllDisputesAdminApi = async () => {
  const response = await api.get('/admin/disputes');
  return response.data;
};

export const resolveDisputeAdminApi = async (disputeId, resolutionData) => {
  const response = await api.post(`/admin/disputes/${disputeId}/resolve`, resolutionData);
  return response.data;
};
