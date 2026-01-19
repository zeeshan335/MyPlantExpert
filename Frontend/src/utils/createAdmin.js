import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export const createAdminUser = async () => {
  try {
    // Create admin user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "admin@myplantexpert.com",
      "Admin@123456"
    );

    const user = userCredential.user;

    // Add admin role in Firestore
    await setDoc(doc(db, "admins", user.uid), {
      isAdmin: true,
      email: user.email,
      role: "super_admin",
      createdAt: new Date().toISOString(),
      permissions: {
        manageUsers: true,
        manageOrders: true,
        manageProducts: true,
        viewAnalytics: true,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@myplantexpert.com");
    console.log("Password: Admin@123456");
    console.log("UID:", user.uid);

    return { success: true, uid: user.uid };
  } catch (error) {
    console.error("❌ Error creating admin:", error);

    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Admin user already exists with this email");
      console.log("📝 Use these credentials to login:");
      console.log("Email: admin@myplantexpert.com");
      console.log("Password: Admin@123456");
      console.log(
        "\n⚠️ If password is different, you need to reset it in Firebase Console"
      );
    }

    return { success: false, error: error.message };
  }
};
