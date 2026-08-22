import api from '../../../services/api';

// All these functions return the Axios response.data which is the ApiResponse wrapper:
// { success: boolean, message: string, data: T, timestamp: string }
// The slice then accesses .data to get the actual payload.

export const fetchConversationsApi = async () => {
  const response = await api.get('/messages/conversations');
  return response.data; // ApiResponse<List<ConversationDto>>
};

export const fetchConversationByIdApi = async (conversationId) => {
  const response = await api.get(`/messages/conversations/${conversationId}`);
  return response.data; // ApiResponse<ConversationDto>
};

export const fetchMessagesApi = async (conversationId) => {
  const response = await api.get(`/messages/conversations/${conversationId}/messages`);
  return response.data; // ApiResponse<List<MessageDto>>
};

export const startConversationApi = async (recipientId, listingId = null) => {
  const params = { recipientId };
  if (listingId) params.listingId = listingId;
  const response = await api.post('/messages/conversations/start', null, { params });
  return response.data; // ApiResponse<ConversationDto>
};

export const sendMessageApi = async (payload) => {
  const response = await api.post('/messages/send', payload);
  return response.data; // ApiResponse<MessageDto>
};

export const markConversationAsReadApi = async (conversationId) => {
  const response = await api.put(`/messages/conversations/${conversationId}/read`);
  return response.data; // ApiResponse<Void>
};

export const fetchUnreadMessageCountApi = async () => {
  const response = await api.get('/messages/unread-count');
  return response.data; // ApiResponse<{unreadCount: number}>
};
