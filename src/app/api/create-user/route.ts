import "server-only";
import { IUser } from "@/interfaces";
import { initAdmin } from "@/utils/firebaseAdmin";

// const db = admin.firestore();

async function isSuperAdmin(uid: string) {
  try {
    const admin = await initAdmin();
    const db = admin.firestore();

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    return userData && userData.role === "Admin";
  } catch (error) {
    console.error("Error checking user role: ", error);
    return false;
  }
}
async function createFirebaseUser(idToken: string, user: IUser) {
  try {
    const admin = await initAdmin();
    const db = admin.firestore();

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const currentUserId = decodedToken.uid;

    // Check if the current user is a Admin
    const isAdmin = await isSuperAdmin(currentUserId);

    if (isAdmin) {
      // Create new Firebase user with email and password
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: user.password,
      });

      // Add new user to the users collection
      delete user.password;
      await db
        .collection("users")
        .doc(userRecord.uid)
        .set({
          ...user,
          id: userRecord.uid,
          createdAt: new Date(),
        });

      return {
        message: "New user created successfully!",
      };
    } else {
      return { message: "Only Admin can create new users.", error: true };
    }
  } catch (error) {
    return { message: `${error}`.replace("Error: ", ""), error: true };
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email: any = formData.get("email") || "";
  const name: any = formData.get("name") || "";
  const role: any = formData.get("role") || "";
  const password: any = formData.get("password") || "";
  const isToken: any = formData.get("isToken") || "";

  if (email && name && role && password && isToken) {
    const response = await createFirebaseUser(isToken, {
      email,
      name,
      role,
      password,
    });
    return Response.json(response);
  }

  return Response.json({
    message: "Invalid Data",
  });
}
