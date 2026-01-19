import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logInWithEmailAndPassword, signInWithGoogle } from "../firebase/auth";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is arriving after email verification
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("verified") === "true") {
      setVerificationSuccess(true);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // Store user session data
        sessionStorage.setItem("userAuth", "true");
        sessionStorage.setItem("userEmail", result.user.email);
        if (result.user.displayName) {
          sessionStorage.setItem("userName", result.user.displayName);
        }
        // Redirect to dashboard instead of home
        navigate("/dashboard");
      } else {
        setLoginError(result.error);
      }
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      setIsLoading(true);
      setLoginError(null);

      try {
        const { email, password } = formData;
        const result = await logInWithEmailAndPassword(email, password);

        if (result.success) {
          // Store user session data
          sessionStorage.setItem("userAuth", "true");
          sessionStorage.setItem("userEmail", result.user.email);
          if (result.user.displayName) {
            sessionStorage.setItem("userName", result.user.displayName);
          }
          // Direct login - redirect to dashboard
          navigate("/dashboard");
        } else {
          setLoginError(result.error);

          if (result.error.toLowerCase().includes("password")) {
            document.getElementById("password").focus();
          } else if (result.error.toLowerCase().includes("email")) {
            document.getElementById("email").focus();
          }
        }
      } catch (error) {
        setLoginError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to your MyPlantExpert account</p>

        {loginError && (
          <div className="error-alert" role="alert">
            {loginError}
          </div>
        )}

        {verificationSuccess && (
          <div className="success-alert">
            Email verified successfully! You can now log in.
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          className="google-btn"
          onClick={handleGoogleSignIn}
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
          <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
        </button>

        <div className="separator">
          <span>or</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? "error" : ""}
              placeholder="Email Address"
            />
            {errors.email && touched.email && (
              <span className="error-message">{errors.email}</span>
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
              className={errors.password && touched.password ? "error" : ""}
              placeholder="Password"
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </span>
            {errors.password && touched.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="btn primary-btn login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="register-prompt">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
