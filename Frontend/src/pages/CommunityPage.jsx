import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import AdminSellerRequests from "./AdminSellerRequests";
import AdminOrders from "./AdminOrders";
import "./AdminDashboard.css";
import { db } from "../firebase/firebase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = sessionStorage.getItem("adminAuth");
    const email = sessionStorage.getItem("adminEmail");

    if (!isAdmin || isAdmin !== "true") {
      navigate("/admin-login");
      return;
    }

    setAdminEmail(email);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      sessionStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminEmail");
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>🔐 Admin Panel</h2>
          <p>{adminEmail}</p>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-btn ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`admin-nav-btn ${
              activeSection === "seller-requests" ? "active" : ""
            }`}
            onClick={() => setActiveSection("seller-requests")}
          >
            👤 Seller Requests
          </button>
          <button
            className={`admin-nav-btn ${
              activeSection === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveSection("orders")}
          >
            🛒 Orders
          </button>
          <button
            className={`admin-nav-btn ${
              activeSection === "users" ? "active" : ""
            }`}
            onClick={() => setActiveSection("users")}
          >
            👥 Users
          </button>
          <button
            className={`admin-nav-btn ${
              activeSection === "products" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/products")}
          >
            📦 Products
          </button>
          <button
            className={`admin-nav-btn ${
              activeSection === "analytics" ? "active" : ""
            }`}
            onClick={() => setActiveSection("analytics")}
          >
            📈 Analytics
          </button>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="admin-main-content">
        {activeSection === "dashboard" && (
          <>
            <div className="admin-header">
              <h1>Welcome to Admin Dashboard</h1>
              <p>Manage your plant expert application</p>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-content">
                  <h3>Total Orders</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Revenue</h3>
                  <p className="stat-number">Rs. 0</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>Products</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>
            </div>

            <div className="admin-welcome-message">
              <h2>🌱 Welcome to My Plant Expert Admin</h2>
              <p>This is your central hub for managing the application.</p>
              <p>Use the sidebar to navigate through different sections.</p>
            </div>
          </>
        )}

        {activeSection === "seller-requests" && <AdminSellerRequests />}

        {activeSection === "orders" && <AdminOrders />}

        {activeSection === "users" && (
          <div className="admin-header">
            <h1>Users Management</h1>
            <p>Coming soon...</p>
          </div>
        )}

        {activeSection === "analytics" && (
          <div className="admin-header">
            <h1>Analytics</h1>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
