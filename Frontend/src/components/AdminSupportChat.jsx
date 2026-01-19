import React, { useState, useEffect } from "react";
import {
  getAllSupportConversations,
  sendSupportMessage,
  markConversationAsRead,
  subscribeToConversation,
} from "../firebase/supportService";
import "./AdminSupportChat.css";

const AdminSupportChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
    // Poll every 5 seconds for new messages
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Real-time listener for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = subscribeToConversation(
      selectedConversation.userEmail,
      (messages) => {
        // Update the selected conversation with new messages
        setSelectedConversation((prev) => ({
          ...prev,
          messages: messages,
        }));
      }
    );

    return () => unsubscribe();
  }, [selectedConversation?.userEmail]);

  const loadConversations = async () => {
    const convos = await getAllSupportConversations();
    setConversations(convos);

    // Update selected conversation if it exists
    if (selectedConversation) {
      const updated = convos.find(
        (c) => c.userEmail === selectedConversation.userEmail
      );
      if (updated) {
        setSelectedConversation(updated);
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      await sendSupportMessage({
        userEmail: selectedConversation.userEmail,
        userName: "Support Team",
        message: replyMessage,
        sender: "admin",
      });
      setReplyMessage("");
      await loadConversations();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const getTotalUnread = () => {
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    // Mark all unread user messages as read when conversation is opened
    if (conv.unreadCount > 0) {
      await markConversationAsRead(conv.userEmail);
      // Reload conversations to update unread counts
      await loadConversations();
    }
  };

  return (
    <div className="admin-support-chat">
      <h2>Customer Support Messages</h2>
      {getTotalUnread() > 0 && (
        <div className="unread-indicator">
          {getTotalUnread()} unread message(s)
        </div>
      )}

      <div className="support-layout">
        <div className="conversations-list">
          <h3>Conversations</h3>
          {conversations.map((conv) => (
            <div
              key={conv.userEmail}
              className={`conversation-item ${
                selectedConversation?.userEmail === conv.userEmail
                  ? "active"
                  : ""
              }`}
              onClick={() => handleSelectConversation(conv)}
            >
              <div className="conv-info">
                <strong>{conv.userName}</strong>
                <p>{conv.userEmail}</p>
                {conv.lastMessage && (
                  <small>
                    {new Date(conv.lastMessage.timestamp).toLocaleString()}
                  </small>
                )}
              </div>
              {conv.unreadCount > 0 && (
                <span className="unread-count">{conv.unreadCount}</span>
              )}
            </div>
          ))}
        </div>

        <div className="messages-panel">
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <h3>{selectedConversation.userName}</h3>
                <p>{selectedConversation.userEmail}</p>
              </div>

              <div className="messages-container">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${
                      msg.sender === "admin" ? "admin" : "user"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <small>{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>

              <form className="reply-form" onSubmit={handleSendReply}>
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  disabled={loading}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupportChat;
