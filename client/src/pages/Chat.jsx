import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { generateAvatarUrl, formatLastSeen, isOnline, getCompatibilityColor } from "../utils/constants";
import "./Chat.css";

let socket;

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  // Connect socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { auth: { token } });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("userTyping", ({ userId, isTyping }) => {
      if (userId !== user?._id) setOtherTyping(isTyping);
    });

    return () => socket.disconnect();
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    api.get("/chat/conversations/all")
      .then((res) => setConversations(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Open conversation
  const openChat = async (match) => {
    setActiveMatch(match);
    setMessages([]);
    try {
      const res = await api.get(`/chat/${match._id}/messages`);
      setMessages(res.data);
    } catch {}
  };

  const getOtherUser = (match) => match.users?.find((u) => u._id !== user?._id);

  const sendMessage = () => {
    if (!msg.trim() || !activeMatch) return;
    const other = getOtherUser(activeMatch);
    socket.emit("sendMessage", {
      receiverId: other?._id,
      matchId: activeMatch._id,
      content: msg,
    });
    setMsg("");
  };

  const handleTyping = (e) => {
    setMsg(e.target.value);
    const other = getOtherUser(activeMatch);
    if (!other) return;
    socket.emit("typing", { receiverId: other._id, isTyping: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", { receiverId: other._id, isTyping: false });
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const activeOther = activeMatch ? getOtherUser(activeMatch) : null;

  return (
    <div className="page chat-page">
      <div className="chat-layout">
        {/* Sidebar */}
        <aside className="chat-sidebar glass">
          <div className="chat-sidebar-header">
            <h3>Messages</h3>
            <span className="badge badge-primary">{conversations.length}</span>
          </div>
          <div className="conversations-list">
            {loading ? (
              Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="conv-item">
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="skeleton" style={{ height: 14, width: "60%" }} />
                    <div className="skeleton" style={{ height: 12, width: "80%" }} />
                  </div>
                </div>
              ))
            ) : conversations.length === 0 ? (
              <div className="no-conversations">
                <p>💜</p>
                <p>No matches yet.</p>
                <p>Explore and like profiles!</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherUser(conv);
                return (
                  <div
                    key={conv._id}
                    className={`conv-item ${activeMatch?._id === conv._id ? "active" : ""}`}
                    onClick={() => openChat(conv)}
                  >
                    <div className="conv-avatar-wrap">
                      <img
                        src={other?.profilePhoto || generateAvatarUrl(other?.name)}
                        alt={other?.name}
                        className="avatar avatar-md"
                      />
                      {isOnline(other?.lastSeen) && <div className="conv-online-dot" />}
                    </div>
                    <div className="conv-info">
                      <div className="conv-name-row">
                        <span className="conv-name">{other?.name}</span>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                      <span className="conv-last-msg">
                        {conv.lastMessage || "Say hello! 👋"}
                      </span>
                      {conv.compatibilityScore > 0 && (
                        <span className="compat-mini" style={{ color: getCompatibilityColor(conv.compatibilityScore) }}>
                          {conv.compatibilityScore}% compatible
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat window */}
        <main className="chat-main">
          {!activeMatch ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a match from the left to start chatting</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="chat-header glass">
                <img
                  src={activeOther?.profilePhoto || generateAvatarUrl(activeOther?.name)}
                  alt={activeOther?.name}
                  className="avatar avatar-md"
                />
                <div className="chat-header-info">
                  <div className="chat-header-name">
                    {activeOther?.name}
                    {activeOther?.isVerified && <span className="badge badge-verified" style={{ fontSize: "0.65rem" }}>✓</span>}
                  </div>
                  <div className="chat-header-status">
                    {otherTyping ? (
                      <span style={{ color: "var(--primary-light)" }}>typing...</span>
                    ) : isOnline(activeOther?.lastSeen) ? (
                      <span style={{ color: "#34d399" }}>🟢 Online</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Last seen {formatLastSeen(activeOther?.lastSeen)}</span>
                    )}
                  </div>
                </div>
                {activeMatch.compatibilityScore > 0 && (
                  <div
                    className="chat-compat"
                    style={{ color: getCompatibilityColor(activeMatch.compatibilityScore) }}
                  >
                    {activeMatch.compatibilityScore}% match
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="messages-area">
                {messages.length === 0 && (
                  <div className="messages-empty">
                    <p>🎉 You matched!</p>
                    <p>Say hi to {activeOther?.name} — don't be shy!</p>
                    <div className="icebreakers">
                      {[
                        `Hey ${activeOther?.name}! 👋`,
                        "What are you up to this weekend?",
                        "What kind of places do you like?",
                      ].map((ice, i) => (
                        <button key={i} className="icebreaker-btn" onClick={() => { setMsg(ice); }}>
                          {ice}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => {
                  const isMine = m.sender?._id === user?._id || m.sender === user?._id;
                  return (
                    <div key={i} className={`message ${isMine ? "mine" : "theirs"}`}>
                      {!isMine && (
                        <img
                          src={activeOther?.profilePhoto || generateAvatarUrl(activeOther?.name)}
                          alt=""
                          className="avatar avatar-sm msg-avatar"
                        />
                      )}
                      <div className={`message-bubble ${isMine ? "mine" : "theirs"}`}>
                        <p>{m.content}</p>
                        <span className="msg-time">
                          {new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          {isMine && <span className="read-tick">{m.isRead ? " ✓✓" : " ✓"}</span>}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {otherTyping && (
                  <div className="message theirs">
                    <img src={activeOther?.profilePhoto || generateAvatarUrl(activeOther?.name)} alt="" className="avatar avatar-sm msg-avatar" />
                    <div className="message-bubble theirs typing-indicator">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area glass">
                <textarea
                  className="chat-input"
                  placeholder={`Message ${activeOther?.name}...`}
                  value={msg}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button className="send-btn btn btn-primary btn-sm" onClick={sendMessage} disabled={!msg.trim()}>
                  ↑
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}