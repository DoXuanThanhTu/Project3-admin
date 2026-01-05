"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthInit() {
  const { getCurrentUser } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    getCurrentUser(); // 🔥 BẮT BUỘC
  }, [getCurrentUser]);

  return null;
}
