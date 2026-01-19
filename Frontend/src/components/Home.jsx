import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section with Background Image */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            Discover the Perfect Plants
            <span className="line-break">for Your Space</span>
          </h1>
          <p>Expert advice on plant care, identification, and maintenance</p>
          <div className="get-started-wrapper">
            <Link
              to="/register"
              className="btn primary-btn get-started-btn"
              style={{
                backgroundColor: "transparent",
                color: "white",
                padding: "12px 30px",
                fontSize: "1.1rem",
                fontWeight: "600",
                borderRadius: "30px",
                textDecoration: "none",
                border: "2px solid white",
                transition: "all 0.3s ease",
                display: "inline-block",
                letterSpacing: "0.5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section - Explore Features */}

      {/* Remove the bottom divider that's creating space */}
    </div>
  );
};

export default Home;
