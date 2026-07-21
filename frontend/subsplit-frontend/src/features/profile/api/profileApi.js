import api from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

export const getProfileApi = async () => {
  const response = await api.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};
