import { db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

// Save cross-breed result to Firestore
export const saveCrossBreedResult = async (userEmail, result) => {
  try {
    const crossBreedRef = collection(db, "crossBreedResults");
    const docRef = await addDoc(crossBreedRef, {
      userEmail,
      hybridName: result.name,
      parent1: result.parent1,
      parent2: result.parent2,
      category: result.category,
      water: result.water,
      sunlight: result.sunlight,
      successRate: result.successRate,
      description: result.description,
      createdAt: Timestamp.now(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving cross-breed result:", error);
    return { success: false, error: error.message };
  }
};

// Get all cross-breed results for a user
export const getUserCrossBreedResults = async (userEmail) => {
  try {
    const crossBreedRef = collection(db, "crossBreedResults");
    const q = query(
      crossBreedRef,
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

    return results;
  } catch (error) {
    console.error("Error getting cross-breed results:", error);
    return [];
  }
};

// Delete a cross-breed result
export const deleteCrossBreedResult = async (resultId) => {
  try {
    await deleteDoc(doc(db, "crossBreedResults", resultId));
    return true;
  } catch (error) {
    console.error("Error deleting cross-breed result:", error);
    return false;
  }
};
