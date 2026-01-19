// Firebase authentication service

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
  confirmPasswordReset,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Register new user with email and password
export const registerWithEmailAndPassword = async (
  email,
  password,
  fullName
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await updateProfile(user, { displayName: fullName });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName,
      email,
      createdAt: new Date(),
      emailVerified: user.emailVerified,
    });

    try {
      const actionCodeSettings = {
        url: window.location.origin + "/login?verified=true",
        handleCodeInApp: true,
      };
      await sendEmailVerification(user, actionCodeSettings);
      console.log("Verification email sent with redirect");
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    return {
      success: true,
      user,
      emailSent: true,
      message:
        "Registration successful! Please verify your email before logging in.",
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        error:
          "This email is already registered. Please try logging in instead.",
      };
    }

    return { success: false, error: error.message };
  }
};

// Sign in with email and password - SIMPLE LOGIN (MFA REMOVED)
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      user: res.user,
      message: "Login successful!",
    };
  } catch (error) {
    console.error("Login error:", error.code);

    switch (error.code) {
      case "auth/user-not-found":
        return {
          success: false,
          error: "No account found with this email. Please sign up.",
        };
      case "auth/wrong-password":
        return {
          success: false,
          error: "Incorrect password. Please try again.",
        };
      case "auth/invalid-credential":
        return {
          success: false,
          error:
            "Invalid login credentials. Please check your email and password.",
        };
      case "auth/invalid-email":
        return { success: false, error: "Invalid email format." };
      case "auth/too-many-requests":
        return {
          success: false,
          error:
            "Too many failed login attempts. Please try again later or reset your password.",
        };
      case "auth/user-disabled":
        return {
          success: false,
          error: "This account has been disabled. Please contact support.",
        };
      default:
        return { success: false, error: "Login failed. Please try again." };
    }
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        emailVerified: true,
        authProvider: "google",
      },
      { merge: true }
    );

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset password via email
export const sendPasswordReset = async (email) => {
  try {
    const actionCodeSettings = {
      url: window.location.origin + "/reset-password",
      handleCodeInApp: false,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);

    return {
      success: true,
      message: "Password reset email sent. The link will expire in one hour.",
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    if (error.code === "auth/user-not-found") {
      return {
        success: false,
        error: "No account found with this email address.",
      };
    } else if (error.code === "auth/invalid-email") {
      return { success: false, error: "Invalid email format." };
    }
    return { success: false, error: error.message };
  }
};

// Reset password with code and new password
export const resetPassword = async (oobCode, newPassword) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    return {
      success: true,
      message: "Password has been successfully reset.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);

    if (error.code === "auth/expired-action-code") {
      return {
        success: false,
        error:
          "This password reset link has expired. Please request a new one.",
      };
    } else if (error.code === "auth/invalid-action-code") {
      return {
        success: false,
        error: "Invalid password reset link. Please request a new one.",
      };
    } else if (error.code === "auth/weak-password") {
      return {
        success: false,
        error: "The password is too weak. Please choose a stronger password.",
      };
    } else {
      return {
        success: false,
        error: "Failed to reset password. Please try again.",
      };
    }
  }
};

// Sign out user
export const logout = () => {
  return signOut(auth);
};

// Also add a signOut alias for compatibility
export const signOutUser = () => {
  return signOut(auth);
};
