import api from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

export const getGroupsApi = async () => {
  const response = await api.get(API_ENDPOINTS.GROUPS.BASE);
  return response.data;
};

export const getGroupByIdApi = async (id) => {
  const response = await api.get(API_ENDPOINTS.GROUPS.BY_ID(id));
  return response.data;
};

export const createGroupApi = async (groupData) => {
  const response = await api.post(API_ENDPOINTS.GROUPS.BASE, groupData);
  return response.data;
};
