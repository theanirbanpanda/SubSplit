import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  TextField,
  IconButton,
  Button,
  Chip,
  InputAdornment,
  Divider,
  CircularProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  MessageSquare,
  Send,
  Search,
  ShieldAlert,
  ShieldCheck,
  CheckCheck,
  Clock,
  Sparkles,
  Info,
  ExternalLink,
  Users,
  KeyRound,
  RefreshCw,
  LockOpen,
} from 'lucide-react';
import {
  fetchConversations,
  fetchConversationMessages,
  sendMessage,
  startOrGetConversation,
  setActiveConversation,
  markConversationRead,
  fetchUnreadMessageCount,
} from './messageSlice';

const QUICK_RESPONSES = [
  '🔑 Credentials working smoothly, thank you!',
  '⚠️ Could you share the verification code / OTP?',
  '🔄 Monthly renewal payment completed via escrow.',
  '🛡️ Please verify my slot access.',
];

function Messages() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const recipientParam = searchParams.get('recipientId');
  const listingParam = searchParams.get('listingId');

  const {
    conversations,
    activeConversation,
    messages,
    loading,
    messagesLoading,
    sending,
  } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth || {});

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  // Initial load & query param trigger
  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchUnreadMessageCount());

    if (recipientParam) {
      dispatch(
        startOrGetConversation({
          recipientId: Number(recipientParam),
          listingId: listingParam ? Number(listingParam) : null,
        })
      ).then((res) => {
        if (res.payload?.id) {
          dispatch(fetchConversationMessages(res.payload.id));
        }
      });
    }
  }, [recipientParam, listingParam, dispatch]);

  // Polling every 5 seconds for real-time updates (without resetting loading or triggering window scroll)
  useEffect(() => {
    pollTimerRef.current = setInterval(() => {
      dispatch(fetchConversations());
      dispatch(fetchUnreadMessageCount());
      if (activeConversation?.id) {
        dispatch(fetchConversationMessages(activeConversation.id));
      }
    }, 5000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [activeConversation?.id, dispatch]);

  // Internal chat box scroll only when active conversation switches or new message is added
  useEffect(() => {
    if (activeConversation?.id) {
      prevMessagesLengthRef.current = messages.length;
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = messages.length;
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages.length]);

  const handleSelectConversation = (conv) => {
    dispatch(setActiveConversation(conv));
    dispatch(fetchConversationMessages(conv.id));
    dispatch(markConversationRead(conv.id));
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !activeConversation) return;

    setInputText('');
    await dispatch(
      sendMessage({
        conversationId: activeConversation.id,
        content: text,
      })
    );
    dispatch(fetchConversationMessages(activeConversation.id));
    dispatch(fetchConversations());
  };

  const handleQuickResponse = (text) => {
    setInputText(text);
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.otherUserName && c.otherUserName.toLowerCase().includes(q)) ||
      (c.listingTitle && c.listingTitle.toLowerCase().includes(q)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  });

  return (
    <Box sx={{ py: 3, px: { xs: 1.5, md: 3 }, maxWidth: 1400, mx: 'auto', minHeight: '85vh' }}>
      {/* Top Banner: Non-E2EE Moderation & Escrow Safety Transparency */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(249, 115, 22, 0.05) 100%)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'rgba(249, 115, 22, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LockOpen size={22} color="#f97316" />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffedd5' }}>
              Safety Notice: Chats are NOT End-to-End Encrypted
            </Typography>
            <Chip
              label="Monitored for Escrow Safety"
              size="small"
              sx={{
                background: 'rgba(249, 115, 22, 0.2)',
                color: '#fb923c',
                fontWeight: 700,
                fontSize: '0.72rem',
                height: 20,
              }}
            />
          </Stack>
          <Typography sx={{ fontSize: '0.82rem', color: '#fed7aa', mt: 0.3 }}>
            To safeguard member payments, prevent fraud, and allow SubSplit mediators to settle subscription & credential disputes, all messages are logged and monitored on platform servers. Never share banking PINs or unauthorized credentials outside escrow.
          </Typography>
        </Box>
      </Paper>

      {/* Main Chat Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          background: '#111114',
          border: '1px solid #2A2A30',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: { xs: 'auto', md: '75vh' },
          minHeight: 600,
        }}
      >
        {/* Left Sidebar: Conversations List */}
        <Box
          sx={{
            width: { xs: '100%', md: 360 },
            borderRight: { md: '1px solid #2A2A30' },
            borderBottom: { xs: '1px solid #2A2A30', md: 'none' },
            display: 'flex',
            flexDirection: 'column',
            background: '#0d0d10',
          }}
        >
          {/* Sidebar Header */}
          <Box sx={{ p: 2.5, borderBottom: '1px solid #2A2A30' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <MessageSquare size={20} color="#3b82f6" />
                <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff' }}>
                  Messages
                </Typography>
              </Stack>
              <Chip
                label={`${conversations.length} Chat${conversations.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{ background: '#1c1e24', color: '#9ca3af', fontWeight: 700, fontSize: '0.72rem' }}
              />
            </Stack>

            {/* Search Input */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#71717a" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#16161a',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2A2A30' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                },
              }}
            />
          </Box>

          {/* Conversations Scrollable List */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
            {filteredConversations.length === 0 ? (
              <Box sx={{ py: 6, px: 2, textAlign: 'center' }}>
                <MessageSquare size={32} color="#52525b" style={{ margin: '0 auto 8px' }} />
                <Typography sx={{ fontSize: '0.88rem', color: '#a1a1aa', fontWeight: 600 }}>
                  No conversations yet
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#71717a', mt: 0.5 }}>
                  Click "Chat with Host" on any group listing to start a conversation.
                </Typography>
              </Box>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                const hasUnread = conv.unreadCount > 0;

                return (
                  <Box
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    sx={{
                      p: 1.75,
                      mb: 1,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(29,78,216,0.12) 100%)'
                        : '#141417',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid #222227',
                      '&:hover': {
                        background: isSelected ? undefined : '#1a1a1f',
                        borderColor: isSelected ? undefined : '#33333d',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={conv.otherUserAvatar}
                        sx={{
                          width: 44,
                          height: 44,
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          color: '#ffffff',
                          border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {conv.otherUserInitials || 'M'}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.2}>
                          <Typography
                            noWrap
                            sx={{
                              fontWeight: hasUnread ? 900 : 700,
                              fontSize: '0.92rem',
                              color: isSelected ? '#ffffff' : '#f3f4f6',
                            }}
                          >
                            {conv.otherUserName}
                          </Typography>
                          {hasUnread && (
                            <Chip
                              label={conv.unreadCount}
                              size="small"
                              sx={{
                                height: 18,
                                minWidth: 18,
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                background: '#3b82f6',
                                color: '#ffffff',
                              }}
                            />
                          )}
                        </Stack>

                        <Typography
                          noWrap
                          sx={{
                            fontSize: '0.75rem',
                            color: '#38bdf8',
                            fontWeight: 600,
                            mb: 0.2,
                          }}
                        >
                          {conv.listingTitle || 'Direct Support Chat'}
                        </Typography>

                        <Typography
                          noWrap
                          sx={{
                            fontSize: '0.78rem',
                            color: hasUnread ? '#e4e4e7' : '#71717a',
                            fontWeight: hasUnread ? 700 : 500,
                          }}
                        >
                          {conv.lastMessage || 'Conversation started'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        {/* Right Area: Active Chat Window */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111114' }}>
          {activeConversation ? (
            <>
              {/* Chat Window Header */}
              <Box
                sx={{
                  p: 2.2,
                  borderBottom: '1px solid #2A2A30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#141418',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    src={activeConversation.otherUserAvatar}
                    sx={{
                      width: 44,
                      height: 44,
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      fontWeight: 800,
                      color: '#ffffff',
                    }}
                  >
                    {activeConversation.otherUserInitials || 'M'}
                  </Avatar>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#ffffff' }}>
                        {activeConversation.otherUserName}
                      </Typography>
                      <Chip
                        icon={<ShieldCheck size={11} color="#22c55e" />}
                        label="Verified"
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: 'rgba(34,197,94,0.12)',
                          color: '#22c55e',
                        }}
                      />
                    </Stack>
                    <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                      Re: {activeConversation.listingTitle || 'Group Support & Credentials'}
                    </Typography>
                  </Box>
                </Stack>

                {/* Transparency Tag */}
                <Tooltip title="This conversation is recorded on SubSplit servers to protect member escrow funds and resolve disputes. It is NOT end-to-end encrypted.">
                  <Chip
                    icon={<LockOpen size={12} color="#f97316" />}
                    label="Not E2EE • Moderated"
                    size="small"
                    sx={{
                      background: 'rgba(249, 115, 22, 0.12)',
                      color: '#fb923c',
                      fontWeight: 800,
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      fontSize: '0.72rem',
                    }}
                  />
                </Tooltip>
              </Box>

              {/* Chat Message Stream */}
              <Box
                ref={chatContainerRef}
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: { xs: 2, md: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: '#0e0e11',
                }}
              >
                {/* Embedded Escrow Notice */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    background: 'rgba(39, 39, 42, 0.4)',
                    border: '1px dashed #3f3f46',
                    textAlign: 'center',
                    maxWidth: 540,
                    mx: 'auto',
                  }}
                >
                  <Typography sx={{ fontSize: '0.74rem', color: '#a1a1aa' }}>
                    🛡️ <strong style={{ color: '#ffffff' }}>Escrow Protection Active:</strong> For your security, all messages regarding credentials and renewals in this group are logged for fraud protection.
                  </Typography>
                </Box>

                {messages.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <MessageSquare size={36} color="#52525b" style={{ margin: '0 auto 8px' }} />
                    <Typography sx={{ fontSize: '0.9rem', color: '#e4e4e7', fontWeight: 700 }}>
                      Say hello to {activeConversation.otherUserName}!
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#71717a', mt: 0.5 }}>
                      Ask for login credentials, renewal schedules, or slot assistance.
                    </Typography>
                  </Box>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.isMine;
                    const timeStr = msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '';

                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          justifyContent: isMine ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: { xs: '85%', md: '65%' },
                            p: 2,
                            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isMine
                              ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                              : '#18181b',
                            border: isMine ? 'none' : '1px solid #27272a',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          {!isMine && (
                            <Typography sx={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 800, mb: 0.4 }}>
                              {msg.senderName}
                            </Typography>
                          )}
                          <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
                            {msg.content}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            spacing={0.5}
                            mt={0.8}
                          >
                            <Typography sx={{ fontSize: '0.68rem', color: isMine ? 'rgba(255,255,255,0.7)' : '#71717a' }}>
                              {timeStr}
                            </Typography>
                            {isMine && <CheckCheck size={13} color="rgba(255,255,255,0.9)" />}
                          </Stack>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>

              {/* Quick Response Chips */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  background: '#141418',
                  borderTop: '1px solid #222228',
                  overflowX: 'auto',
                  display: 'flex',
                  gap: 1,
                }}
              >
                {QUICK_RESPONSES.map((resp, idx) => (
                  <Chip
                    key={idx}
                    label={resp}
                    size="small"
                    onClick={() => handleQuickResponse(resp)}
                    sx={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      background: '#1e1e24',
                      color: '#d4d4d8',
                      border: '1px solid #2e2e38',
                      cursor: 'pointer',
                      '&:hover': { background: '#272732', borderColor: '#3b82f6', color: '#ffffff' },
                    }}
                  />
                ))}
              </Box>

              {/* Input Area */}
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  p: 2,
                  background: '#141418',
                  borderTop: '1px solid #2A2A30',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message to host/member (Press Enter to send)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: '14px',
                      background: '#0d0d10',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2A2A30' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!inputText.trim() || sending}
                  endIcon={sending ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
                  sx={{
                    px: 3,
                    py: 1.1,
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    },
                  }}
                >
                  Send
                </Button>
              </Box>
            </>
          ) : (
            /* Empty State when no conversation is selected */
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '24px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <MessageSquare size={36} color="#3b82f6" />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
                SubSplit Member Messaging
              </Typography>
              <Typography sx={{ color: '#a1a1aa', maxWidth: 440, fontSize: '0.9rem', mb: 3 }}>
                Connect directly with subscription hosts and group members to receive credentials, coordinate renewals, and request assistance.
              </Typography>

              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: '#16161b',
                  border: '1px solid #27272f',
                  maxWidth: 420,
                  textAlign: 'left',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <LockOpen size={18} color="#f97316" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#fed7aa' }}>
                      Security & Non-E2EE Moderation Notice
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa', mt: 0.3 }}>
                      All chats are monitored and stored on SubSplit servers to resolve disputes and verify credentials.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default Messages;
