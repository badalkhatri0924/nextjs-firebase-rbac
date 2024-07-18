"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "../loader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAuth from "@/hooks/useAuth";

export const PrivateRoute = () => {
  const store = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  useEffect(() => {
    if (router) {
      if (!auth.loading && !auth.isLoggedIn) {
        router.replace("/login");
      }
    }
  }, [router, auth.isLoggedIn, auth.loading]);

  if (auth.loading) {
    return <Loader />;
  }

  if (store.user?.role !== "Admin" && pathname !== "/") {
    router.replace("/");
  }

  return <></>;
};
