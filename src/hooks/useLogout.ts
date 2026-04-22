"use client";
import { useCallback } from "react";

export function useLogout() {
  return useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }, []);
}
