import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import {
  sendSupportMessage,
  getSupportMessages,
  markMessageAsRead,
} from "../firebase/supportService";
import "./CustomerSupport.css";

const CustomerSupport = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser && isChatOpen) {
      console.log("💬 Chat opened, loading messages for:", currentUser.email);
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [currentUser, isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const msgs = await getSupportMessages(currentUser.email);
      console.log("📩 Messages received in component:", msgs);
      setMessages(msgs);

      // Mark unread admin messages as read
      msgs.forEach((msg) => {
        if (!msg.isRead && msg.sender === "admin") {
          markMessageAsRead(msg.id);
        }
      });
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setLoading(true);

    try {
      const result = await sendSupportMessage({
        userEmail: currentUser.email,
        userName: currentUser.displayName || "User",
        message: messageText,
        sender: "user",
      });

      console.log("✅ Message sent result:", result);

      if (result.success) {
        await loadMessages();
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert("Failed to send message. Please try again.");
      setNewMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  const getUnreadCount = () => {
    return messages.filter((msg) => !msg.isRead && msg.sender === "admin")
      .length;
  };

  // Only show on user dashboard
  if (location.pathname !== "/dashboard") {
    return null;
  }

  if (!currentUser) {
    return null;
  }

  console.log("🎨 Rendering chat with messages:", messages.length);

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <span className="chat-icon">💬</span>
        {getUnreadCount() > 0 && (
          <span className="unread-badge">{getUnreadCount()}</span>
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <h3>Customer Support</h3>
              <p>We're here to help you</p>
            </div>
            <button
              className="close-chat-btn"
              onClick={() => setIsChatOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chat-messages">
            <div style={{ padding: "1rem" }}>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                Messages: {messages.length}
              </p>
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <h4>👋 Welcome to Support Chat!</h4>
                  <p>How can we help you today?</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {messages.map((msg) => {
                    console.log("🟢 Rendering message in UI:", msg);
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: "flex",
                          justifyContent:
                            msg.sender === "user" ? "flex-end" : "flex-start",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "75%",
                            padding: "0.8rem 1rem",
                            borderRadius: "12px",
                            background:
                              msg.sender === "user"
                                ? "linear-gradient(135deg, #0f2d1a 0%, #1a4d2e 100%)"
                                : "#f5f5f5",
                            color: msg.sender === "user" ? "white" : "#333",
                            borderBottomRightRadius:
                              msg.sender === "user" ? "4px" : "12px",
                            borderBottomLeftRadius:
                              msg.sender === "admin" ? "4px" : "12px",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 0.5rem 0",
                              wordWrap: "break-word",
                              lineHeight: "1.5",
                            }}
                          >
                            {msg.message}
                          </p>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              opacity: 0.7,
                              display: "block",
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !newMessage.trim()}>
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CustomerSupport;
