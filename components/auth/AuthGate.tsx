"use client";

import useAuthStore from "@/stores/auth.store";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasHydrated, user } = useAuthStore();

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;
  if (user?.role !== "admin") return null;

  return <>{children}</>;
}
