"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth.store";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  // 🚀 Redirect khi CHƯA LOGIN
  useEffect(() => {
    if (!hasHydrated) return;

    if (user === null) {
      router.replace("/auth");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // ⏳ Chưa hydrate
  // if (!hasHydrated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       Đang kiểm tra đăng nhập...
  //     </div>
  //   );
  // }

  // ❌ Chưa login → chờ redirect
  // if (!isAuthenticated) {
  //   return null;
  // }

  // ❌ Đã login nhưng KHÔNG có quyền
  if (user != null && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow text-center">
          <h1 className="text-xl font-semibold mb-2">
            🚫 Không có quyền truy cập
          </h1>
          <p className="text-zinc-500">
            Tài khoản của bạn không có quyền quản trị.
          </p>
        </div>
      </div>
    );
  }
  // if (user === null)
  // ✅ OK
  return <>{children}</>;
}
