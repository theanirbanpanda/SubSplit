import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  TextField,
  IconButton,
  Button,
  Chip,
  InputAdornment,
  CircularProgress,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  MessageSquare,
  Send,
  Search,
  CheckCheck,
  LockOpen,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Smile,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import {
  fetchConversations,
  fetchConversationMessages,
  sendMessage,
  startOrGetConversation,
  setActiveConversation,
  markConversationRead,
  fetchUnreadMessageCount,
  addRealtimeMessage,
} from "./messageSlice";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const QUICK_RESPONSES = [
  "🔑 Credentials working smoothly!",
  "⚠️ Could you share the OTP?",
  "🔄 Monthly renewal completed.",
  "🛡️ Please verify my slot access.",
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString();
}

function msgTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Messages() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const recipientParam = searchParams.get("recipientId");
  const listingParam = searchParams.get("listingId");

  const { conversations, activeConversation, messages, sending } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth || {});

  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const inputRef = useRef(null);

  // Initial data load
  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchUnreadMessageCount());
  }, [dispatch]);

  // Handle recipientId query param (from "Message Host" button)
  useEffect(() => {
    if (!recipientParam) return;
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
  }, [recipientParam, listingParam, dispatch]);

  // WebSocket Real-time
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: () => {},
      onConnect: () => {
        client.subscribe("/user/queue/messages", (frame) => {
          if (frame.body) {
            const newMsg = JSON.parse(frame.body);
            dispatch(addRealtimeMessage(newMsg));
            dispatch(fetchUnreadMessageCount());
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });
    client.activate();
    stompClientRef.current = client;
    return () => {
      stompClientRef.current?.deactivate();
    };
  }, [user, dispatch]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conv) => {
    dispatch(setActiveConversation(conv));
    dispatch(fetchConversationMessages(conv.id));
    dispatch(markConversationRead(conv.id));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !activeConversation || sending) return;
    setInputText("");
    await dispatch(sendMessage({ conversationId: activeConversation.id, content: text }));
    // Refresh conversations sidebar to update last message
    dispatch(fetchConversations());
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filtered = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.otherUserName?.toLowerCase().includes(q) ||
      c.listingTitle?.toLowerCase().includes(q) ||
      c.lastMessage?.toLowerCase().includes(q)
    );
  });

  // Styles
  const sidebarBg = "rgba(9, 9, 11, 0.97)";
  const chatBg = "#0c0c0f";
  const borderColor = "rgba(255,255,255,0.07)";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: "#09090b",
      }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <Box
        sx={{
          width: { xs: "100%", md: 340 },
          flexShrink: 0,
          display: { xs: activeConversation ? "none" : "flex", md: "flex" },
          flexDirection: "column",
          borderRight: `1px solid ${borderColor}`,
          background: sidebarBg,
          overflow: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: `1px solid ${borderColor}` }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Messages
            </Typography>
            <IconButton size="small" sx={{ color: "#71717a", "&:hover": { color: "#fff", background: "rgba(255,255,255,0.08)" } }}>
              <MoreVertical size={18} />
            </IconButton>
          </Stack>

          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#52525b" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                "& fieldset": { border: "1px solid rgba(255,255,255,0.08)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.16) !important" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6 !important" },
                input: { color: "#e4e4e7", fontSize: "0.9rem", py: "9px" },
              },
            }}
          />
        </Box>

        {/* Conversation List */}
        <Box sx={{ flex: 1, overflowY: "auto", py: 1, "&::-webkit-scrollbar": { width: 3 }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.08)", borderRadius: 4 } }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <MessageSquare size={40} color="#3f3f46" strokeWidth={1} style={{ margin: "0 auto 12px" }} />
              <Typography sx={{ fontSize: "0.9rem", color: "#52525b" }}>No conversations yet</Typography>
            </Box>
          ) : (
            filtered.map((conv) => {
              const active = activeConversation?.id === conv.id;
              const unread = conv.unreadCount > 0;
              return (
                <Box
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  sx={{
                    mx: 1.5,
                    mb: 0.5,
                    px: 2,
                    py: 1.5,
                    borderRadius: "14px",
                    cursor: "pointer",
                    background: active ? "rgba(59,130,246,0.12)" : "transparent",
                    border: "1px solid",
                    borderColor: active ? "rgba(59,130,246,0.25)" : "transparent",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      background: active ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                      borderColor: active ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Badge
                      color="success"
                      variant="dot"
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      invisible={!active}
                      sx={{ "& .MuiBadge-badge": { width: 9, height: 9, border: "2px solid #09090b" } }}
                    >
                      <Avatar
                        src={conv.otherUserAvatar || ""}
                        sx={{
                          width: 46,
                          height: 46,
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                          outline: active ? "2px solid #3b82f6" : "none",
                          outlineOffset: 2,
                        }}
                      >
                        {conv.otherUserInitials || "?"}
                      </Avatar>
                    </Badge>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          noWrap
                          sx={{ fontWeight: unread ? 800 : 600, fontSize: "0.92rem", color: active ? "#fff" : "#e4e4e7" }}
                        >
                          {conv.otherUserName || "Member"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: unread ? "#60a5fa" : "#52525b", flexShrink: 0, ml: 1 }}>
                          {timeAgo(conv.lastMessageAt)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.3}>
                        <Typography
                          noWrap
                          sx={{ fontSize: "0.82rem", color: unread ? "#a1a1aa" : "#52525b", fontWeight: unread ? 600 : 400, flex: 1 }}
                        >
                          {conv.lastMessage || "Tap to start chatting"}
                        </Typography>
                        {unread && (
                          <Box
                            sx={{
                              ml: 1,
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "#3b82f6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff" }}>
                              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      {/* ── RIGHT CHAT PANEL ── */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: { xs: activeConversation ? "flex" : "none", md: "flex" },
          flexDirection: "column",
          overflow: "hidden",
          background: chatBg,
        }}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <Box
              sx={{
                px: 3,
                py: 1.8,
                borderBottom: `1px solid ${borderColor}`,
                background: "rgba(12,12,15,0.95)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Mobile back */}
                <IconButton
                  onClick={() => dispatch(setActiveConversation(null))}
                  sx={{ display: { xs: "flex", md: "none" }, color: "#a1a1aa", p: 0.5 }}
                >
                  <ArrowLeft size={22} />
                </IconButton>

                <Avatar
                  src={activeConversation.otherUserAvatar || ""}
                  sx={{ width: 44, height: 44, fontWeight: 800, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", fontSize: "0.95rem" }}
                >
                  {activeConversation.otherUserInitials || "?"}
                </Avatar>

                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>
                      {activeConversation.otherUserName}
                    </Typography>
                    <Chip
                      icon={<ShieldCheck size={11} color="#10b981" />}
                      label="Verified"
                      size="small"
                      sx={{ height: 18, fontSize: "0.68rem", fontWeight: 700, background: "rgba(16,185,129,0.1)", color: "#10b981", "& .MuiChip-label": { px: "6px" } }}
                    />
                  </Stack>
                  <Typography sx={{ fontSize: "0.76rem", color: "#71717a" }}>
                    Re:{" "}
                    <span style={{ color: "#60a5fa" }}>
                      {activeConversation.listingTitle || "Direct Chat"}
                    </span>
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" sx={{ color: "#52525b", "&:hover": { color: "#60a5fa", background: "rgba(59,130,246,0.1)" } }}>
                  <Phone size={18} />
                </IconButton>
                <IconButton size="small" sx={{ color: "#52525b", "&:hover": { color: "#60a5fa", background: "rgba(59,130,246,0.1)" } }}>
                  <Video size={18} />
                </IconButton>
                <Tooltip title="Chats are moderated for escrow safety. Not end-to-end encrypted." placement="bottom">
                  <IconButton size="small" sx={{ color: "#f59e0b", background: "rgba(245,158,11,0.08)", "&:hover": { background: "rgba(245,158,11,0.15)" } }}>
                    <LockOpen size={18} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            {/* Message Stream */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: { xs: 2, md: 4 },
                py: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.08)", borderRadius: 4 },
              }}
            >
              {/* Safety notice */}
              <Box
                sx={{
                  mx: "auto",
                  mb: 2,
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  background: "rgba(245,158,11,0.06)",
                  border: "1px dashed rgba(245,158,11,0.25)",
                  textAlign: "center",
                  maxWidth: 480,
                }}
              >
                <Typography sx={{ fontSize: "0.78rem", color: "#a16207", fontWeight: 600 }}>
                  🛡️ Escrow protected · Monitored for fraud prevention
                </Typography>
              </Box>

              {messages.length === 0 ? (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
                  <MessageSquare size={48} color="#27272a" strokeWidth={1} style={{ marginBottom: 16 }} />
                  <Typography sx={{ color: "#52525b", fontSize: "0.95rem" }}>
                    No messages yet — say hello!
                  </Typography>
                </Box>
              ) : (
                messages.map((msg, idx) => {
                  const mine = msg.isMine;
                  const prevMine = messages[idx - 1]?.isMine;
                  const nextMine = messages[idx + 1]?.isMine;
                  const isFirst = prevMine !== mine;
                  const isLast = nextMine !== mine;

                  // WhatsApp-style grouped border radius
                  let br;
                  if (mine) {
                    br = `18px ${isFirst ? "18px" : "5px"} ${isLast ? "18px" : "5px"} 18px`;
                  } else {
                    br = `${isFirst ? "18px" : "5px"} 18px 18px ${isLast ? "18px" : "5px"}`;
                  }

                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent: mine ? "flex-end" : "flex-start",
                        mt: isFirst ? 1.5 : 0.25,
                      }}
                    >
                      {/* Avatar for received messages (only show on last in group) */}
                      {!mine && (
                        <Avatar
                          src={activeConversation.otherUserAvatar || ""}
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                            mr: 1,
                            mt: "auto",
                            opacity: isLast ? 1 : 0,
                          }}
                        >
                          {activeConversation.otherUserInitials || "?"}
                        </Avatar>
                      )}

                      <Box
                        sx={{
                          maxWidth: { xs: "78%", md: "60%" },
                          px: 2,
                          py: 1,
                          borderRadius: br,
                          background: mine
                            ? "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
                            : "rgba(39,39,42,0.9)",
                          color: "#fff",
                          boxShadow: mine
                            ? "0 2px 8px rgba(37,99,235,0.3)"
                            : "0 2px 8px rgba(0,0,0,0.2)",
                          border: mine ? "none" : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.5, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                          {msg.content}
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5} mt={0.4}>
                          <Typography sx={{ fontSize: "0.65rem", color: mine ? "rgba(255,255,255,0.6)" : "#71717a" }}>
                            {msgTime(msg.createdAt)}
                          </Typography>
                          {mine && (
                            <CheckCheck size={13} color={msg.isRead ? "#60a5fa" : "rgba(255,255,255,0.5)"} />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                px: { xs: 2, md: 3 },
                py: 2,
                borderTop: `1px solid ${borderColor}`,
                background: "rgba(9,9,11,0.97)",
                flexShrink: 0,
              }}
            >
              {/* Quick Responses */}
              <Stack direction="row" spacing={1} sx={{ mb: 1.5, overflowX: "auto", "&::-webkit-scrollbar": { display: "none" }, pb: 0.5 }}>
                {QUICK_RESPONSES.map((r, i) => (
                  <Chip
                    key={i}
                    label={r}
                    size="small"
                    onClick={() => setInputText(r)}
                    sx={{
                      flexShrink: 0,
                      fontSize: "0.78rem",
                      background: "rgba(255,255,255,0.05)",
                      color: "#a1a1aa",
                      border: "1px solid rgba(255,255,255,0.08)",
                      "&:hover": { background: "rgba(59,130,246,0.15)", borderColor: "#3b82f6", color: "#93c5fd" },
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Stack>

              {/* Message Input Row */}
              <Box
                component="form"
                onSubmit={handleSend}
                sx={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}
              >
                <IconButton
                  sx={{ color: "#52525b", flexShrink: 0, mb: 0.5, "&:hover": { color: "#a1a1aa", background: "rgba(255,255,255,0.06)" } }}
                >
                  <Paperclip size={20} />
                </IconButton>

                <TextField
                  inputRef={inputRef}
                  fullWidth
                  multiline
                  maxRows={5}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                  InputProps={{
                    sx: {
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.04)",
                      color: "#e4e4e7",
                      fontSize: "0.92rem",
                      "& fieldset": { border: "1px solid rgba(255,255,255,0.1)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2) !important" },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6 !important" },
                    },
                  }}
                />

                <IconButton sx={{ color: "#52525b", flexShrink: 0, mb: 0.5, "&:hover": { color: "#a1a1aa", background: "rgba(255,255,255,0.06)" } }}>
                  <Smile size={20} />
                </IconButton>

                <Button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  sx={{
                    flexShrink: 0,
                    minWidth: 48,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    mb: 0.25,
                    p: 0,
                    background: inputText.trim()
                      ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                      : "rgba(255,255,255,0.08)",
                    "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)", transform: "scale(1.05)" },
                    "&.Mui-disabled": { background: "rgba(255,255,255,0.06)" },
                    transition: "all 0.15s ease",
                  }}
                >
                  {sending ? (
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                  ) : (
                    <Send size={18} color={inputText.trim() ? "#fff" : "#52525b"} style={{ marginLeft: 3 }} />
                  )}
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          /* Empty state — desktop only */
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={44} color="#3b82f6" strokeWidth={1} />
            </Box>
            <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, color: "#e4e4e7", letterSpacing: "-0.02em" }}>
              SubSplit Messaging
            </Typography>
            <Typography sx={{ color: "#71717a", maxWidth: 380, lineHeight: 1.7 }}>
              Pick a conversation from the sidebar, or start a new one by clicking{" "}
              <strong style={{ color: "#60a5fa" }}>Message Host</strong> on any subscription listing.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
