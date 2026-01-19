import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase/auth";
import "./Register.css";

const Register = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Touched state to track which fields have been interacted with
  const [touched, setTouched] = useState({});

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add loading and success/error states
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate field on change if it has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Handle blur events to mark fields as touched
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Full name is required";
        } else if (value.trim().length < 2) {
          newErrors.fullName = "Full name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          newErrors.fullName = "Full name cannot exceed 50 characters";
        } else if (/\d/.test(value)) {
          newErrors.fullName = "Full name cannot contain numbers";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.fullName = "Full name can only contain letters and spaces";
        } else if (/\s{2,}/.test(value)) {
          newErrors.fullName =
            "Full name cannot have multiple consecutive spaces";
        } else {
          delete newErrors.fullName;
        }
        break;

      case "email":
        const emailValue = value.trim().toLowerCase();
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailValue.includes("@")) {
          newErrors.email = "Email must contain @ symbol";
        } else if (!emailValue.includes(".")) {
          newErrors.email = "Email must contain a domain (e.g., .com)";
        } else if (emailValue.startsWith("@") || emailValue.startsWith(".")) {
          newErrors.email = "Email cannot start with @ or .";
        } else if (emailValue.endsWith("@") || emailValue.endsWith(".")) {
          newErrors.email = "Email cannot end with @ or .";
        } else if (/\s/.test(emailValue)) {
          newErrors.email = "Email cannot contain spaces";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)
        ) {
          newErrors.email = "Please enter a valid email address";
        } else if (/\.{2,}/.test(emailValue)) {
          newErrors.email = "Email cannot have consecutive dots";
        } else if (/@.*@/.test(emailValue)) {
          newErrors.email = "Email can only have one @ symbol";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (/\s/.test(value)) {
          newErrors.password = "Password cannot contain spaces";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (value.length > 20) {
          newErrors.password = "Password cannot exceed 20 characters";
        } else if (!/[a-z]/.test(value)) {
          newErrors.password =
            "Password must contain at least one lowercase letter";
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password =
            "Password must contain at least one uppercase letter";
        } else if (!/\d/.test(value)) {
          newErrors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
          newErrors.password =
            "Password must contain at least one special character (!@#$%^&*)";
        } else {
          delete newErrors.password;
        }

        // Check confirm password match if it exists
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else if (formData.password && value === formData.password) {
          delete newErrors.confirmPassword;
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    const { fullName, email, password, confirmPassword } = formData;

    // Full name validation
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = "Full name is required";
    } else if (trimmedName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    } else if (trimmedName.length > 50) {
      newErrors.fullName = "Full name cannot exceed 50 characters";
    } else if (/\d/.test(trimmedName)) {
      newErrors.fullName = "Full name cannot contain numbers";
    } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      newErrors.fullName = "Full name can only contain letters and spaces";
    } else if (/\s{2,}/.test(trimmedName)) {
      newErrors.fullName = "Full name cannot have multiple consecutive spaces";
    }

    // Email validation
    const emailValue = email.trim().toLowerCase();
    if (!emailValue) {
      newErrors.email = "Email is required";
    } else if (!emailValue.includes("@")) {
      newErrors.email = "Email must contain @ symbol";
    } else if (!emailValue.includes(".")) {
      newErrors.email = "Email must contain a domain (e.g., .com)";
    } else if (emailValue.startsWith("@") || emailValue.startsWith(".")) {
      newErrors.email = "Email cannot start with @ or .";
    } else if (emailValue.endsWith("@") || emailValue.endsWith(".")) {
      newErrors.email = "Email cannot end with @ or .";
    } else if (/\s/.test(emailValue)) {
      newErrors.email = "Email cannot contain spaces";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)
    ) {
      newErrors.email = "Please enter a valid email address";
    } else if (/\.{2,}/.test(emailValue)) {
      newErrors.email = "Email cannot have consecutive dots";
    } else if (/@.*@/.test(emailValue)) {
      newErrors.email = "Email can only have one @ symbol";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (/\s/.test(password)) {
      newErrors.password = "Password cannot contain spaces";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (password.length > 20) {
      newErrors.password = "Password cannot exceed 20 characters";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character (!@#$%^&*)";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields on submit
    const formErrors = validateForm();
    setErrors(formErrors);

    // If there are errors, do not submit
    if (Object.keys(formErrors).length > 0) {
      // Scroll to first error
      const firstError = Object.keys(formErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsLoading(true);
    setRegisterError(null);
    setRegisterSuccess(false);

    try {
      // Trim and format data before submission
      const cleanedData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // Register user
      const result = await registerWithEmailAndPassword(
        cleanedData.email,
        cleanedData.password,
        cleanedData.fullName
      );

      if (result.success) {
        setRegisterSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTouched({});
        setErrors({});
      } else {
        setRegisterError(result.error);
      }
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setRegisterError(null);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // Store user session data
        sessionStorage.setItem("userAuth", "true");
        sessionStorage.setItem("userEmail", result.user.email);
        if (result.user.displayName) {
          sessionStorage.setItem("userName", result.user.displayName);
        }
        setRegisterSuccess(true);
        // Redirect to dashboard instead of home
        navigate("/dashboard");
      } else {
        setRegisterError(result.error);
      }
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <p className="register-subtitle">
          Join MyPlantExpert and start your plant journey
        </p>

        {registerError && <div className="error-alert">{registerError}</div>}
        {registerSuccess && (
          <div className="success-alert">
            <h4>Registration successful!</h4>
            <p>
              We have sent you a verification email. Please check your inbox and
              verify your email address.
            </p>
            <p className="expire-warning">
              The verification link will expire in one hour.
            </p>
            <button
              className="btn verify-btn"
              onClick={() => navigate("/login")}
            >
              Okay
            </button>
          </div>
        )}

        {/* Google Sign Up Button */}
        <button
          className="google-btn"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <div className="google-icon-wrapper">
            <svg
              className="google-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </div>
          <span>{isLoading ? "Signing in..." : "Sign up with Google"}</span>
        </button>

        <div className="separator">
          <span>or</span>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.fullName && errors.fullName ? "error" : ""}
              placeholder="Full Name"
            />
            {touched.fullName && errors.fullName && (
              <div className="error-message">{errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? "error" : ""}
              placeholder="Email"
            />
            {touched.email && errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && errors.password ? "error" : ""}
              placeholder="Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              style={{ top: "60%" }} // Adjusted vertical alignment
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
            {touched.password && errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <div className="form-group password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched.confirmPassword && errors.confirmPassword ? "error" : ""
              }
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ top: "60%" }} // Adjusted vertical alignment
            >
              {showConfirmPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn primary-btn register-btn"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="login-prompt">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
