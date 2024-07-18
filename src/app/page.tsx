"use client";

import Header from "@/components/header";
import { Loader } from "@/components/loader";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const auth = useAuth();
  if (auth.loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      Home Page
    </div>
  );
}
