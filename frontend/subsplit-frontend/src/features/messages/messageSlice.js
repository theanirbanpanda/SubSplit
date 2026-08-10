import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchConversationsApi,
  fetchConversationByIdApi,
  fetchMessagesApi,
  startConversationApi,
  sendMessageApi,
  markConversationAsReadApi,
  fetchUnreadMessageCountApi,
} from './api/messageApi';

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchConversationsApi();
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'messages/fetchConversationMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await fetchMessagesApi(conversationId);
      return { conversationId, messages: response.data || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const startOrGetConversation = createAsyncThunk(
  'messages/startOrGetConversation',
  async ({ recipientId, listingId }, { rejectWithValue }) => {
    try {
      const response = await startConversationApi(recipientId, listingId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to start conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await sendMessageApi(payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markConversationRead = createAsyncThunk(
  'messages/markConversationRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      await markConversationAsReadApi(conversationId);
      return conversationId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const fetchUnreadMessageCount = createAsyncThunk(
  'messages/fetchUnreadMessageCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUnreadMessageCountApi();
      return response.data?.unreadCount || 0;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  messagesLoading: false,
  sending: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversation = action.payload;
    },
    clearActiveConversation(state) {
      state.activeConversation = null;
      state.messages = [];
    },
    addMessageOptimistic(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        if (state.conversations.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchConversationMessages
      .addCase(fetchConversationMessages.pending, (state) => {
        if (state.messages.length === 0) {
          state.messagesLoading = true;
        }
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const newMsgs = action.payload?.messages || [];
        // Only update array if length or latest message changed
        const currentLen = state.messages.length;
        const newLen = newMsgs.length;
        if (currentLen !== newLen || (newLen > 0 && state.messages[currentLen - 1]?.id !== newMsgs[newLen - 1]?.id)) {
          state.messages = newMsgs;
        }
        // zero out unread count for this conversation in list
        const conv = state.conversations.find((c) => c.id === action.payload?.conversationId);
        if (conv && conv.unreadCount > 0) conv.unreadCount = 0;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })

      // startOrGetConversation
      .addCase(startOrGetConversation.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
        const exists = state.conversations.find((c) => c.id === action.payload.id);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
      })

      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const newMsg = action.payload;
        // check if not already present
        if (!state.messages.some((m) => m.id === newMsg.id)) {
          state.messages.push(newMsg);
        }
        // update conversation last message
        const conv = state.conversations.find((c) => c.id === newMsg.conversationId);
        if (conv) {
          conv.lastMessage = newMsg.content;
          conv.lastMessageAt = newMsg.createdAt;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })

      // markConversationRead
      .addCase(markConversationRead.fulfilled, (state, action) => {
        const conv = state.conversations.find((c) => c.id === action.payload);
        if (conv) conv.unreadCount = 0;
      })

      // fetchUnreadMessageCount
      .addCase(fetchUnreadMessageCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const { setActiveConversation, clearActiveConversation, addMessageOptimistic } = messageSlice.actions;
export default messageSlice.reducer;
