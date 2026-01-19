import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // Filter orders by current user
    const userOrders = storedOrders.filter(
      (order) => order.userEmail === (currentUser?.email || "guest@example.com")
    );
    setOrders(userOrders.reverse()); // Show newest first
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = storedOrders.map((order) =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    loadOrders();
  };

  const getStatusBadge = (status) => {
    const badges = {
      "Pending Verification": {
        emoji: "🟡",
        color: "#ffc107",
        text: "Pending",
      },
      Verified: { emoji: "🔵", color: "#007bff", text: "Verified" },
      Processing: { emoji: "🟣", color: "#6f42c1", text: "Processing" },
      Shipped: { emoji: "🟠", color: "#fd7e14", text: "Shipped" },
      Delivered: { emoji: "🟢", color: "#28a745", text: "Delivered" },
      Cancelled: { emoji: "🔴", color: "#dc3545", text: "Cancelled" },
    };
    return badges[status] || badges["Pending Verification"];
  };

  const getProgressPercentage = (status) => {
    const progress = {
      "Pending Verification": 20,
      Verified: 40,
      Processing: 60,
      Shipped: 80,
      Delivered: 100,
      Cancelled: 0,
    };
    return progress[status] || 20;
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="empty-orders">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/marketplace")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      {/* Status Filter */}
      <div className="status-filter">
        {[
          "All",
          "Pending Verification",
          "Verified",
          "Processing",
          "Shipped",
          "Delivered",
        ].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filterStatus === status ? "active" : ""}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.map((order) => {
          const badge = getStatusBadge(order.status);
          const progress = getProgressPercentage(order.status);

          return (
            <div key={order.orderId} className="order-card">
              {/* Order Header */}
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId.slice(-8)}</h3>
                  <p className="order-date">{order.date}</p>
                </div>
                <div
                  className="status-badge"
                  style={{ background: badge.color }}
                >
                  {badge.emoji} {badge.text}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: badge.color,
                    }}
                  ></div>
                </div>
                <div className="progress-steps">
                  <div className={progress >= 20 ? "step active" : "step"}>
                    <span>📝</span>
                    <p>Pending</p>
                  </div>
                  <div className={progress >= 40 ? "step active" : "step"}>
                    <span>✅</span>
                    <p>Verified</p>
                  </div>
                  <div className={progress >= 60 ? "step active" : "step"}>
                    <span>⚙️</span>
                    <p>Processing</p>
                  </div>
                  <div className={progress >= 80 ? "step active" : "step"}>
                    <span>🚚</span>
                    <p>Shipped</p>
                  </div>
                  <div className={progress >= 100 ? "step active" : "step"}>
                    <span>📦</span>
                    <p>Delivered</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items">
                <h4>Items ({order.items.length})</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="order-footer">
                <div className="payment-info">
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                  <p className="total-amount">
                    <strong>Total Amount:</strong> Rs. {order.amount}
                  </p>
                </div>

                {/* Admin Controls (for simulation) */}
                <div className="admin-controls">
                  <label>Update Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.orderId, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="Pending Verification">
                      Pending Verification
                    </option>
                    <option value="Verified">Verified</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Payment Proof */}
              {order.paymentProof && (
                <div className="payment-proof">
                  <button
                    onClick={() => window.open(order.paymentProof, "_blank")}
                    className="view-proof-btn"
                  >
                    View Payment Proof 🖼️
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
