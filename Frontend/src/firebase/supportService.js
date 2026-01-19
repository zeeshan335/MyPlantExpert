import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// Send a support message
export const sendSupportMessage = async (messageData) => {
  try {
    const messagesRef = collection(db, "supportMessages");
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: new Date().toISOString(),
      isRead: false,
    });
    console.log("✅ Support message sent successfully, ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error sending support message:", error);
    return { success: false, error: error.message };
  }
};

// Get support messages for a user
export const getSupportMessages = async (userEmail) => {
  try {
    const messagesRef = collection(db, "supportMessages");
    const q = query(messagesRef, where("userEmail", "==", userEmail));

    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by timestamp ascending (oldest first)
    messages.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });

    console.log(
      "✅ Loaded messages for user:",
      userEmail,
      "Count:",
      messages.length
    );
    console.log("Messages:", messages);
    return messages;
  } catch (error) {
    console.error("❌ Error getting support messages:", error);
    return [];
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, "supportMessages", messageId);
    await updateDoc(messageRef, {
      isRead: true,
      readAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("❌ Error marking message as read:", error);
    return { success: false };
  }
};

// Get all support conversations (for admin)
export const getAllSupportConversations = async () => {
  try {
    const messagesRef = collection(db, "supportMessages");
    const querySnapshot = await getDocs(messagesRef);

    // Group messages by user
    const conversations = {};
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const userEmail = data.userEmail;

      if (!conversations[userEmail]) {
        conversations[userEmail] = {
          userEmail,
          userName: data.sender === "user" ? data.userName : null,
          messages: [],
          unreadCount: 0,
          lastMessage: null,
          lastMessageTime: null,
        };
      }

      // Update userName if this is a user message and we don't have it yet
      if (
        data.sender === "user" &&
        data.userName &&
        !conversations[userEmail].userName
      ) {
        conversations[userEmail].userName = data.userName;
      }

      const message = {
        id: doc.id,
        ...data,
      };

      conversations[userEmail].messages.push(message);

      // Count unread messages from user
      if (!data.isRead && data.sender === "user") {
        conversations[userEmail].unreadCount++;
      }

      // Update last message
      if (
        !conversations[userEmail].lastMessageTime ||
        new Date(data.timestamp) >
          new Date(conversations[userEmail].lastMessageTime)
      ) {
        conversations[userEmail].lastMessage = data;
        conversations[userEmail].lastMessageTime = data.timestamp;
      }
    });

    // Sort messages within each conversation
    Object.values(conversations).forEach((conv) => {
      conv.messages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    });

    // Convert to array and sort by last message time
    const conversationsArray = Object.values(conversations).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    console.log("✅ Loaded conversations:", conversationsArray.length);
    return conversationsArray;
  } catch (error) {
    console.error("❌ Error getting conversations:", error);
    return [];
  }
};

// Mark all unread messages in a conversation as read
export const markConversationAsRead = async (userEmail) => {
  try {
    const messagesRef = collection(db, "supportMessages");
    const q = query(
      messagesRef,
      where("userEmail", "==", userEmail),
      where("sender", "==", "user"),
      where("isRead", "==", false)
    );

    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map((document) =>
      updateDoc(doc(db, "supportMessages", document.id), {
        isRead: true,
        readAt: new Date().toISOString(),
      })
    );

    await Promise.all(updatePromises);
    console.log(
      `✅ Marked ${updatePromises.length} messages as read for ${userEmail}`
    );
    return { success: true, count: updatePromises.length };
  } catch (error) {
    console.error("❌ Error marking conversation as read:", error);
    return { success: false, error: error.message };
  }
};

// Real-time listener for conversation messages
export const subscribeToConversation = (userEmail, callback) => {
  try {
    const messagesRef = collection(db, "supportMessages");
    const q = query(messagesRef, where("userEmail", "==", userEmail));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by timestamp ascending (oldest first)
      messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      callback(messages);
    });

    return unsubscribe;
  } catch (error) {
    console.error("❌ Error subscribing to conversation:", error);
    return () => {}; // Return empty unsubscribe function
  }
};
