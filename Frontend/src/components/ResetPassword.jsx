import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyPasswordResetCode, resetPassword } from "../firebase/auth";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [oobCode, setOobCode] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get oobCode (action code) from URL
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("oobCode");

    if (code) {
      setOobCode(code);
      verifyCode(code);
    } else {
      setIsVerifying(false);
      setError("Invalid password reset link. Please request a new one.");
    }

    // Check for mode parameter to ensure we're handling a password reset
    const mode = urlParams.get("mode");
    if (mode && mode !== "resetPassword") {
      setIsVerifying(false);
      setError("Invalid password reset link. Please request a new one.");
    }
  }, [location]);

  const verifyCode = async (code) => {
    try {
      const result = await verifyPasswordResetCode(code);
      if (result.success) {
        setEmail(result.email);
        setIsVerifying(false);
      } else {
        setIsVerifying(false);
        setError(result.error);
      }
    } catch (error) {
      setIsVerifying(false);
      setError("Failed to verify the reset link. Please request a new one.");
    }
  };

  // Enhanced password validation to match registration validation
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    } else if (/\s/.test(password)) {
      return "Password cannot contain spaces";
    } else if (password.length < 8) {
      return "Password must be at least 8 characters";
    } else if (password.length > 20) {
      return "Password cannot exceed 20 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return null;
  };

  // Validate on input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear error if user is typing a new value
    if (error && error.includes("Password")) {
      setError(null);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Clear error if user is typing a new value
    if (error && error.includes("match")) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset any existing errors
    setError(null);

    // Validate password using the same validation logic as registration
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Confirm passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(oobCode, password);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while verifying the code
  if (isVerifying) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <h1>Verifying Reset Link</h1>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Verifying your password reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h1>Create New Password</h1>

        {error && <div className="error-alert">{error}</div>}

        {success ? (
          <div className="success-alert">
            <h4>Password Reset Successful!</h4>
            <p>Your password has been successfully reset.</p>
            <p>You can now log in with your new password.</p>
            <button
              onClick={() => navigate("/login")}
              className="btn verify-btn mt-3"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <>
            {email && (
              <div className="email-info">
                <p>
                  Creating new password for: <strong>{email}</strong>
                </p>
              </div>
            )}
            <p className="reset-password-subtitle">
              Please enter your new password below
            </p>

            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="form-group password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  disabled={isLoading}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>

              <div className="password-requirements">
                <p>Password must:</p>
                <ul>
                  <li className={password.length >= 8 ? "valid" : ""}>
                    Be at least 8 characters
                  </li>
                  <li className={password.length <= 20 ? "valid" : ""}>
                    Not exceed 20 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? "valid" : ""}>
                    Include at least one uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? "valid" : ""}>
                    Include at least one lowercase letter
                  </li>
                  <li className={/[0-9]/.test(password) ? "valid" : ""}>
                    Include at least one number
                  </li>
                  <li className={!/\s/.test(password) ? "valid" : ""}>
                    Not contain spaces
                  </li>
                </ul>
              </div>

              <div className="form-group password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm New Password"
                  disabled={isLoading}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>

              <button
                type="submit"
                className="btn primary-btn reset-btn"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
