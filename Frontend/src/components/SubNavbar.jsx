import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SubNavbar.css";

const SubNavbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // Clear user session data
      sessionStorage.removeItem("userAuth");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userName");
      // Use the logout function from auth context
      if (auth.logout) {
        await auth.logout();
      } else if (auth.signOut) {
        await auth.signOut();
      } else {
        // Fallback to direct Firebase signOut
        await signOut(authFirebase);
      }
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // Routes jahan SubNavbar NAHI dikhana chahiye
  const excludedRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/admin-login",
    "/admin-dashboard",
    "/seller-login",
    "/seller-registration",
    "/seller-dashboard",
    "/checkout",
    "/contact", // Added Contact page
    "/about", // Added About page
    // Removed "/breeding-planner" - so SubNavbar will now show on breeding planner pages
  ];

  // Check if current route is excluded
  const isExcludedRoute =
    location.pathname === "/" || // Exact match for home page
    excludedRoutes.some((route) => location.pathname.startsWith(route)); // Starts with for other routes

  // Agar user logged in hai AUR route excluded nahi hai, toh SubNavbar dikhaao
  if (!auth.currentUser || isExcludedRoute) {
    return null;
  }

  return (
    <nav className="sub-navbar">
      <div className="sub-navbar-content">
        <div className="sub-navbar-logo">
          <NavLink to="/dashboard">
            <span className="logo-text">MyPlantExpert</span>
          </NavLink>
        </div>
        <ul className="sub-nav-list">
          <li className="sub-nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `sub-nav-link ${isActive ? "active" : ""}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="sub-nav-item">
            <NavLink
              to="/plant-identification"
              className={({ isActive }) =>
                `sub-nav-link ${isActive ? "active" : ""}`
              }
            >
              Plant Identification
            </NavLink>
          </li>
          <li className="sub-nav-item">
            <NavLink
              to="/disease-detection"
              className={({ isActive }) =>
                `sub-nav-link ${isActive ? "active" : ""}`
              }
            >
              Disease Detection
            </NavLink>
          </li>
          <li className="sub-nav-item">
            <NavLink
              to="/plant-database"
              className={({ isActive }) =>
                `sub-nav-link ${isActive ? "active" : ""}`
              }
            >
              Plant Database
            </NavLink>
          </li>
          <li className="sub-nav-item">
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `sub-nav-link ${isActive ? "active" : ""}`
              }
            >
              Community
            </NavLink>
          </li>
          <li className="sub-nav-item">
            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                `sub-nav-link ${isActive ? "active" : ""}`
              }
            >
              Marketplace
            </NavLink>
          </li>
          <li className="sub-nav-item">
            <NavLink
              to="/expert-consultation"
              className={({ isActive }) =>
                `sub-nav-link ${isActive ? "active" : ""}`
              }
            >
              Expert Consultation
            </NavLink>
          </li>
        </ul>
        <div className="sub-navbar-right">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SubNavbar;
