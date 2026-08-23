import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Box, Typography, Stack, Avatar, TextField, IconButton,
  Button, Chip, InputAdornment, CircularProgress, Tooltip,
  Badge, Popover, Fade, Menu, MenuItem, LinearProgress,
} from "@mui/material";
import {
  MessageSquare, Send, Search, CheckCheck, Paperclip,
  MoreVertical, Smile, ShieldCheck, ArrowLeft,
  Reply, Trash2, X, Image as ImageIcon, File, ZoomIn,
  AlertCircle, Clock,
} from "lucide-react";
import {
  fetchConversations, fetchConversationMessages, sendMessage,
  startOrGetConversation, setActiveConversation, markConversationRead,
  fetchUnreadMessageCount, addRealtimeMessage, toggleReaction,
  deleteMessage, uploadAttachment, setTypingUser, updateMessageReactions,
} from "./messageSlice";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const QUICK_RESPONSES = [
  "🔑 Credentials working!",
  "⚠️ Can you share the OTP?",
  "🔄 Renewal done.",
  "👍 All good, thanks!",
  "❓ Any issues with access?",
];

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

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
  if (diffHrs < 48) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function msgTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function dayLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, now)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

function isImageUrl(url) {
  if (!url) return false;
  const lc = url.toLowerCase();
  return lc.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/);
}

