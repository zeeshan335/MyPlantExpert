import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./SellerLogin.css";

const SellerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const sellersRef = collection(db, "sellers");
      const q = query(
        sellersRef,
        where("email", "==", email),
        where("password", "==", password),
        where("status", "==", "approved")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid credentials or account not approved yet.");
        setLoading(false);
        return;
      }

      const sellerData = querySnapshot.docs[0].data();
      const sellerId = querySnapshot.docs[0].id;

      // Store seller info in localStorage
      localStorage.setItem(
        "seller",
        JSON.stringify({
          id: sellerId,
          ...sellerData,
        })
      );

      navigate("/seller-dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-login-container">
      <div className="seller-login-box">
        <div className="seller-login-header">
          <h1 style={{ color: "white" }}>Seller Login</h1>
          <p>Access Your Seller Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="seller-login-form">
          {error && (
            <div className="seller-error-message">
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
              placeholder="Enter your email"
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

          <button type="submit" className="seller-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login as Seller"}
          </button>

          <button
            type="button"
            className="seller-back-btn"
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
          <p
            style={{
              margin: "5px 0",
              fontSize: "14px",
              color: "#666",
            }}
          >
            Not a seller yet?{" "}
            <span
              onClick={() => navigate("/seller-registration")}
              style={{
                color: "#0f2d1a",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
