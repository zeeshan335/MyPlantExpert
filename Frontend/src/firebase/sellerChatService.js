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
} from "firebase/firestore";

// Send seller message
export const sendSellerMessage = async (messageData) => {
  try {
    const messagesRef = collection(db, "sellerMessages");
    await addDoc(messagesRef, {
      ...messageData,
      timestamp: new Date().toISOString(),
      isRead: false,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending seller message:", error);
    return { success: false };
  }
};

// Get seller conversations
export const getSellerConversations = async (sellerId) => {
  try {
    const messagesRef = collection(db, "sellerMessages");
    const q = query(messagesRef, where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);

    const conversations = {};
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const userEmail = data.userEmail;

      if (!conversations[userEmail]) {
        conversations[userEmail] = {
          userEmail,
          userName: data.userName,
          productName: data.productName,
          messages: [],
          unreadCount: 0,
          lastMessage: null,
        };
      }

      conversations[userEmail].messages.push({
        id: doc.id,
        ...data,
      });

      if (!data.isRead && data.sender === "user") {
        conversations[userEmail].unreadCount++;
      }

      if (!conversations[userEmail].lastMessage) {
        conversations[userEmail].lastMessage = data;
      }
    });

    // Sort messages
    Object.values(conversations).forEach((conv) => {
      conv.messages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    });

    return Object.values(conversations);
  } catch (error) {
    console.error("Error getting seller conversations:", error);
    return [];
  }
};
