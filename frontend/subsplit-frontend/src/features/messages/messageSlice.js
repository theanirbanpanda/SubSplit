import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchConversationsApi,
  fetchMessagesApi,
  startConversationApi,
  sendMessageApi,
  markConversationAsReadApi,
  fetchUnreadMessageCountApi,
  reactToMessageApi,
  deleteMessageApi,
  uploadAttachmentApi,
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
      return response.data?.unreadCount ?? 0;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const toggleReaction = createAsyncThunk(
  'messages/toggleReaction',
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const response = await reactToMessageApi(messageId, emoji);
      return response.data; // { messageId, reactions, added }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to react');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await deleteMessageApi(messageId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete message');
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  'messages/uploadAttachment',
  async (file, { rejectWithValue }) => {
    try {
      const response = await uploadAttachmentApi(file);
      return response.data; // { url, name }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload file');
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
  uploading: false,
  error: null,
  typingUsers: {}, // { conversationId: { senderId, senderName, timestamp } }
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
    addRealtimeMessage(state, action) {
      const newMsg = action.payload;
      if (
        state.activeConversation &&
        state.activeConversation.id === newMsg.conversationId &&
        !state.messages.some((m) => m.id === newMsg.id)
      ) {
        state.messages.push(newMsg);
      }
      const conv = state.conversations.find((c) => c.id === newMsg.conversationId);
      if (conv) {
        conv.lastMessage = newMsg.content;
        conv.lastMessageAt = newMsg.createdAt;
        if (!newMsg.isMine && state.activeConversation?.id !== newMsg.conversationId) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
      }
    },
    updateMessageReactions(state, action) {
      const { messageId, reactions } = action.payload;
      const msg = state.messages.find((m) => m.id === messageId);
      if (msg) msg.reactions = reactions;
    },
    setTypingUser(state, action) {
      const { conversationId, senderId, senderName, typing } = action.payload;
      if (typing) {
        state.typingUsers[conversationId] = { senderId, senderName, timestamp: Date.now() };
      } else {
        delete state.typingUsers[conversationId];
      }
    },
    markMessageDeleted(state, action) {
      const { messageId } = action.payload;
      const msg = state.messages.find((m) => m.id === messageId);
      if (msg) {
        msg.isDeleted = true;
        msg.content = 'This message was deleted';
        msg.attachmentUrl = null;
        msg.attachmentName = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        if (state.conversations.length === 0) state.loading = true;
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

      .addCase(fetchConversationMessages.pending, (state) => {
        if (state.messages.length === 0) state.messagesLoading = true;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const newMsgs = action.payload?.messages || [];
        const currentLen = state.messages.length;
        const newLen = newMsgs.length;
        if (currentLen !== newLen || (newLen > 0 && state.messages[currentLen - 1]?.id !== newMsgs[newLen - 1]?.id)) {
          state.messages = newMsgs;
        }
        const conv = state.conversations.find((c) => c.id === action.payload?.conversationId);
        if (conv && conv.unreadCount > 0) conv.unreadCount = 0;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })

      .addCase(startOrGetConversation.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
        const exists = state.conversations.find((c) => c.id === action.payload.id);
        if (!exists) state.conversations.unshift(action.payload);
      })

      .addCase(sendMessage.pending, (state) => { state.sending = true; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const newMsg = action.payload;
        if (!state.messages.some((m) => m.id === newMsg.id)) {
          state.messages.push(newMsg);
        }
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

      .addCase(markConversationRead.fulfilled, (state, action) => {
        const conv = state.conversations.find((c) => c.id === action.payload);
        if (conv) conv.unreadCount = 0;
      })

      .addCase(fetchUnreadMessageCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      .addCase(toggleReaction.fulfilled, (state, action) => {
        const { messageId, reactions } = action.payload;
        const msg = state.messages.find((m) => m.id === messageId);
        if (msg) msg.reactions = reactions;
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.messages.findIndex((m) => m.id === updated.id);
        if (idx !== -1) {
          state.messages[idx] = { ...state.messages[idx], ...updated };
        }
      })

      .addCase(uploadAttachment.pending, (state) => { state.uploading = true; })
      .addCase(uploadAttachment.fulfilled, (state) => { state.uploading = false; })
      .addCase(uploadAttachment.rejected, (state) => { state.uploading = false; });
  },
});

export const {
  setActiveConversation,
  clearActiveConversation,
  addRealtimeMessage,
  updateMessageReactions,
  setTypingUser,
  markMessageDeleted,
} = messageSlice.actions;

export default messageSlice.reducer;
