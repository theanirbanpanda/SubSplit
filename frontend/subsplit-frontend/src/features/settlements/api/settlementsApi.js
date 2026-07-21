import api from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

export const getSettlementsApi = async () => {
  const response = await api.get(API_ENDPOINTS.SETTLEMENTS.BASE);
  return response.data;
};

export const createSettlementApi = async (settlementData) => {
  const response = await api.post(API_ENDPOINTS.SETTLEMENTS.BASE, settlementData);
  return response.data;
};
