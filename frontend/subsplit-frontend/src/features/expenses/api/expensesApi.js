import api from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';

export const getExpensesApi = async () => {
  const response = await api.get(API_ENDPOINTS.EXPENSES.BASE);
  return response.data;
};

export const createExpenseApi = async (expenseData) => {
  const response = await api.post(API_ENDPOINTS.EXPENSES.BASE, expenseData);
  return response.data;
};
