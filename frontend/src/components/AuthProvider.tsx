"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { setUser } from "@/utils/services/authSlice";
import axios from "@/utils/config/axiosConfig";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [triedFetch, setTriedFetch] = useState(false);
  const [refreshTried, setRefreshTried] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || triedFetch) return;
    setTriedFetch(true);

    axios.get("/auth/users/me")
      .then(res => {
        dispatch(setUser(res.data));
      })
      .catch(err => {
        dispatch(setUser(null));
      })
      .finally(() => {
        setLoading(false);
        setRefreshTried(true);
      });
  }, [isClient, dispatch, triedFetch]);

  useEffect(() => {
    if (!loading && refreshTried && (!user || Object.keys(user).length === 0) && isClient && !isLoginPage) {
      console.log("[AuthProvider] Redirection vers /login car user absent ou vide après refresh éventuel");
      router.replace("/login");
    }
  }, [loading, refreshTried, user, router, isClient, isLoginPage]);

  if (isLoginPage) return <>{children}</>;
  if (!isClient || loading) return null;
  if (!user || Object.keys(user).length === 0) return null;
  return <>{children}</>;
} 