import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { firebaseConfig } from "@/utils/firebase";
import { AppDispatch } from "@/store";
import { fetchUser, setIsToken } from "@/store/apps/user";
import axios from "axios";
import { IUser } from "@/interfaces";

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<any | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  firebase.initializeApp(firebaseConfig);
  const firebaseAuth = firebase.auth();

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user?.toJSON()) {
        const userJson: any = user?.toJSON();
        if (userJson?.stsTokenManager?.accessToken) {
          dispatch(setIsToken(userJson?.stsTokenManager?.accessToken));
        }

        dispatch(fetchUser(user.uid));
        setIsLoggedIn(user?.toJSON());
      }
      setLoading(false);
    });
  }, [firebaseAuth, dispatch]);

  const logout = useCallback(async () => {
    await firebaseAuth.signOut();
    router.replace("/login");
  }, [firebaseAuth, router]);

  const login = async (email: string, password: string) => {
    logout();
    await firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((_userRecord) => {
        router.replace("/");
      })
      .catch(() => {});
  };

  const createNewUser = async (user: IUser) => {
    const formData = new FormData();
    formData.set("email", user.email);
    formData.set("name", user.name);
    formData.set("role", user.role);
    formData.set("password", user.password || "");
    formData.set("isToken", isLoggedIn.stsTokenManager?.accessToken);

    await axios.post("/api/create-user", formData);
  };

  return {
    logout,
    login,
    isLoggedIn,
    loading,
    createNewUser,
  };
};

export default useAuth;