// ─── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)", display: "flex",
        alignItems: "center", justifyContent: "center",
        cursor: "zoom-out",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16, color: "#fff", background: "rgba(255,255,255,0.1)" }}
      >
        <X size={20} />
      </IconButton>
      <Box
        component="img"
        src={src}
        onClick={(e) => e.stopPropagation()}
        sx={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "12px", objectFit: "contain", cursor: "default", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
      />
    </Box>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────
function MessageBubble({ msg, activeConversation, onReact, onDelete, onReply, currentUserId }) {
  const [hovered, setHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [lightbox, setLightbox] = useState(false);

  const mine = msg.isMine;
  const deleted = msg.isDeleted;

  const reactions = msg.reactions || {};
  const hasReactions = Object.keys(reactions).length > 0;

  const isImage = msg.messageType === "IMAGE" || (msg.messageType !== "FILE" && isImageUrl(msg.attachmentUrl));
  const isFile = msg.messageType === "FILE" || (msg.attachmentUrl && !isImage);

  let bubbleBg, bubbleBorder, textColor;
  if (deleted) {
    bubbleBg = "rgba(39,39,42,0.5)";
    bubbleBorder = "1px dashed rgba(255,255,255,0.08)";
    textColor = "#52525b";
  } else if (mine) {
    bubbleBg = "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)";
    bubbleBorder = "none";
    textColor = "#fff";
  } else {
    bubbleBg = "rgba(39,39,42,0.95)";
    bubbleBorder = "1px solid rgba(255,255,255,0.07)";
    textColor = "#e4e4e7";
  }

  return (
    <>
      {lightbox && <Lightbox src={msg.attachmentUrl} onClose={() => setLightbox(false)} />}
      <Box
        sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", position: "relative" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); }}
      >
        {/* Other user avatar */}
        {!mine && (
          <Avatar
            src={activeConversation?.otherUserAvatar || ""}
            sx={{ width: 28, height: 28, fontSize: "0.65rem", fontWeight: 800,
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", mr: 1, mt: "auto",
              flexShrink: 0, alignSelf: "flex-end" }}
          >
            {activeConversation?.otherUserInitials || "?"}
          </Avatar>
        )}

        <Box sx={{ maxWidth: { xs: "82%", md: "62%" } }}>
          {/* Reply context */}
          {msg.replyToId && msg.replyToContent && (
            <Box sx={{
              mb: 0.5, px: 1.5, py: 0.8, borderRadius: "10px",
              background: mine ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.3)",
              borderLeft: "3px solid rgba(255,255,255,0.3)", cursor: "default",
            }}>
              <Typography sx={{ fontSize: "0.7rem", color: mine ? "rgba(255,255,255,0.7)" : "#6b7280", fontWeight: 700, mb: 0.2 }}>
                {msg.replyToSenderName || ""}
              </Typography>
              <Typography noWrap sx={{ fontSize: "0.78rem", color: mine ? "rgba(255,255,255,0.8)" : "#9ca3af" }}>
                {msg.replyToContent}
              </Typography>
            </Box>
          )}

          {/* Main bubble */}
          <Box
            sx={{
              px: isImage ? 0.5 : 2, py: isImage ? 0.5 : 1,
              borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: bubbleBg, color: textColor,
              boxShadow: mine && !deleted ? "0 4px 16px rgba(37,99,235,0.25)" : "0 2px 8px rgba(0,0,0,0.2)",
              border: bubbleBorder,
              position: "relative",
              overflow: isImage ? "hidden" : "visible",
            }}
          >
            {/* Image attachment */}
            {isImage && msg.attachmentUrl && !deleted && (
              <Box
                component="img"
                src={msg.attachmentUrl}
                onClick={() => setLightbox(true)}
                sx={{ display: "block", maxWidth: "100%", maxHeight: 280, borderRadius: "14px",
                  objectFit: "cover", cursor: "zoom-in", transition: "opacity 0.2s",
                  "&:hover": { opacity: 0.9 } }}
              />
            )}

            {/* File attachment */}
            {isFile && msg.attachmentUrl && !deleted && (
              <Box
                component="a"
                href={msg.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none",
                  px: 1.5, py: 1, borderRadius: "10px",
                  background: mine ? "rgba(255,255,255,0.1)" : "rgba(59,130,246,0.08)",
                  border: mine ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(59,130,246,0.15)",
                  transition: "background 0.2s", "&:hover": { background: mine ? "rgba(255,255,255,0.16)" : "rgba(59,130,246,0.14)" } }}
              >
                <Box sx={{ width: 36, height: 36, borderRadius: "8px",
                  background: mine ? "rgba(255,255,255,0.15)" : "rgba(59,130,246,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <File size={18} color={mine ? "#fff" : "#3b82f6"} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: mine ? "#fff" : "#e4e4e7" }} noWrap>
                    {msg.attachmentName || "File"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: mine ? "rgba(255,255,255,0.6)" : "#6b7280" }}>
                    Click to download
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Text content */}
            {(msg.content && (msg.messageType === "TEXT" || deleted || (!isImage && !isFile))) && (
              <Typography sx={{
                fontSize: "0.92rem", lineHeight: 1.55, wordBreak: "break-word",
                whiteSpace: "pre-wrap", fontStyle: deleted ? "italic" : "normal",
                color: deleted ? "#52525b" : textColor,
              }}>
                {deleted ? (
                  <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AlertCircle size={14} />
                    {msg.content}
                  </Box>
                ) : msg.content}
              </Typography>
            )}

            {/* Caption under image */}
            {isImage && msg.content && msg.content !== (msg.attachmentName || "Attachment") && !deleted && (
              <Typography sx={{ fontSize: "0.85rem", color: mine ? "#fff" : "#e4e4e7", px: 1, pt: 0.5, pb: 0.5 }}>
                {msg.content}
              </Typography>
            )}

            {/* Timestamp + read receipt */}
            <Stack direction="row" alignItems="center" justifyContent={mine ? "flex-end" : "flex-start"} spacing={0.4}
              sx={{ mt: isImage ? 0 : 0.5, px: isImage ? 1 : 0, pb: isImage ? 0.5 : 0, opacity: 0.75 }}>
              <Typography sx={{ fontSize: "0.63rem", color: mine ? "rgba(255,255,255,0.7)" : "#71717a" }}>
                {msgTime(msg.createdAt)}
              </Typography>
              {mine && !deleted && (
                <CheckCheck size={12} color={msg.isRead ? "#60a5fa" : "rgba(255,255,255,0.5)"} />
              )}
            </Stack>
          </Box>

          {/* Reactions row */}
          {hasReactions && !deleted && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5, px: 0.5 }}>
              {Object.entries(reactions).map(([emoji, count]) => (
                <Box
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  sx={{
                    display: "flex", alignItems: "center", gap: "3px",
                    px: 0.8, py: 0.3, borderRadius: "12px",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer", fontSize: "0.8rem",
                    transition: "all 0.15s", "&:hover": { background: "rgba(255,255,255,0.12)" },
                  }}
                >
                  <span>{emoji}</span>
                  <Typography sx={{ fontSize: "0.72rem", color: "#a1a1aa", fontWeight: 700 }}>{count}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Hover action bar */}
        <Fade in={hovered && !deleted}>
          <Stack
            direction={mine ? "row-reverse" : "row"}
            spacing={0.25}
            alignItems="center"
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [mine ? "left" : "right"]: mine ? "calc(100% + 40px)" : "calc(100% + 4px)",
              background: "rgba(18,18,22,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              p: 0.5,
              backdropFilter: "blur(12px)",
              zIndex: 10,
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {/* Emoji quick-react */}
            <Tooltip title="React">
              <IconButton size="small" sx={{ color: "#a1a1aa", p: 0.5, "&:hover": { color: "#fbbf24", background: "rgba(251,191,36,0.1)" } }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <Smile size={15} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reply">
              <IconButton size="small" sx={{ color: "#a1a1aa", p: 0.5, "&:hover": { color: "#60a5fa", background: "rgba(59,130,246,0.1)" } }}
                onClick={() => onReply(msg)}
              >
                <Reply size={15} />
              </IconButton>
            </Tooltip>
            {mine && (
              <Tooltip title="Delete">
                <IconButton size="small" sx={{ color: "#a1a1aa", p: 0.5, "&:hover": { color: "#f87171", background: "rgba(239,68,68,0.1)" } }}
                  onClick={() => onDelete(msg.id)}
                >
                  <Trash2 size={15} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Fade>

        {/* Emoji Reaction Picker */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          PaperProps={{
            sx: {
              background: "rgba(18,18,22,0.98)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px", p: 1, display: "flex", gap: 0.5,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
            },
          }}
        >
          {EMOJI_REACTIONS.map((emoji) => (
            <Box
              key={emoji}
              onClick={() => { onReact(msg.id, emoji); setAnchorEl(null); }}
              sx={{
                fontSize: "1.35rem", cursor: "pointer", p: 0.5, borderRadius: "8px",
                transition: "all 0.15s", "&:hover": { transform: "scale(1.3)", background: "rgba(255,255,255,0.08)" },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Popover>
      </Box>
    </>
  );
}

// ─── Date Divider ────────────────────────────────────────────────────────────
function DateDivider({ label }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 2 }}>
      <Box sx={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
      <Typography sx={{ fontSize: "0.72rem", color: "#52525b", fontWeight: 600, px: 1,
        background: "#0c0c0f", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", py: 0.3 }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
    </Stack>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────
function TypingIndicator({ name }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, py: 0.5 }}>
      <Box sx={{
        display: "flex", alignItems: "center", gap: "4px",
        px: 2, py: 1, borderRadius: "18px 18px 18px 4px",
        background: "rgba(39,39,42,0.95)", border: "1px solid rgba(255,255,255,0.07)",
      }}>
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{
            width: 6, height: 6, borderRadius: "50%", background: "#6b7280",
            animation: "typing-dot 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
            "@keyframes typing-dot": {
              "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.4 },
              "30%": { transform: "translateY(-5px)", opacity: 1 },
            },
          }} />
        ))}
      </Box>
      <Typography sx={{ fontSize: "0.72rem", color: "#52525b" }}>{name} is typing…</Typography>
    </Box>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Messages() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const recipientParam = searchParams.get("recipientId");
  const listingParam = searchParams.get("listingId");

  const { conversations, activeConversation, messages, sending, uploading, typingUsers, messagesLoading } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth || {});

  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  // Initial load
  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchUnreadMessageCount());
  }, [dispatch]);

  // Handle recipientId param
  useEffect(() => {
    if (!recipientParam) return;
    dispatch(startOrGetConversation({
      recipientId: Number(recipientParam),
      listingId: listingParam ? Number(listingParam) : null,
    })).then((res) => {
      if (res.payload?.id) dispatch(fetchConversationMessages(res.payload.id));
    });
  }, [recipientParam, listingParam, dispatch]);

  // WebSocket
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
            const data = JSON.parse(frame.body);
            if (data.deleted) {
              dispatch(updateMessageReactions({ messageId: data.messageId, reactions: {} }));
            } else {
              dispatch(addRealtimeMessage(data));
              dispatch(fetchUnreadMessageCount());
            }
          }
        });
        client.subscribe("/user/queue/reactions", (frame) => {
          if (frame.body) {
            const data = JSON.parse(frame.body);
            dispatch(updateMessageReactions(data));
          }
        });
      },
      onStompError: (frame) => console.error("STOMP error:", frame.headers["message"]),
    });
    client.activate();
    stompClientRef.current = client;
    return () => stompClientRef.current?.deactivate();
  }, [user, dispatch]);

  // Subscribe to typing for active conversation
  useEffect(() => {
    if (!activeConversation || !stompClientRef.current?.connected) return;
    const sub = stompClientRef.current.subscribe(
      `/topic/typing/${activeConversation.id}`,
      (frame) => {
        if (frame.body) {
          const data = JSON.parse(frame.body);
          if (data.senderId !== user?.id) {
            dispatch(setTypingUser({ ...data, conversationId: activeConversation.id }));
            // Clear after 3 seconds of no updates
            setTimeout(() => {
              dispatch(setTypingUser({ conversationId: activeConversation.id, senderId: null, senderName: null, typing: false }));
            }, 3000);
          }
        }
      }
    );
    return () => sub?.unsubscribe();
  }, [activeConversation?.id, dispatch]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conv) => {
    dispatch(setActiveConversation(conv));
    dispatch(fetchConversationMessages(conv.id));
    dispatch(markConversationRead(conv.id));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendTypingEvent = useCallback((typing) => {
    if (!activeConversation || !stompClientRef.current?.connected) return;
    if (typing === isTypingRef.current) return;
    isTypingRef.current = typing;
    stompClientRef.current.publish({
      destination: "/app/typing",
      body: JSON.stringify({ conversationId: activeConversation.id, typing }),
    });
  }, [activeConversation]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    sendTypingEvent(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => sendTypingEvent(false), 2000);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !activeConversation || sending) return;
    sendTypingEvent(false);
    clearTimeout(typingTimerRef.current);
    setInputText("");
    const payload = {
      conversationId: activeConversation.id,
      content: text,
      messageType: "TEXT",
    };
    if (replyTo) { payload.replyToId = replyTo.id; setReplyTo(null); }
    await dispatch(sendMessage(payload));
    dispatch(fetchConversations());
    inputRef.current?.focus();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation) return;
    e.target.value = "";
    const isImg = file.type.startsWith("image/");
    const result = await dispatch(uploadAttachment(file));
    if (result.payload?.url) {
      const payload = {
        conversationId: activeConversation.id,
        content: file.name,
        messageType: isImg ? "IMAGE" : "FILE",
        attachmentUrl: result.payload.url,
        attachmentName: result.payload.name || file.name,
      };
      if (replyTo) { payload.replyToId = replyTo.id; setReplyTo(null); }
      await dispatch(sendMessage(payload));
      dispatch(fetchConversations());
    }
  };

  const handleReact = (messageId, emoji) => {
    dispatch(toggleReaction({ messageId, emoji }));
  };

  const handleDelete = (messageId) => {
    dispatch(deleteMessage(messageId));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filtered = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.otherUserName?.toLowerCase().includes(q) || c.listingTitle?.toLowerCase().includes(q) || c.lastMessage?.toLowerCase().includes(q);
  });

  // Deduplicate: keep only the most recent conversation per other user
  const deduped = Object.values(
    filtered.reduce((acc, conv) => {
      const existing = acc[conv.otherUserId];
      if (!existing || new Date(conv.lastMessageAt) > new Date(existing.lastMessageAt)) {
        acc[conv.otherUserId] = conv;
      }
      return acc;
    }, {})
  ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

  const typingUser = activeConversation ? typingUsers[activeConversation.id] : null;

  const borderColor = "rgba(255,255,255,0.06)";

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%", overflow: "hidden", background: "#09090b" }}>

      {/* ── SIDEBAR ── */}
      <Box sx={{
        width: { xs: "100%", md: 320 }, flexShrink: 0,
        display: { xs: activeConversation ? "none" : "flex", md: "flex" },
        flexDirection: "column", borderRight: `1px solid ${borderColor}`,
        background: "rgba(9,9,11,0.98)", overflow: "hidden",
      }}>
        {/* Header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2, borderBottom: `1px solid ${borderColor}` }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Messages
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {conversations.length > 0 && (
                <Chip label={conversations.reduce((a, c) => a + (c.unreadCount || 0), 0) || null}
                  size="small"
                  sx={{ height: 20, fontSize: "0.68rem", fontWeight: 800, background: "#2563eb", color: "#fff",
                    display: conversations.reduce((a, c) => a + (c.unreadCount || 0), 0) > 0 ? "flex" : "none" }}
                />
              )}
            </Box>
          </Stack>
          <TextField fullWidth size="small" placeholder="Search conversations…"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={15} color="#52525b" /></InputAdornment>,
              sx: {
                borderRadius: "12px", background: "rgba(255,255,255,0.04)",
                "& fieldset": { border: "1px solid rgba(255,255,255,0.08)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.14) !important" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6 !important" },
                input: { color: "#e4e4e7", fontSize: "0.88rem", py: "8px" },
              },
            }}
          />
        </Box>

        {/* Conversation list */}
        <Box sx={{ flex: 1, overflowY: "auto", py: 1,
          "&::-webkit-scrollbar": { width: 3 },
          "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.07)", borderRadius: 4 } }}>
          {deduped.length === 0 ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <MessageSquare size={36} color="#27272a" strokeWidth={1} style={{ margin: "0 auto 12px" }} />
              <Typography sx={{ fontSize: "0.85rem", color: "#3f3f46" }}>No conversations yet</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#27272a", mt: 0.5 }}>
                Message a host from any listing
              </Typography>
            </Box>
          ) : (
            deduped.map((conv) => {
              const active = activeConversation?.id === conv.id;
              const unread = conv.unreadCount > 0;
              return (
                <Box key={conv.id} onClick={() => handleSelectConversation(conv)} sx={{
                  mx: 1.5, mb: 0.5, px: 2, py: 1.5, borderRadius: "14px", cursor: "pointer",
                  background: active ? "rgba(59,130,246,0.1)" : "transparent",
                  border: "1px solid", borderColor: active ? "rgba(59,130,246,0.2)" : "transparent",
                  transition: "all 0.15s",
                  "&:hover": { background: active ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.03)" },
                }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Badge color="success" variant="dot" overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      invisible={!active}
                      sx={{ "& .MuiBadge-badge": { width: 9, height: 9, border: "2px solid #09090b" } }}>
                      <Avatar src={conv.otherUserAvatar || ""}
                        sx={{ width: 44, height: 44, fontSize: "0.9rem", fontWeight: 800,
                          background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                          outline: active ? "2px solid rgba(59,130,246,0.4)" : "none", outlineOffset: 2 }}>
                        {conv.otherUserInitials || "?"}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography noWrap sx={{ fontWeight: unread ? 800 : 600, fontSize: "0.9rem", color: active ? "#fff" : "#e4e4e7" }}>
                          {conv.otherUserName || "Member"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: unread ? "#60a5fa" : "#3f3f46", flexShrink: 0, ml: 1 }}>
                          {timeAgo(conv.lastMessageAt)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.25}>
                        <Typography noWrap sx={{ fontSize: "0.78rem", color: unread ? "#a1a1aa" : "#3f3f46", fontWeight: unread ? 600 : 400, flex: 1 }}>
                          {conv.lastMessage || "Tap to start chatting"}
                        </Typography>
                        {unread && (
                          <Box sx={{ ml: 1, minWidth: 20, height: 20, borderRadius: "10px", background: "#2563eb",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, px: 0.5 }}>
                            <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, color: "#fff" }}>
                              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                      {conv.listingTitle && conv.listingTitle !== "Direct Support Chat" && (
                        <Typography noWrap sx={{ fontSize: "0.68rem", color: "#3b82f6", mt: 0.2, opacity: 0.8 }}>
                          Re: {conv.listingTitle}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      {/* ── CHAT PANEL ── */}
      <Box sx={{
        flex: 1, minWidth: 0,
        display: { xs: activeConversation ? "flex" : "none", md: "flex" },
        flexDirection: "column", overflow: "hidden", background: "#0c0c0f",
      }}>
        {activeConversation ? (
          <>
            {/* Chat header */}
            <Box sx={{
              px: 3, py: 1.5, borderBottom: `1px solid ${borderColor}`,
              background: "rgba(12,12,15,0.97)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
            }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton onClick={() => dispatch(setActiveConversation(null))}
                  sx={{ display: { xs: "flex", md: "none" }, color: "#a1a1aa", p: 0.5 }}>
                  <ArrowLeft size={20} />
                </IconButton>
                <Box sx={{ position: "relative" }}>
                  <Avatar src={activeConversation.otherUserAvatar || ""}
                    sx={{ width: 42, height: 42, fontWeight: 800, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", fontSize: "0.9rem" }}>
                    {activeConversation.otherUserInitials || "?"}
                  </Avatar>
                  <Box sx={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10,
                    borderRadius: "50%", background: "#22c55e", border: "2px solid #0c0c0f" }} />
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.97rem", color: "#fff" }}>
                      {activeConversation.otherUserName}
                    </Typography>
                    <Chip icon={<ShieldCheck size={10} color="#10b981" />} label="Verified" size="small"
                      sx={{ height: 17, fontSize: "0.65rem", fontWeight: 700,
                        background: "rgba(16,185,129,0.08)", color: "#10b981",
                        "& .MuiChip-label": { px: "5px" }, "& .MuiChip-icon": { ml: "5px" } }}
                    />
                  </Stack>
                  {activeConversation.listingTitle && (
                    <Typography sx={{ fontSize: "0.72rem", color: "#52525b" }}>
                      Re: <span style={{ color: "#3b82f6" }}>{activeConversation.listingTitle}</span>
                    </Typography>
                  )}
                </Box>
              </Stack>

            </Box>

            {/* Upload progress */}
            {uploading && <LinearProgress sx={{ height: 2, "& .MuiLinearProgress-bar": { background: "#3b82f6" }, background: "rgba(59,130,246,0.1)" }} />}

            {/* Message stream */}
            <Box sx={{
              flex: 1, overflowY: "auto", px: { xs: 2, md: 4 }, py: 3,
              display: "flex", flexDirection: "column", gap: 0.25,
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.07)", borderRadius: 4 },
            }}>
              {/* Safety banner */}
              <Box sx={{ mx: "auto", mb: 2.5, px: 3, py: 1.2, borderRadius: "12px",
                background: "rgba(245,158,11,0.05)", border: "1px dashed rgba(245,158,11,0.2)",
                textAlign: "center", maxWidth: 440 }}>
                <Typography sx={{ fontSize: "0.75rem", color: "#92400e", fontWeight: 600 }}>
                  🛡️ Escrow protected · Moderated for fraud prevention
                </Typography>
              </Box>

              {messagesLoading ? (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CircularProgress size={28} sx={{ color: "#3b82f6" }} />
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare size={28} color="#3b82f6" strokeWidth={1.5} />
                  </Box>
                  <Typography sx={{ color: "#52525b", fontSize: "0.9rem", fontWeight: 600 }}>No messages yet</Typography>
                  <Typography sx={{ color: "#3f3f46", fontSize: "0.8rem" }}>Say hello 👋</Typography>
                </Box>
              ) : (
                messages.map((msg, idx) => {
                  const prevMsg = messages[idx - 1];
                  const showDateDivider = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);
                  return (
                    <Box key={msg.id}>
                      {showDateDivider && <DateDivider label={dayLabel(msg.createdAt)} />}
                      <Box sx={{ mt: prevMsg && prevMsg.isMine === msg.isMine ? 0.3 : 1.5 }}>
                        <MessageBubble
                          msg={msg}
                          activeConversation={activeConversation}
                          onReact={handleReact}
                          onDelete={handleDelete}
                          onReply={setReplyTo}
                          currentUserId={user?.id}
                        />
                      </Box>
                    </Box>
                  );
                })
              )}

              {typingUser && <TypingIndicator name={typingUser.senderName} />}
              <div ref={chatEndRef} />
            </Box>

            {/* Input area */}
            <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderTop: `1px solid ${borderColor}`,
              background: "rgba(9,9,11,0.98)", flexShrink: 0 }}>
              {/* Reply banner */}
              {replyTo && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, px: 1.5, py: 1,
                  borderRadius: "10px", background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.15)", borderLeft: "3px solid #3b82f6" }}>
                  <Reply size={14} color="#3b82f6" />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#3b82f6", fontWeight: 700 }}>
                      Replying to {replyTo.isMine ? "yourself" : activeConversation.otherUserName}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: "0.78rem", color: "#6b7280" }}>
                      {replyTo.content}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => setReplyTo(null)} sx={{ color: "#52525b", p: 0.25 }}>
                    <X size={14} />
                  </IconButton>
                </Box>
              )}

              {/* Quick responses */}
              <Stack direction="row" spacing={0.75} sx={{ mb: 1.5, overflowX: "auto",
                "&::-webkit-scrollbar": { display: "none" } }}>
                {QUICK_RESPONSES.map((r, i) => (
                  <Chip key={i} label={r} size="small" onClick={() => setInputText(r)} sx={{
                    flexShrink: 0, fontSize: "0.75rem", height: 26,
                    background: "rgba(255,255,255,0.04)", color: "#71717a",
                    border: "1px solid rgba(255,255,255,0.07)",
                    "&:hover": { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.2)", color: "#93c5fd" },
                    cursor: "pointer", transition: "all 0.15s",
                  }} />
                ))}
              </Stack>

              {/* Input row */}
              <Box component="form" onSubmit={handleSend} sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                <Tooltip title="Attach photo or file">
                  <IconButton onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    sx={{ color: "#52525b", flexShrink: 0, mb: 0.5,
                      "&:hover": { color: "#3b82f6", background: "rgba(59,130,246,0.08)" } }}>
                    {uploading ? <CircularProgress size={18} sx={{ color: "#3b82f6" }} /> : <Paperclip size={19} />}
                  </IconButton>
                </Tooltip>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                  style={{ display: "none" }} onChange={handleFileSelect} />

                <TextField
                  inputRef={inputRef} fullWidth multiline maxRows={5}
                  value={inputText} onChange={handleInputChange} onKeyDown={handleKeyDown}
                  placeholder="Message…"
                  InputProps={{
                    sx: {
                      borderRadius: "16px", background: "rgba(255,255,255,0.04)", color: "#e4e4e7",
                      fontSize: "0.9rem",
                      "& fieldset": { border: "1px solid rgba(255,255,255,0.08)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15) !important" },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6 !important" },
                    },
                  }}
                />

                <Button type="submit" disabled={!inputText.trim() || sending}
                  sx={{
                    flexShrink: 0, minWidth: 46, width: 46, height: 46, borderRadius: "50%",
                    mb: 0.25, p: 0,
                    background: inputText.trim() ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "rgba(255,255,255,0.06)",
                    "&:hover": { background: "linear-gradient(135deg,#2563eb,#1d4ed8)", transform: "scale(1.05)" },
                    "&.Mui-disabled": { background: "rgba(255,255,255,0.05)" },
                    transition: "all 0.15s ease",
                  }}>
                  {sending ? <CircularProgress size={17} sx={{ color: "#fff" }} /> :
                    <Send size={17} color={inputText.trim() ? "#fff" : "#3f3f46"} style={{ marginLeft: 2 }} />}
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          /* Empty state — desktop */
          <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 2, p: 4, textAlign: "center" }}>
            <Box sx={{ width: 96, height: 96, borderRadius: "28px",
              background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(37,99,235,0.04))",
              border: "1px solid rgba(59,130,246,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={42} color="#3b82f6" strokeWidth={1.2} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, color: "#e4e4e7", letterSpacing: "-0.02em", mb: 1 }}>
                Your messages
              </Typography>
              <Typography sx={{ color: "#52525b", maxWidth: 340, lineHeight: 1.7, fontSize: "0.88rem" }}>
                Select a conversation to read and reply, or click <strong style={{ color: "#60a5fa" }}>Message Host</strong> on any listing.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent="center">
              {[["🔒", "Moderated"], ["⚡", "Real-time"], ["📎", "File sharing"], ["😊", "Reactions"]].map(([icon, label]) => (
                <Box key={label} sx={{ px: 1.5, py: 0.8, borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Typography sx={{ fontSize: "0.78rem", color: "#52525b" }}>{icon} {label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
