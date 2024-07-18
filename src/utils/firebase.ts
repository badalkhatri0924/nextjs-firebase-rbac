import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
import { IUser } from "@/interfaces";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveUserCollection = async (user: IUser) => {
  if (!user.id) {
    return;
  }

  await setDoc(doc(db, "users", user.id), user);

  return user as IUser;
};
export const getUserCollectionByUserId = async (userId: string) => {
  if (!userId) {
    return null;
  }
  const userDoc = await getDoc(doc(db, "users", userId));
  const userData = (userDoc.data() as IUser) || {};
  return userData;
};
