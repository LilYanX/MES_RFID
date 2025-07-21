"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { getUserInfo } from "@/utils/services/authSlice";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // S'assurer qu'on est côté client avant tout
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!user) {
      const accessToken = typeof document !== "undefined"
        ? document.cookie.split("; ").find(row => row.startsWith("accessToken="))?.split("=")[1]
        : undefined;
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const uuid = payload.user.uuid;
          dispatch(getUserInfo(uuid)).finally(() => setLoading(false));
        } catch {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user, dispatch, isClient]);

  useEffect(() => {
    if (!loading && !user && isClient && !isLoginPage) {
      router.replace("/login");
    }
  }, [loading, user, router, isClient, isLoginPage]);

  if (isLoginPage) return <>{children}</>;
  if (!isClient || loading) return null;
  if (!user) return null;
  return <>{children}</>;
} 