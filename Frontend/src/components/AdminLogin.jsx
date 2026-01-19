import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if user is admin in Firestore
      const adminDoc = await getDoc(doc(db, "admins", user.uid));

      if (adminDoc.exists() && adminDoc.data().isAdmin === true) {
        // Store admin session
        sessionStorage.setItem("adminAuth", "true");
        sessionStorage.setItem("adminEmail", user.email);

        // Redirect to admin dashboard
        navigate("/admin-dashboard");
      } else {
        setError("Access denied. You are not authorized as an admin.");
        await auth.signOut();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1 style={{ color: "white" }}>Admin Login</h1>
          <p>Secure Access to Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          {error && (
            <div className="admin-error-message">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>

          <button
            type="button"
            className="admin-back-btn"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            ← Back to Home
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f0f0f0",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <strong
            style={{
              color: "#0f2d1a",
            }}
          >
            Admin Credentials:
          </strong>
          <p
            style={{
              margin: "5px 0",
              fontSize: "14px",
            }}
          >
            Email: admin@myplantexpert.com
          </p>
          <p
            style={{
              margin: "5px 0",
              fontSize: "14px",
            }}
          >
            Password: Admin@123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
