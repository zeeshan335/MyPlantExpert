import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./AdminOrders.css";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    calculateAnalytics();
  }, [orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const totalRevenue = orders
      .filter((o) => o.status === "Completed" || o.status === "Delivered")
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const completedCount = orders.filter(
      (o) => o.status === "Completed" || o.status === "Delivered"
    ).length;
    const cancelledCount = orders.filter((o) =>
      o.status?.includes("Cancelled")
    ).length;

    const todayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= startOfDay;
    }).length;

    const monthlyRevenue = orders
      .filter((o) => {
        const orderDate = new Date(o.createdAt);
        return (
          orderDate >= startOfMonth &&
          (o.status === "Completed" || o.status === "Delivered")
        );
      })
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    setAnalytics({
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders: pendingCount,
      completedOrders: completedCount,
      cancelledOrders: cancelledCount,
      todayOrders,
      monthlyRevenue,
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Change order status to ${newStatus}?`)) return;

    try {
      const orderRef = doc(db, "orders", orderId);
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: "Admin",
      };

      if (newStatus === "Delivered") {
        updateData.deliveredAt = new Date().toISOString();
      } else if (newStatus === "Completed") {
        updateData.completedAt = new Date().toISOString();
      }

      await updateDoc(orderRef, updateData);
      await fetchOrders();
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "#ffc107",
      Confirmed: "#2196F3",
      Delivered: "#4caf50",
      Completed: "#28a745",
      "Cancelled by User": "#dc3545",
      "Cancelled by Seller": "#dc3545",
    };
    return colors[status] || "#999";
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== "All") {
      if (filterStatus === "Cancelled") {
        filtered = filtered.filter((o) => o.status?.includes("Cancelled"));
      } else {
        filtered = filtered.filter((o) => o.status === filterStatus);
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.deliveryInfo?.phone?.includes(searchTerm)
      );
    }

    // Sorting
    if (sortBy === "date-desc") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "date-asc") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "amount-desc") {
      filtered.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sortBy === "amount-asc") {
      filtered.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    }

    return filtered;
  };

  const formatDateForCSV = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error";
    }
  };

  const formatTimeForCSV = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Time";

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Error";
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export");
      return;
    }

    try {
      // Helper function to escape CSV values properly
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return '""';
        const stringValue = String(value);
        // If value contains comma, quotes, or newline, wrap in quotes and escape existing quotes
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      const csvRows = [];

      // Add headers
      csvRows.push(
        [
          "OrderID",
          "Date",
          "Time",
          "Customer",
          "Email",
          "Phone",
          "Address",
          "Items",
          "Amount",
          "Status",
          "PaymentMethod",
          "PaymentStatus",
        ].join(",")
      );

      // Add data rows
      orders.forEach((order) => {
        const row = [
          escapeCSV(order.id.substring(0, 8)),
          escapeCSV(`'${formatDateForCSV(order.createdAt)}`), // Prefix with ' to force text
          escapeCSV(`'${formatTimeForCSV(order.createdAt)}`), // Prefix with ' to force text
          escapeCSV(order.userName || "Guest"),
          escapeCSV(order.userEmail || "N/A"),
          escapeCSV(`'${order.deliveryInfo?.phone || "N/A"}`), // Prefix with ' to preserve formatting
          escapeCSV(
            `${order.deliveryInfo?.address || "N/A"}, ${
              order.deliveryInfo?.city || ""
            }`
          ),
          escapeCSV(order.items?.length || 0),
          escapeCSV(order.amount || 0),
          escapeCSV(order.status || "Pending"),
          escapeCSV(order.paymentMethod || "N/A"),
          escapeCSV(order.paymentStatus || "Pending"),
        ];
        csvRows.push(row.join(","));
      });

      const csv = csvRows.join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${formatDateForCSV(new Date().toISOString())}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="simple-loader"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Order Management System</h2>
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              Manage and track all marketplace orders
            </p>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard")}
            style={{
              background: "#666",
              color: "white",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="analytics-grid">
        <div className="stat-card total">
          <div className="stat-content">
            <h4>Total Revenue</h4>
            <p className="stat-value">
              Rs. {analytics.totalRevenue.toFixed(0)}
            </p>
            <span className="stat-label">From completed orders</span>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-content">
            <h4>Total Orders</h4>
            <p className="stat-value">{analytics.totalOrders}</p>
            <span className="stat-label">All time orders</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-content">
            <h4>Pending</h4>
            <p className="stat-value">{analytics.pendingOrders}</p>
            <span className="stat-label">Awaiting action</span>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-content">
            <h4>Completed</h4>
            <p className="stat-value">{analytics.completedOrders}</p>
            <span className="stat-label">Successfully delivered</span>
          </div>
        </div>

        <div className="stat-card today">
          <div className="stat-content">
            <h4>Today's Orders</h4>
            <p className="stat-value">{analytics.todayOrders}</p>
            <span className="stat-label">Orders placed today</span>
          </div>
        </div>

        <div className="stat-card monthly">
          <div className="stat-content">
            <h4>This Month</h4>
            <p className="stat-value">
              Rs. {analytics.monthlyRevenue.toFixed(0)}
            </p>
            <span className="stat-label">Monthly revenue</span>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="orders-controls">
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Email, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search orders"
            />
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          <button className="export-btn" onClick={exportToCSV}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders found</h3>
          <p>{searchTerm ? "Try a different search term" : "No orders yet"}</p>
        </div>
      ) : (
        <div
          className="orders-table-container"
          style={{ overflowX: "scroll", WebkitOverflowScrolling: "touch" }}
        >
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">
                      #{order.id.substring(0, 8)}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <span className="date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="time">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <strong>{order.userName || "Guest"}</strong>
                      <span className="email">{order.userEmail}</span>
                    </div>
                  </td>
                  <td>{order.deliveryInfo?.phone || "N/A"}</td>
                  <td>
                    <span className="items-badge">
                      {order.items?.length || 0} items
                    </span>
                  </td>
                  <td>
                    <strong className="amount">Rs. {order.amount}</strong>
                  </td>
                  <td>
                    <span
                      className={`payment-badge ${
                        order.paymentStatus === "Paid" ? "paid" : "pending"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => viewOrderDetails(order)}
                        title="View Details"
                        aria-label="View order details"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="modal-content order-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Order Details #{selectedOrder.id.substring(0, 8)}</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Information */}
              <div className="details-section">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <span>
                      {selectedOrder.deliveryInfo?.fullName ||
                        selectedOrder.userName}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedOrder.userEmail}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{selectedOrder.deliveryInfo?.phone}</span>
                  </div>
                  <div className="info-item">
                    <label>City:</label>
                    <span>{selectedOrder.deliveryInfo?.city}</span>
                  </div>
                  <div className="info-item full-width">
                    <label>Address:</label>
                    <span>{selectedOrder.deliveryInfo?.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="details-section">
                <h3>Order Items ({selectedOrder.items?.length || 0})</h3>
                <div className="items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-info">
                        <strong>{item.name}</strong>
                        <span className="item-meta">
                          Seller: {item.sellerName || "Admin"} | Qty:{" "}
                          {item.quantity}
                        </span>
                      </div>
                      <div className="item-price">
                        Rs. {item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="details-section">
                <h3>Order Summary</h3>
                <div className="summary-grid">
                  <div className="summary-row">
                    <span>Order Date:</span>
                    <strong>
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Payment Method:</span>
                    <strong>{selectedOrder.paymentMethod}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Payment Status:</span>
                    <strong>{selectedOrder.paymentStatus || "Pending"}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Order Status:</span>
                    <strong
                      style={{ color: getStatusColor(selectedOrder.status) }}
                    >
                      {selectedOrder.status}
                    </strong>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Amount:</span>
                    <strong>Rs. {selectedOrder.amount}</strong>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="details-section">
                <h3>Update Order Status</h3>
                <div className="status-actions">
                  <button
                    className="status-action-btn completed"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "Completed");
                      setShowDetailsModal(false);
                    }}
                    disabled={selectedOrder.status !== "Delivered"}
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
