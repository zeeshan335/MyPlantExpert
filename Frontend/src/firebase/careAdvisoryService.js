import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

// Save a care advisory
export const saveCareAdvisory = async (userEmail, advisoryData) => {
  try {
    const advisoriesRef = collection(db, "careAdvisories");
    const newAdvisory = {
      userEmail,
      ...advisoryData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(advisoriesRef, newAdvisory);
    console.log("Care advisory saved with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving care advisory:", error);
    return { success: false, error: error.message };
  }
};

// Get care advisories for a user
export const getCareAdvisories = async (userEmail) => {
  try {
    const advisoriesRef = collection(db, "careAdvisories");
    const q = query(
      advisoriesRef,
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const advisories = [];
    querySnapshot.forEach((doc) => {
      advisories.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Fetched care advisories:", advisories.length);
    return advisories;
  } catch (error) {
    console.error("Error fetching care advisories:", error);
    return [];
  }
};

// Delete a care advisory
export const deleteCareAdvisory = async (advisoryId) => {
  try {
    await deleteDoc(doc(db, "careAdvisories", advisoryId));
    console.log("Care advisory deleted:", advisoryId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting care advisory:", error);
    return { success: false, error: error.message };
  }
};
