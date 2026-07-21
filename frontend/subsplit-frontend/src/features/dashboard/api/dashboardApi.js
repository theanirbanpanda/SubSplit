import api from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

export const getDashboardSummaryApi = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD?.BASE || '/dashboard');
  return response.data;
};
