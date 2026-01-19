import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

// Create a new consultation booking
export const createConsultation = async (consultationData) => {
  console.log("🔵 Creating consultation with data:", consultationData);

  try {
    const consultationsRef = collection(db, "consultations");
    console.log("📁 Consultations collection reference created");

    const docRef = await addDoc(consultationsRef, {
      ...consultationData,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Consultation created successfully! ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating consultation:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    alert(`Error: ${error.message}`);
    return null;
  }
};

// Get user consultations
export const getUserConsultations = async (userEmail) => {
  console.log("🔵 Getting consultations for user:", userEmail);

  try {
    const consultationsRef = collection(db, "consultations");
    const q = query(
      consultationsRef,
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const consultations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Found consultations:", consultations.length);
    return consultations;
  } catch (error) {
    console.error("❌ Error getting consultations:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // If index error, try without orderBy
    if (error.code === "failed-precondition") {
      console.log("🔄 Retrying without orderBy...");
      try {
        const consultationsRef = collection(db, "consultations");
        const q = query(consultationsRef, where("userEmail", "==", userEmail));
        const querySnapshot = await getDocs(q);
        const consultations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          "✅ Found consultations (without orderBy):",
          consultations.length
        );
        return consultations;
      } catch (retryError) {
        console.error("❌ Retry failed:", retryError);
        return [];
      }
    }

    return [];
  }
};

// Cancel consultation
export const cancelConsultation = async (consultationId) => {
  console.log("🔵 Cancelling consultation:", consultationId);

  try {
    const consultationRef = doc(db, "consultations", consultationId);
    console.log("📄 Document reference created");

    await updateDoc(consultationRef, {
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Consultation cancelled successfully");
    return true;
  } catch (error) {
    console.error("❌ Error cancelling consultation:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // Show specific error to user
    if (error.code === "not-found") {
      alert("Consultation not found. It may have been already cancelled.");
    } else if (error.code === "permission-denied") {
      alert("You don't have permission to cancel this consultation.");
    } else {
      alert(`Error: ${error.message}`);
    }

    return false;
  }
};

// Update consultation status
export const updateConsultationStatus = async (consultationId, status) => {
  console.log("🔵 Updating consultation status:", consultationId, "->", status);

  try {
    const consultationRef = doc(db, "consultations", consultationId);
    await updateDoc(consultationRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    console.log("✅ Status updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Error updating consultation status:", error);
    return false;
  }
};

// Get active consultations (scheduled status only)
export const getActiveConsultations = async (userEmail) => {
  console.log("🔵 Getting active consultations for user:", userEmail);

  try {
    const consultationsRef = collection(db, "consultations");
    const q = query(
      consultationsRef,
      where("userEmail", "==", userEmail),
      where("status", "==", "scheduled")
    );

    const querySnapshot = await getDocs(q);
    const consultations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Found active consultations:", consultations.length);
    return consultations;
  } catch (error) {
    console.error("❌ Error getting active consultations:", error);
    return [];
  }
};
