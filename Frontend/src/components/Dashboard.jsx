import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if admin is logged in - redirect to admin dashboard
    const isAdmin = sessionStorage.getItem("adminAuth");
    if (isAdmin === "true") {
      navigate("/admin-dashboard");
      return;
    }

    // Check for user session in sessionStorage (takes priority to isolate from admin auth)
    const userAuth = sessionStorage.getItem("userAuth");
    const userEmail = sessionStorage.getItem("userEmail");
    const userName = sessionStorage.getItem("userName");

    if (userAuth === "true" && userEmail) {
      // Use stored user session data (isolated from Firebase auth changes)
      setUser({
        email: userEmail,
        displayName: userName,
      });
    } else if (currentUser) {
      // Fallback to currentUser from AuthContext
      setUser(currentUser);
    } else {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      // Clear user session data
      sessionStorage.removeItem("userAuth");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userName");
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const navigateTo = (path) => {
    console.log("Navigating to:", path); // Debug log
    navigate(path);
  };

  const featureCards = [
    {
      title: "Plant Identification",
      tagline: "Discover the name of any plant with just a photo",
      color: "#0f2d1a",
      path: "/plant-identification",
    },
    {
      title: "Disease Detection",
      tagline: "Early diagnosis for healthier plants",
      color: "#0f2d1a",
      path: "/disease-detection",
    },
    {
      title: "Expert Consultation",
      tagline: "Get personalized advice from plant experts",
      color: "#0f2d1a",
      path: "/expert-consultation",
    },
    {
      title: "Marketplace",
      tagline: "Buy and sell plants, seeds, and gardening supplies",
      color: "#0f2d1a",
      path: "/marketplace",
    },
    {
      title: "Plant Database",
      tagline: "Explore thousands of plants and their details",
      color: "#0f2d1a",
      path: "/plant-database",
    },
    {
      title: "Plant Care & Recommendations",
      tagline: "Custom care guides for your garden",
      color: "#0f2d1a",
      path: "/plant-care",
    },
    {
      title: "Community Forum",
      tagline: "Connect with fellow plant enthusiasts",
      color: "#0f2d1a",
      path: "/community",
    },
    {
      title: "Knowledge Vault",
      tagline: "Access plant care guides and resources",
      color: "#0f2d1a",
      path: "/knowledge-vault",
    },
    {
      title: "Breeding Planner",
      tagline: "Smart plant cross-breeding assistance system",
      color: "#0f2d1a",
      path: "/breeding-planner",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          Welcome, {user?.displayName || user?.email?.split("@")[0] || "User"}!
        </h1>
      </div>

      <div className="feature-cards-grid">
        {featureCards.map((card, index) => (
          <div
            key={index}
            className="feature-card"
            style={{
              borderTop: `4px solid ${card.color}`,
              boxShadow: `0 6px 10px rgba(0,0,0,0.08), 0 0 6px rgba(0,0,0,0.05)`,
              cursor: "pointer",
            }}
          >
            <h3 style={{ color: "#0f2d1a" }}>{card.title}</h3>
            <p>{card.tagline}</p>
            <div className="card-footer">
              <button
                className="explore-btn"
                style={{ backgroundColor: "#0f2d1a" }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(card.path);
                }}
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
