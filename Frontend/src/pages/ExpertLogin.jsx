import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExpertLogin.css";

const ExpertLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Hide navbar on mount and show on unmount
  useEffect(() => {
    // Find and hide the navbar
    const navbar = document.querySelector("nav");
    const header = document.querySelector("header");

    if (navbar) {
      navbar.style.display = "none";
    }
    if (header) {
      header.style.display = "none";
    }

    // Cleanup: show navbar when component unmounts
    return () => {
      if (navbar) {
        navbar.style.display = "";
      }
      if (header) {
        header.style.display = "";
      }
    };
  }, []);

  // Single expert account for all categories
  const expertAccounts = [
    {
      id: 1,
      email: "expert123@gmail.com",
      password: "expert123",
      name: "Plant Expert",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const expert = expertAccounts.find(
      (acc) =>
        acc.email === credentials.email && acc.password === credentials.password
    );

    if (expert) {
      // Save expert data to localStorage
      localStorage.setItem("expertUser", JSON.stringify(expert));
      navigate("/expert-dashboard");
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div className="expert-login-container">
      <div className="expert-login-card">
        <div className="expert-login-header">
          <h1> Expert Portal</h1>
          <p>Login to manage your consultations</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Expert Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="expert@plantexpert.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="expert-login-btn">
            Login as Expert
          </button>
        </form>

        <div className="demo-credentials">
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <p>Email: expert123@gmail.com</p>
          <p>Password: expert123</p>
        </div>

        <button
          className="back-to-home-btn"
          onClick={() => navigate("/expert-consultation")}
        >
          ← Back to Expert Consultation
        </button>
      </div>
    </div>
  );
};

export default ExpertLogin;
