import { PrivateRoute } from "@/components/shared/PrivateRoute";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <PrivateRoute />
      Restricted Page
    </main>
  );
}
