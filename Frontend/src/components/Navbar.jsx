import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      // Clear user session data
      sessionStorage.removeItem("userAuth");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userName");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Only show navbar on non-auth routes
  const isAuthRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/plant-identification") ||
    location.pathname.startsWith("/disease-detection") ||
    location.pathname.startsWith("/plant-care") ||
    location.pathname.startsWith("/plant-database") ||
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/expert-consultation") ||
    location.pathname.startsWith("/cross-breed") ||
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/admin-login") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/insect-identification") ||
    location.pathname.startsWith("/marketplace") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/seller-registration") ||
    location.pathname.startsWith("/seller-login") ||
    location.pathname.startsWith("/seller-dashboard");

  // Hide navbar on these routes
  if (isAuthRoute) {
    return null;
  }

  // Hide Navbar on Knowledge Vault page
  if (location.pathname === "/knowledge-vault") {
    return null;
  }

  // Routes where main Navbar should NOT be shown
  const excludedRoutes = [
    "/breeding-planner",
    "/admin",
    "/seller",
    "/expert-dashboard",
  ];

  // Check if current route is excluded
  const isExcluded = excludedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Don't render Navbar on excluded routes
  if (isExcluded) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span
              className="logo-text"
              style={{ opacity: 1, visibility: "visible" }}
            >
              MyPlantExpert
            </span>
          </Link>
        </div>

        <div
          className={`menu-icon ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-link">
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link">
              Contact
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/seller-registration" className="nav-link">
              Join as Seller
            </NavLink>
          </li>

          {currentUser ? (
            <>
              <li className="nav-item"></li>
            </>
          ) : (
            <></>
          )}
        </ul>

        <div className="navbar-actions">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        <Link to="/admin-login" className="nav-link">
          Admin
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
