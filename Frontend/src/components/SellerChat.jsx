import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { sendSellerMessage } from "../firebase/sellerChatService";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./SellerChat.css";

const SellerChat = ({ sellerId, sellerName, productName, onClose }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const messagesRef = collection(db, "sellerMessages");
      const q = query(
        messagesRef,
        where("sellerId", "==", sellerId),
        where("userEmail", "==", currentUser.email),
        where("productName", "==", productName)
      );

      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await sendSellerMessage({
        sellerId,
        sellerName,
        userEmail: currentUser.email,
        userName: currentUser.displayName || "User",
        productName,
        message: newMessage,
        sender: "user",
      });
      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-chat-modal">
      <div className="seller-chat-content">
        <div className="seller-chat-header">
          <div>
            <h3>Chat with {sellerName}</h3>
            <p>Product: {productName}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="seller-chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h4>👋 Start a conversation!</h4>
              <p>Ask the seller about this product</p>
            </div>
          ) : (
            <div style={{ padding: "1rem" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    width: "100%",
                    marginBottom: "1rem",
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
                    }}
                  >
                    <p style={{ margin: "0 0 0.5rem 0" }}>{msg.message}</p>
                    <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form className="seller-chat-input" onSubmit={handleSend}>
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
    </div>
  );
};

export default SellerChat;
