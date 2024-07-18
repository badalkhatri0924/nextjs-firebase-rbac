import "server-only";
import { initAdmin } from "@/utils/firebaseAdmin";

async function isSuperAdmin(uid: string) {
  const admin = await initAdmin();
  const db = admin.firestore();
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    return userData && userData.role === "Admin";
  } catch (error) {
    console.error("Error checking user role: ", error);
    return false;
  }
}
async function getAdmins(idToken: string) {
  const admin = await initAdmin();

  const db = admin.firestore();
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const currentUserId = decodedToken.uid;

    // Check if the current user is a SUPER_ADMIN
    const isAdmin = await isSuperAdmin(currentUserId);

    if (isAdmin) {
      const userDoc = await db.collection("users").get();
      const users = userDoc.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        message: "User Record Fetched!",
        data: users,
      };
    } else {
      return { message: "Only SUPER_ADMIN can Fetch users.", error: true };
    }
  } catch (error) {
    return { message: `${error}`.replace("Error: ", ""), error: true };
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const isToken: any = formData.get("isToken") || "";

  const response = await getAdmins(isToken);
  return Response.json(response);
}
