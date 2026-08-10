import api from '../../../services/api';

export const fetchConversationsApi = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const fetchConversationByIdApi = async (conversationId) => {
  const response = await api.get(`/messages/conversations/${conversationId}`);
  return response.data;
};

export const fetchMessagesApi = async (conversationId) => {
  const response = await api.get(`/messages/conversations/${conversationId}/messages`);
  return response.data;
};

export const startConversationApi = async (recipientId, listingId = null) => {
  const params = { recipientId };
  if (listingId) params.listingId = listingId;
  const response = await api.post('/messages/conversations/start', null, { params });
  return response.data;
};

export const sendMessageApi = async (payload) => {
  const response = await api.post('/messages/send', payload);
  return response.data;
};

export const markConversationAsReadApi = async (conversationId) => {
  const response = await api.put(`/messages/conversations/${conversationId}/read`);
  return response.data;
};

export const fetchUnreadMessageCountApi = async () => {
  const response = await api.get('/messages/unread-count');
  return response.data;
};
