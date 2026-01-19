import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./SellerRegistration.css";

const SellerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addDoc(collection(db, "sellerRequests"), {
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      setSuccess(
        "Registration request submitted successfully! Wait for admin approval."
      );
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting seller request:", error);
      setError("Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-registration-container">
      <div className="seller-registration-box">
        <div className="seller-registration-header">
          <h1 style={{ color: "white" }}>Join as a Seller</h1>
          <p>Register your shop and start selling</p>
        </div>

        <form onSubmit={handleSubmit} className="seller-registration-form">
          {error && (
            <div className="seller-error-message">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="seller-success-message">
              <span>✓</span>
              <p>{success}</p>
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              required
              rows={3}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="seller-register-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Registration"}
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
            marginTop: "15px",
            padding: "12px",
            background: "#f0f0f0",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "13px",
              color: "#666",
            }}
          >
            Already a seller?{" "}
            <span
              onClick={() => navigate("/seller-login")}
              style={{
                color: "#0f2d1a",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerRegistration;
