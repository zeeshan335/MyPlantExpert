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

// Save a breeding log entry
export const saveBreedingLog = async (userEmail, logData) => {
  try {
    const logsRef = collection(db, "breedingLogs");
    const newLog = {
      userEmail,
      ...logData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(logsRef, newLog);
    console.log("Breeding log saved with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving breeding log:", error);
    return { success: false, error: error.message };
  }
};

// Get breeding logs for a user
export const getBreedingLogs = async (userEmail) => {
  try {
    const logsRef = collection(db, "breedingLogs");
    const q = query(
      logsRef,
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Fetched breeding logs:", logs.length);
    return logs;
  } catch (error) {
    console.error("Error fetching breeding logs:", error);
    return [];
  }
};

// Delete a breeding log
export const deleteBreedingLog = async (logId) => {
  try {
    await deleteDoc(doc(db, "breedingLogs", logId));
    console.log("Breeding log deleted:", logId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting breeding log:", error);
    return { success: false, error: error.message };
  }
};
