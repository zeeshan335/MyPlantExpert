import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import AdminSellerRequests from "./AdminSellerRequests";
import AdminSupportChat from "./AdminSupportChat";
import AdminAnalytics from "./AdminAnalytics";
import "./AdminDashboard.css";

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
          <h2>Admin Panel</h2>
          <p>{adminEmail}</p>
        </div>

        <nav className="admin-nav">
          {/* Feature 1: Seller Management */}
          <button
            className={`admin-nav-btn ${
              activeSection === "seller-requests" ? "active" : ""
            }`}
            onClick={() => setActiveSection("seller-requests")}
          >
            Seller Requests
          </button>

          {/* Feature 2: Order Management */}
          <button
            className={`admin-nav-btn ${
              activeSection === "orders" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/orders")}
          >
            Orders
          </button>

          {/* Feature 3: Product Management */}
          <button
            className={`admin-nav-btn ${
              activeSection === "products" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/products")}
          >
            Products
          </button>

          {/* Feature 4: Analytics */}
          <button
            className={`admin-nav-btn ${
              activeSection === "analytics" ? "active" : ""
            }`}
            onClick={() => setActiveSection("analytics")}
          >
            Analytics
          </button>

          {/* Feature 5: Support Chat */}
          <button
            className={`admin-nav-btn ${
              activeSection === "support" ? "active" : ""
            }`}
            onClick={() => setActiveSection("support")}
          >
            Support Chat
          </button>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-main-content">
        {activeSection === "dashboard" && (
          <>
            <div className="admin-header">
              <h1>Welcome to Admin Dashboard</h1>
              <p>Manage your plant expert application</p>
            </div>

            <div className="admin-welcome-message">
              <h2>Welcome to My Plant Expert Admin</h2>
              <p>This is your central hub for managing the application.</p>
              <p>Use the sidebar to navigate through different sections.</p>
            </div>
          </>
        )}

        {activeSection === "seller-requests" && <AdminSellerRequests />}

        {activeSection === "users" && (
          <div className="admin-header">
            <h1>Users Management</h1>
            <p>Coming soon...</p>
          </div>
        )}

        {activeSection === "analytics" && <AdminAnalytics />}

        {activeSection === "support" && <AdminSupportChat />}
      </div>
    </div>
  );
};

export default AdminDashboard;
