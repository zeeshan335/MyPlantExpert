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

// Save a probability result
export const saveProbabilityResult = async (userEmail, resultData) => {
  try {
    const resultsRef = collection(db, "probabilityResults");
    const newResult = {
      userEmail,
      ...resultData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(resultsRef, newResult);
    console.log("Probability result saved with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving probability result:", error);
    return { success: false, error: error.message };
  }
};

// Get probability results for a user
export const getProbabilityResults = async (userEmail) => {
  try {
    const resultsRef = collection(db, "probabilityResults");
    const q = query(
      resultsRef,
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Fetched probability results:", results.length);
    return results;
  } catch (error) {
    console.error("Error fetching probability results:", error);
    return [];
  }
};

// Delete a probability result
export const deleteProbabilityResult = async (resultId) => {
  try {
    await deleteDoc(doc(db, "probabilityResults", resultId));
    console.log("Probability result deleted:", resultId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting probability result:", error);
    return { success: false, error: error.message };
  }
};
