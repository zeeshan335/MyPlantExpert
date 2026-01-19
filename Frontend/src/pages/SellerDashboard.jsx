import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  getSellerNotifications,
  markNotificationAsRead,
} from "../firebase/marketplaceService";
import {
  getSellerConversations,
  sendSellerMessage,
} from "../firebase/sellerChatService";
import "./SellerDashboard.css";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    outOfStock: 0,
    monthlyEarnings: [],
    topProducts: [],
    recentSales: [],
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Seeds",
    discount: 0,
    freeShipping: false,
    stock: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);
  const [stockToAdd, setStockToAdd] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sellerData = localStorage.getItem("seller");
    if (!sellerData) {
      navigate("/seller-login");
      return;
    }
    setSeller(JSON.parse(sellerData));
  }, [navigate]);

  useEffect(() => {
    if (seller) {
      fetchProducts();
      fetchOrders();
      fetchNotifications();
      calculateAnalytics();
      fetchConversations();
    }
  }, [seller, orders, products]);

  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", seller.id)
      );
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      // Fetch all orders
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);

      // Filter orders that contain products from this seller
      const sellerOrders = [];

      querySnapshot.forEach((docSnap) => {
        const orderData = docSnap.data();
        const sellerItems = orderData.items?.filter(
          (item) => item.sellerId === seller.id
        );

        if (sellerItems && sellerItems.length > 0) {
          sellerOrders.push({
            id: docSnap.id,
            ...orderData,
            sellerItems: sellerItems, // Only items from this seller
          });
        }
      });

      setOrders(sellerOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const notificationsData = await getSellerNotifications(seller.id);
      setNotifications(
        notificationsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const convos = await getSellerConversations(seller.id);
      setConversations(convos);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const calculateAnalytics = () => {
    if (!orders.length && !products.length) return;

    // Calculate total earnings from completed orders
    const completedOrders = orders.filter(
      (o) => o.status === "Completed" || o.status === "Delivered"
    );
    const totalEarnings = completedOrders.reduce((sum, order) => {
      const sellerTotal = (order.sellerItems || []).reduce(
        (itemSum, item) => itemSum + item.price * item.quantity,
        0
      );
      return sum + sellerTotal;
    }, 0);

    // Calculate pending orders
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;

    // Calculate out of stock products
    const outOfStock = products.filter((p) => (p.stock || 0) === 0).length;

    // Calculate monthly earnings (last 6 months)
    const monthlyData = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      monthlyData[monthKey] = 0;
    }

    completedOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthKey = orderDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      if (monthlyData.hasOwnProperty(monthKey)) {
        const sellerTotal = (order.sellerItems || []).reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        monthlyData[monthKey] += sellerTotal;
      }
    });

    const monthlyEarnings = Object.entries(monthlyData).map(
      ([month, earnings]) => ({ month, earnings })
    );

    // Calculate top selling products
    const productSales = {};
    completedOrders.forEach((order) => {
      (order.sellerItems || []).forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent sales
    const recentSales = completedOrders.slice(0, 5).map((order) => ({
      orderId: order.id,
      date: order.createdAt,
      amount: (order.sellerItems || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      items: order.sellerItems.length,
    }));

    setAnalytics({
      totalEarnings,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders: completedOrders.length,
      totalProducts: products.length,
      outOfStock,
      monthlyEarnings,
      topProducts,
      recentSales,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "Seeds",
      discount: 0,
      freeShipping: false,
      stock: 0,
    });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice
          ? parseFloat(productForm.originalPrice)
          : null,
        discount: parseInt(productForm.discount),
        stock: parseInt(productForm.stock) || 0,
        sellerId: seller.id,
        sellerName: seller.name,
        createdAt: new Date().toISOString(),
        reviews: [],
        stockHistory: [
          {
            action: "initial_stock",
            quantity: parseInt(productForm.stock) || 0,
            date: new Date().toISOString(),
            note: "Initial stock added",
          },
        ],
      };

      if (editingProduct) {
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, productData);
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), productData);
        alert("✅ Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice
        ? product.originalPrice.toString()
        : "",
      category: product.category,
      discount: product.discount || 0,
      freeShipping: product.freeShipping || false,
      stock: product.stock || 0,
    });
    setShowAddProduct(true);
  };

  const handleStockUpdate = (product) => {
    setSelectedProductForStock(product);
    setStockToAdd(0);
    setShowStockModal(true);
  };

  const handleAddStock = async () => {
    if (!stockToAdd || stockToAdd <= 0) {
      alert("Please enter a valid stock quantity");
      return;
    }

    try {
      const productRef = doc(db, "products", selectedProductForStock.id);
      const newStock =
        (selectedProductForStock.stock || 0) + parseInt(stockToAdd);

      const stockHistoryEntry = {
        action: "stock_added",
        quantity: parseInt(stockToAdd),
        date: new Date().toISOString(),
        note: `Added ${stockToAdd} units`,
      };

      await updateDoc(productRef, {
        stock: newStock,
        stockHistory: [
          ...(selectedProductForStock.stockHistory || []),
          stockHistoryEntry,
        ],
      });

      alert(`✅ Stock updated! New stock: ${newStock}`);
      setShowStockModal(false);
      setSelectedProductForStock(null);
      setStockToAdd(0);
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock");
    }
  };

  const handleConfirmOrder = async (order) => {
    console.log("Order to confirm:", order);

    const orderDocId = order.id;

    if (!orderDocId) {
      alert("Invalid order data");
      return;
    }

    if (!order.sellerItems || order.sellerItems.length === 0) {
      alert("No items found for this order");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to confirm this order? Once confirmed, it cannot be cancelled."
      )
    ) {
      return;
    }

    try {
      // Deduct stock for seller's items
      for (const item of order.sellerItems) {
        const productId = item.productId || item.id;

        if (!productId) {
          console.warn("Item missing productId/id:", item);
          continue;
        }

        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock || 0;
          const quantityToDeduct = item.quantity || 1;
          const newStock = Math.max(0, currentStock - quantityToDeduct);

          const stockHistoryEntry = {
            action: "order_confirmed",
            quantity: -quantityToDeduct,
            orderId: orderDocId,
            date: new Date().toISOString(),
            note: `Order #${orderDocId.substring(
              0,
              8
            )} confirmed - ${quantityToDeduct} units deducted`,
          };

          await updateDoc(productRef, {
            stock: newStock,
            stockHistory: [
              ...(productSnap.data().stockHistory || []),
              stockHistoryEntry,
            ],
          });
        }
      }

      // Update order status to confirmed
      const orderRef = doc(db, "orders", orderDocId);
      await updateDoc(orderRef, {
        status: "Confirmed",
        confirmedAt: new Date().toISOString(),
        confirmedBySeller: seller.id,
        canCancelByUser: false,
        canCancelBySeller: false,
      });

      alert(
        "✅ Order confirmed successfully! Stock has been updated. Please deliver the order to complete it."
      );
      fetchOrders();
      fetchProducts();
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    if (
      !window.confirm(
        "Mark this order as delivered? This will complete the order."
      )
    ) {
      return;
    }

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "Delivered",
        deliveredAt: new Date().toISOString(),
        deliveredBySeller: seller.id,
      });

      // Auto-complete after delivery
      setTimeout(async () => {
        await updateDoc(orderRef, {
          status: "Completed",
          completedAt: new Date().toISOString(),
        });
      }, 1000);

      alert("✅ Order marked as delivered and completed!");
      fetchOrders();
    } catch (error) {
      console.error("Error marking as delivered:", error);
      alert("Failed to mark as delivered. Please try again.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Please provide a reason for cancelling this order:");

    if (!reason || !reason.trim()) {
      alert("Cancellation reason is required");
      return;
    }

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "Cancelled by Seller",
        cancelledAt: new Date().toISOString(),
        cancelledBy: "Seller",
        cancellationReason: reason,
      });

      alert("✅ Order cancelled successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", productId));
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("seller");
    navigate("/seller-login");
  };

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    fetchNotifications();
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      await sendSellerMessage({
        userEmail: selectedConversation.userEmail,
        userName: selectedConversation.userName,
        sellerId: seller.id,
        sellerName: seller.name,
        productName: selectedConversation.productName,
        message: replyMessage,
        sender: "seller",
      });
      setReplyMessage("");
      await fetchConversations();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const getTotalUnreadMessages = () => {
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { text: "Out of Stock", color: "#dc3545", bg: "#ffe6e6" };
    if (stock <= 5)
      return { text: "Low Stock", color: "#ff9800", bg: "#fff3e0" };
    return { text: "In Stock", color: "#4caf50", bg: "#e8f5e9" };
  };

  const categories = ["Seeds", "Tools", "Supplies", "Seasonal"];
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!seller) return null;

  return (
    <div className="seller-dashboard">
      <div className="seller-sidebar">
        <h2>{seller.name}</h2>
        <p className="seller-email">{seller.email}</p>
        <nav>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={activeTab === "stock" ? "active" : ""}
            onClick={() => setActiveTab("stock")}
          >
            Stock Management
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
            style={{ position: "relative" }}
          >
            Notifications
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "10px",
                  background: "#dc3545",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
            style={{ position: "relative" }}
          >
            Messages
            {getTotalUnreadMessages() > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "10px",
                  background: "#dc3545",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {getTotalUnreadMessages()}
              </span>
            )}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      <div className="seller-content">
        {activeTab === "products" && (
          <div className="products-section">
            <div className="section-header">
              <h3>My Products</h3>
              <button onClick={() => setShowAddProduct(true)}>
                + Add New Product
              </button>
            </div>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0);
                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>
                          <span className="category-badge">
                            {product.category}
                          </span>
                        </td>
                        <td className="price-cell">Rs. {product.price}</td>
                        <td>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: stockStatus.color,
                              fontSize: "1.1rem",
                            }}
                          >
                            {product.stock || 0}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              background: stockStatus.bg,
                              color: stockStatus.color,
                              padding: "0.3rem 0.8rem",
                              borderRadius: "4px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >
                            {stockStatus.text}
                          </span>
                        </td>
                        <td>
                          <button
                            className="stock-btn"
                            onClick={() => handleStockUpdate(product)}
                            style={{
                              background: "#2196F3",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "4px",
                              cursor: "pointer",
                              marginRight: "0.5rem",
                            }}
                          >
                            Update Stock
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <div className="orders-header">
              <h3>Order Management</h3>
              <div className="orders-stats">
                <div className="stat-badge pending">
                  <span className="stat-number">
                    {
                      orders.filter(
                        (o) =>
                          o.status === "Pending" &&
                          !o.status.includes("Cancelled")
                      ).length
                    }
                  </span>
                  <span className="stat-label">Pending</span>
                </div>
                <div className="stat-badge confirmed">
                  <span className="stat-number">
                    {orders.filter((o) => o.status === "Confirmed").length}
                  </span>
                  <span className="stat-label">In Progress</span>
                </div>
                <div className="stat-badge completed">
                  <span className="stat-number">
                    {
                      orders.filter(
                        (o) =>
                          o.status === "Delivered" || o.status === "Completed"
                      ).length
                    }
                  </span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>New orders will appear here</p>
              </div>
            ) : (
              <div className="orders-tabs">
                <div className="orders-group">
                  <h4 className="group-title">
                    <span className="status-dot pending"></span>
                    Pending Orders (
                    {
                      orders.filter(
                        (o) =>
                          o.status === "Pending" &&
                          !o.status.includes("Cancelled")
                      ).length
                    }
                    )
                  </h4>
                  <div className="orders-list">
                    {orders
                      .filter(
                        (o) =>
                          o.status === "Pending" &&
                          !o.status.includes("Cancelled")
                      )
                      .map((order) => (
                        <div key={order.id} className="order-card pending">
                          <div className="order-header">
                            <div>
                              <h5>Order #{order.id.substring(0, 8)}</h5>
                              <span className="order-date">
                                {new Date(order.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <span className="order-status-badge pending">
                              Pending
                            </span>
                          </div>

                          <div className="order-customer">
                            <h6>Customer Details</h6>
                            <p>
                              <strong>Name:</strong>{" "}
                              {order.deliveryInfo?.fullName || order.userName}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {order.deliveryInfo?.phone}
                            </p>
                            <p>
                              <strong>Address:</strong>{" "}
                              {order.deliveryInfo?.address},{" "}
                              {order.deliveryInfo?.city}
                            </p>
                          </div>

                          <div className="order-items">
                            <h6>Items ({(order.sellerItems || []).length})</h6>
                            {(order.sellerItems || []).map((item, index) => (
                              <div key={index} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">
                                  Qty: {item.quantity}
                                </span>
                                <span className="item-price">
                                  Rs. {item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="order-footer">
                            <div className="order-total">
                              <span>Total:</span>
                              <strong>
                                Rs.{" "}
                                {(order.sellerItems || []).reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.price || 0) * (item.quantity || 1),
                                  0
                                )}
                              </strong>
                            </div>
                            <div className="order-actions">
                              <button
                                className="btn-confirm"
                                onClick={() => handleConfirmOrder(order)}
                              >
                                Confirm
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {orders.filter(
                      (o) =>
                        o.status === "Pending" &&
                        !o.status.includes("Cancelled")
                    ).length === 0 && (
                      <p className="no-orders">No pending orders</p>
                    )}
                  </div>
                </div>

                <div className="orders-group">
                  <h4 className="group-title">
                    <span className="status-dot confirmed"></span>
                    In Progress (
                    {orders.filter((o) => o.status === "Confirmed").length})
                  </h4>
                  <div className="orders-list">
                    {orders
                      .filter((o) => o.status === "Confirmed")
                      .map((order) => (
                        <div key={order.id} className="order-card confirmed">
                          <div className="order-header">
                            <div>
                              <h5>Order #{order.id.substring(0, 8)}</h5>
                              <span className="order-date">
                                Confirmed on{" "}
                                {new Date(order.confirmedAt).toLocaleString()}
                              </span>
                            </div>
                            <span className="order-status-badge confirmed">
                              In Progress
                            </span>
                          </div>

                          <div className="order-customer">
                            <h6>Customer Details</h6>
                            <p>
                              <strong>Name:</strong>{" "}
                              {order.deliveryInfo?.fullName || order.userName}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {order.deliveryInfo?.phone}
                            </p>
                            <p>
                              <strong>Address:</strong>{" "}
                              {order.deliveryInfo?.address},{" "}
                              {order.deliveryInfo?.city}
                            </p>
                          </div>

                          <div className="order-items">
                            <h6>Items ({(order.sellerItems || []).length})</h6>
                            {(order.sellerItems || []).map((item, index) => (
                              <div key={index} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">
                                  Qty: {item.quantity}
                                </span>
                                <span className="item-price">
                                  Rs. {item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="order-footer">
                            <div className="order-total">
                              <span>Total:</span>
                              <strong>
                                Rs.{" "}
                                {(order.sellerItems || []).reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.price || 0) * (item.quantity || 1),
                                  0
                                )}
                              </strong>
                            </div>
                            <div className="order-actions">
                              <button
                                className="btn-deliver"
                                onClick={() => handleMarkAsDelivered(order.id)}
                              >
                                Mark as Delivered
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {orders.filter((o) => o.status === "Confirmed").length ===
                      0 && <p className="no-orders">No orders in progress</p>}
                  </div>
                </div>

                <div className="orders-group">
                  <h4 className="group-title">
                    <span className="status-dot completed"></span>
                    Completed (
                    {
                      orders.filter(
                        (o) =>
                          o.status === "Delivered" || o.status === "Completed"
                      ).length
                    }
                    )
                  </h4>
                  <div className="orders-list">
                    {orders
                      .filter(
                        (o) =>
                          o.status === "Delivered" || o.status === "Completed"
                      )
                      .map((order) => (
                        <div key={order.id} className="order-card completed">
                          <div className="order-header">
                            <div>
                              <h5>Order #{order.id.substring(0, 8)}</h5>
                              <span className="order-date">
                                Completed on{" "}
                                {new Date(
                                  order.deliveredAt || order.completedAt
                                ).toLocaleString()}
                              </span>
                            </div>
                            <span className="order-status-badge completed">
                              {order.status}
                            </span>
                          </div>

                          <div className="order-items">
                            <h6>Items ({(order.sellerItems || []).length})</h6>
                            {(order.sellerItems || []).map((item, index) => (
                              <div key={index} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">
                                  Qty: {item.quantity}
                                </span>
                                <span className="item-price">
                                  Rs. {item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="order-footer">
                            <div className="order-total">
                              <span>Total:</span>
                              <strong>
                                Rs.{" "}
                                {(order.sellerItems || []).reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.price || 0) * (item.quantity || 1),
                                  0
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    {orders.filter(
                      (o) =>
                        o.status === "Delivered" || o.status === "Completed"
                    ).length === 0 && (
                      <p className="no-orders">No completed orders</p>
                    )}
                  </div>
                </div>

                {orders.filter((o) => o.status.includes("Cancelled")).length >
                  0 && (
                  <div className="orders-group">
                    <h4 className="group-title">
                      <span className="status-dot cancelled"></span>
                      Cancelled (
                      {
                        orders.filter((o) => o.status.includes("Cancelled"))
                          .length
                      }
                      )
                    </h4>
                    <div className="orders-list">
                      {orders
                        .filter((o) => o.status.includes("Cancelled"))
                        .map((order) => (
                          <div key={order.id} className="order-card cancelled">
                            <div className="order-header">
                              <div>
                                <h5>Order #{order.id.substring(0, 8)}</h5>
                                <span className="order-date">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <span className="order-status-badge cancelled">
                                {order.status}
                              </span>
                            </div>
                            {order.cancellationReason && (
                              <div className="cancellation-reason">
                                <strong>Reason:</strong>{" "}
                                {order.cancellationReason}
                              </div>
                            )}
                            <div className="order-total">
                              <span>Total:</span>
                              <strong>
                                Rs.{" "}
                                {(order.sellerItems || []).reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.price || 0) * (item.quantity || 1),
                                  0
                                )}
                              </strong>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="notifications-section">
            <div className="section-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} Unread</span>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔔</div>
                <h3>No Notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-card ${
                      notification.read ? "read" : "unread"
                    }`}
                  >
                    <div className="notification-icon">⚠️</div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>Product Deleted by Admin</h4>
                        <span className="notification-time">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="notification-reason">
                        <strong>Reason:</strong>
                        <p>{notification.reason}</p>
                      </div>
                      <div className="notification-footer">
                        <p>
                          For queries, contact:{" "}
                          <a href="mailto:admin@myplantexpert.com">
                            admin@myplantexpert.com
                          </a>
                        </p>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "stock" && (
          <div className="stock-management-section">
            <div className="section-header">
              <h3>Stock Management</h3>
            </div>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0);
                    const lastUpdate =
                      product.stockHistory?.[product.stockHistory.length - 1];

                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>
                          <span className="category-badge">
                            {product.category}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: stockStatus.color,
                              fontSize: "1.3rem",
                            }}
                          >
                            {product.stock || 0} units
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              background: stockStatus.bg,
                              color: stockStatus.color,
                              padding: "0.5rem 1rem",
                              borderRadius: "6px",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              display: "inline-block",
                            }}
                          >
                            {stockStatus.text}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.85rem", color: "#666" }}>
                          {lastUpdate
                            ? new Date(lastUpdate.date).toLocaleDateString()
                            : new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="stock-btn"
                            onClick={() => handleStockUpdate(product)}
                            style={{
                              background: "#2196F3",
                              color: "white",
                              border: "none",
                              padding: "0.6rem 1.2rem",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "0.95rem",
                            }}
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {products.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#666",
                  }}
                >
                  <h3>No products yet</h3>
                  <p>Add products to start managing stock</p>
                </div>
              )}
            </div>

            {/* Stock Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginTop: "2rem",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h4 style={{ color: "#0f2d1a", marginBottom: "0.5rem" }}>
                  Total Products
                </h4>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#2196F3",
                    margin: 0,
                  }}
                >
                  {products.length}
                </p>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h4 style={{ color: "#0f2d1a", marginBottom: "0.5rem" }}>
                  Low Stock Items
                </h4>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#ff9800",
                    margin: 0,
                  }}
                >
                  {
                    products.filter(
                      (p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5
                    ).length
                  }
                </p>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h4 style={{ color: "#0f2d1a", marginBottom: "0.5rem" }}>
                  Out of Stock
                </h4>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#dc3545",
                    margin: 0,
                  }}
                >
                  {products.filter((p) => (p.stock || 0) === 0).length}
                </p>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h4 style={{ color: "#0f2d1a", marginBottom: "0.5rem" }}>
                  Total Stock Value
                </h4>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#4caf50",
                    margin: 0,
                  }}
                >
                  {products
                    .reduce(
                      (sum, p) => sum + (p.stock || 0) * (p.price || 0),
                      0
                    )
                    .toFixed(0)}{" "}
                  Rs
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-section">
            <div className="section-header">
              <h3>Analytics & Insights</h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  margin: "0.5rem 0 0 0",
                }}
              >
                Track your business performance and sales trends
              </p>
            </div>

            {/* Key Metrics Cards */}
            <div className="analytics-metrics">
              <div className="metric-card earnings">
                <div className="metric-icon">💰</div>
                <div className="metric-content">
                  <h4>Total Earnings</h4>
                  <p className="metric-value">
                    Rs. {analytics.totalEarnings.toFixed(0)}
                  </p>
                  <span className="metric-label">From completed orders</span>
                </div>
              </div>

              <div className="metric-card orders">
                <div className="metric-icon">📦</div>
                <div className="metric-content">
                  <h4>Total Orders</h4>
                  <p className="metric-value">{analytics.totalOrders}</p>
                  <span className="metric-label">All time orders</span>
                </div>
              </div>

              <div className="metric-card pending">
                <div className="metric-icon">⏳</div>
                <div className="metric-content">
                  <h4>Pending Orders</h4>
                  <p className="metric-value">{analytics.pendingOrders}</p>
                  <span className="metric-label">Awaiting confirmation</span>
                </div>
              </div>

              <div className="metric-card completed">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <h4>Completed Orders</h4>
                  <p className="metric-value">{analytics.completedOrders}</p>
                  <span className="metric-label">Successfully delivered</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="analytics-charts">
              {/* Monthly Earnings Chart */}
              <div className="chart-card">
                <h4>Monthly Earnings (Last 6 Months)</h4>
                <div className="bar-chart">
                  {analytics.monthlyEarnings.map((data, index) => {
                    const maxEarning = Math.max(
                      ...analytics.monthlyEarnings.map((d) => d.earnings)
                    );
                    const height =
                      maxEarning > 0 ? (data.earnings / maxEarning) * 100 : 0;

                    return (
                      <div key={index} className="bar-item">
                        <div className="bar-value">
                          Rs. {data.earnings.toFixed(0)}
                        </div>
                        <div
                          className="bar"
                          style={{
                            height: `${Math.max(height, 5)}%`,
                            background:
                              "linear-gradient(135deg, #4caf50 0%, #2d7a3e 100%)",
                          }}
                        />
                        <div className="bar-label">{data.month}</div>
                      </div>
                    );
                  })}
                </div>
                {analytics.monthlyEarnings.every((d) => d.earnings === 0) && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#999",
                      padding: "2rem",
                    }}
                  >
                    No earnings data yet
                  </p>
                )}
              </div>

              {/* Top Products */}
              <div className="chart-card">
                <h4>Top Selling Products</h4>
                {analytics.topProducts.length > 0 ? (
                  <div className="top-products-list">
                    {analytics.topProducts.map((product, index) => (
                      <div key={index} className="product-stat">
                        <div className="product-rank">#{index + 1}</div>
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          <p className="product-details">
                            {product.quantity} units sold • Rs.{" "}
                            {product.revenue.toFixed(0)} revenue
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#999",
                      padding: "2rem",
                    }}
                  >
                    No sales data yet
                  </p>
                )}
              </div>
            </div>

            {/* Recent Sales */}
            <div className="chart-card">
              <h4>Recent Sales</h4>
              {analytics.recentSales.length > 0 ? (
                <div className="recent-sales-list">
                  {analytics.recentSales.map((sale, index) => (
                    <div key={index} className="sale-item">
                      <div className="sale-icon">🛒</div>
                      <div className="sale-info">
                        <p className="sale-id">
                          Order #{sale.orderId.substring(0, 8)}
                        </p>
                        <p className="sale-date">
                          {new Date(sale.date).toLocaleDateString()} •{" "}
                          {sale.items} items
                        </p>
                      </div>
                      <div className="sale-amount">
                        Rs. {sale.amount.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#999",
                    padding: "2rem",
                  }}
                >
                  No recent sales
                </p>
              )}
            </div>

            {/* Inventory Status */}
            <div className="analytics-inventory">
              <div className="inventory-card">
                <h4>Inventory Status</h4>
                <div className="inventory-stats">
                  <div className="inventory-stat">
                    <span className="stat-label">Total Products</span>
                    <span className="stat-value">
                      {analytics.totalProducts}
                    </span>
                  </div>
                  <div className="inventory-stat warning">
                    <span className="stat-label">Out of Stock</span>
                    <span className="stat-value">{analytics.outOfStock}</span>
                  </div>
                  <div className="inventory-stat info">
                    <span className="stat-label">Low Stock (≤5)</span>
                    <span className="stat-value">
                      {
                        products.filter(
                          (p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="messages-section">
            <h3>Customer Messages</h3>
            {getTotalUnreadMessages() > 0 && (
              <div className="unread-indicator">
                {getTotalUnreadMessages()} unread message(s)
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
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="conv-info">
                      <strong>{conv.userName}</strong>
                      <p>{conv.productName}</p>
                      {conv.lastMessage && (
                        <small>
                          {new Date(
                            conv.lastMessage.timestamp
                          ).toLocaleString()}
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
                      <p>{selectedConversation.productName}</p>
                    </div>

                    <div className="messages-container">
                      {selectedConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`message ${
                            msg.sender === "seller" ? "seller" : "user"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <small>
                            {new Date(msg.timestamp).toLocaleString()}
                          </small>
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
        )}
      </div>

      {/* Add/Edit Product Modal - Same as Admin */}
      {showAddProduct && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button className="close-btn" onClick={() => resetForm()}>
                ×
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="modal-body">
              <div className="form-field">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={productForm.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-field">
                  <label>Original Price (Rs.)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={productForm.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="freeShipping"
                    checked={productForm.freeShipping}
                    onChange={handleInputChange}
                  />
                  <span>Free Shipping</span>
                </label>
              </div>

              <div className="form-field">
                <label>Initial Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockModal && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px" }}
          >
            <div className="modal-header">
              <h2>Update Stock - {selectedProductForStock?.name}</h2>
              <button
                className="close-btn"
                onClick={() => setShowStockModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  background: "#f0f7ff",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f2d1a" }}>
                  Current Stock:{" "}
                  <span style={{ color: "#2196F3", fontSize: "1.5rem" }}>
                    {selectedProductForStock?.stock || 0}
                  </span>{" "}
                  units
                </h3>
                {(selectedProductForStock?.stock || 0) <= 5 && (
                  <p
                    style={{
                      color: "#ff9800",
                      margin: "0.5rem 0 0 0",
                      fontWeight: "600",
                    }}
                  >
                    ⚠️ Low stock warning! Consider restocking soon.
                  </p>
                )}
              </div>

              <div className="form-field">
                <label>Add Stock Quantity *</label>
                <input
                  type="number"
                  value={stockToAdd}
                  onChange={(e) => setStockToAdd(e.target.value)}
                  placeholder="Enter quantity to add"
                  min="1"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
                {stockToAdd > 0 && (
                  <p
                    style={{
                      color: "#4caf50",
                      marginTop: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    New stock will be:{" "}
                    {(selectedProductForStock?.stock || 0) +
                      parseInt(stockToAdd)}{" "}
                    units
                  </p>
                )}
              </div>

              {/* Stock History */}
              {selectedProductForStock?.stockHistory &&
                selectedProductForStock.stockHistory.length > 0 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <h4 style={{ color: "#0f2d1a", marginBottom: "1rem" }}>
                      📋 Recent Stock Activity
                    </h4>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {selectedProductForStock.stockHistory
                        .slice(-5)
                        .reverse()
                        .map((entry, index) => (
                          <div
                            key={index}
                            style={{
                              background: "#f9f9f9",
                              padding: "0.8rem",
                              borderRadius: "6px",
                              marginBottom: "0.5rem",
                              borderLeft: `4px solid ${
                                entry.quantity > 0 ? "#4caf50" : "#ff9800"
                              }`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "600",
                                  color:
                                    entry.quantity > 0 ? "#4caf50" : "#ff9800",
                                }}
                              >
                                {entry.quantity > 0
                                  ? `+${entry.quantity}`
                                  : entry.quantity}{" "}
                                units
                              </span>
                              <span
                                style={{ fontSize: "0.85rem", color: "#666" }}
                              >
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p
                              style={{
                                margin: "0.3rem 0 0 0",
                                fontSize: "0.9rem",
                                color: "#666",
                              }}
                            >
                              {entry.note}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              <div className="modal-footer" style={{ marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStock}
                  style={{
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Add Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
