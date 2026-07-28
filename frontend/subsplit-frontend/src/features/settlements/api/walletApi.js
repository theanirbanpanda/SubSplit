import api from '../../../services/api';

export const fetchMyWalletApi = async () => {
  const response = await api.get('/wallets/me');
  return response.data;
};

export const addMoneyToWalletApi = async (amount) => {
  const response = await api.post('/wallets/add-money', { amount });
  return response.data;
};
