import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordReset } from "../firebase/auth";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendPasswordReset(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>Reset Password</h1>

        {success ? (
          <div className="success-message">
            <p>Password reset link has been sent to your email.</p>
            <p>Please check your inbox and follow the instructions.</p>
            <p className="expiry-warning">
              The reset link will expire in one hour.
            </p>
            <div className="back-to-login">
              <Link to="/login">Back to Login</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="forgot-subtitle">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn primary-btn reset-btn"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="back-to-login">
              <Link to="/login">Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
