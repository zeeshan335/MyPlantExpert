import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Get all products from Firestore
export const getProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      reviews: doc.data().reviews || [],
    }));

    console.log("✅ Fetched products from Firestore:", products.length);
    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

// Add product (for both admin and sellers)
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, "products");
    const docRef = await addDoc(productsRef, {
      ...productData,
      reviews: [],
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Product added with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return { success: false, error: error.message };
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Product updated:", productId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return { success: false, error: error.message };
  }
};

// Delete product with reason (admin only)
export const deleteProduct = async (
  productId,
  reason,
  sellerId,
  sellerName
) => {
  try {
    // Save deletion notification for seller
    if (sellerId) {
      await addDoc(collection(db, "sellerNotifications"), {
        sellerId: sellerId,
        sellerName: sellerName,
        productId: productId,
        reason: reason,
        type: "product_deleted",
        createdAt: new Date().toISOString(),
        read: false,
      });
    }

    // Delete the product
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);

    console.log("✅ Product deleted:", productId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return { success: false, error: error.message };
  }
};

// Delete all products
export const deleteAllProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);

    console.log("✅ All products deleted");
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting all products:", error);
    return { success: false, error: error.message };
  }
};

// Add review to product
export const addReviewToProduct = async (productId, review) => {
  try {
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const currentReviews = productDoc.data().reviews || [];
      const updatedReviews = [...currentReviews, review];

      await updateDoc(productRef, {
        reviews: updatedReviews,
      });

      console.log("✅ Review added to product:", productId);
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Error adding review:", error);
    return false;
  }
};

// Save cart
export const saveCart = async (userEmail, cart) => {
  try {
    const cartRef = doc(db, "carts", userEmail);
    await setDoc(cartRef, { items: cart, updatedAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("❌ Error saving cart:", error);
    return false;
  }
};

// Get cart
export const getCart = async (userEmail) => {
  try {
    const cartRef = doc(db, "carts", userEmail);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      return cartDoc.data().items || [];
    }

    return [];
  } catch (error) {
    console.error("❌ Error getting cart:", error);
    return [];
  }
};

// Clear cart
export const clearCart = async (userEmail) => {
  try {
    const cartRef = doc(db, "carts", userEmail);
    await setDoc(cartRef, { items: [], updatedAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    return false;
  }
};

// Save favorites
export const saveFavorites = async (userEmail, favorites) => {
  try {
    const favRef = doc(db, "favorites", userEmail);
    await setDoc(favRef, {
      items: favorites,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("❌ Error saving favorites:", error);
    return false;
  }
};

// Get favorites
export const getFavorites = async (userEmail) => {
  try {
    const favRef = doc(db, "favorites", userEmail);
    const favDoc = await getDoc(favRef);

    if (favDoc.exists()) {
      return favDoc.data().items || [];
    }

    return [];
  } catch (error) {
    console.error("❌ Error getting favorites:", error);
    return [];
  }
};

// Get user orders
export const getUserOrders = async (userEmail) => {
  try {
    const ordersRef = collection(db, "orders");
    const querySnapshot = await getDocs(ordersRef);

    const orders = querySnapshot.docs
      .map((doc) => ({
        orderId: doc.id,
        ...doc.data(),
      }))
      .filter((order) => order.userEmail === userEmail);

    return orders;
  } catch (error) {
    console.error("❌ Error getting orders:", error);
    return [];
  }
};

// Create order
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: "Pending", // Initial status
      createdAt: new Date().toISOString(),
      canCancelByUser: true, // User can cancel before seller confirmation
      canCancelBySeller: true, // Seller can cancel before confirmation
    });

    console.log("✅ Order created with ID:", docRef.id);
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return { success: false, error: error.message };
  }
};

// Update order status with proper flow control
export const updateOrderStatus = async (
  orderId,
  status,
  updatedBy = "system"
) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return { success: false, error: "Order not found" };
    }

    const currentOrder = orderDoc.data();
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    // Handle different status transitions
    switch (status) {
      case "Confirmed":
        updateData.confirmedAt = new Date().toISOString();
        updateData.confirmedBy = updatedBy;
        updateData.canCancelByUser = false; // User can't cancel after confirmation
        updateData.canCancelBySeller = false; // Seller can't cancel after confirmation
        break;

      case "Delivered":
        updateData.deliveredAt = new Date().toISOString();
        updateData.deliveredBy = updatedBy;
        // Auto-complete after delivery
        setTimeout(async () => {
          await updateDoc(orderRef, {
            status: "Completed",
            completedAt: new Date().toISOString(),
          });
        }, 1000);
        break;

      case "Cancelled by User":
        if (!currentOrder.canCancelByUser) {
          return {
            success: false,
            error: "Order cannot be cancelled by user at this stage",
          };
        }
        updateData.cancelledAt = new Date().toISOString();
        updateData.cancelledBy = "User";
        break;

      case "Cancelled by Seller":
        if (!currentOrder.canCancelBySeller) {
          return {
            success: false,
            error: "Order cannot be cancelled by seller at this stage",
          };
        }
        updateData.cancelledAt = new Date().toISOString();
        updateData.cancelledBy = "Seller";
        break;

      case "Completed":
        updateData.completedAt = new Date().toISOString();
        break;
    }

    await updateDoc(orderRef, updateData);
    console.log("✅ Order status updated:", orderId, "->", status);
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return { success: false, error: error.message };
  }
};

// Cancel order by user (only before seller confirmation)
export const cancelOrderByUser = async (orderId) => {
  return await updateOrderStatus(orderId, "Cancelled by User", "user");
};

// Cancel order by seller (only before confirmation)
export const cancelOrderBySeller = async (orderId, reason) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "Cancelled by Seller",
      cancelledAt: new Date().toISOString(),
      cancelledBy: "Seller",
      cancellationReason: reason,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Confirm order by seller
export const confirmOrderBySeller = async (orderId, sellerId) => {
  return await updateOrderStatus(orderId, "Confirmed", sellerId);
};

// Mark order as delivered by seller
export const markOrderAsDelivered = async (orderId, sellerId) => {
  return await updateOrderStatus(orderId, "Delivered", sellerId);
};

// Get seller notifications
export const getSellerNotifications = async (sellerId) => {
  try {
    const notificationsRef = collection(db, "sellerNotifications");
    const q = query(notificationsRef, where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);

    const notifications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Fetched seller notifications:", notifications.length);
    return notifications;
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, "sellerNotifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: new Date().toISOString(),
    });

    console.log("✅ Notification marked as read:", notificationId);
    return true;
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    return false;
  }
};

// Remove initializeProducts function - no longer needed
// Products should only be added by admin or sellers through their respective interfaces
