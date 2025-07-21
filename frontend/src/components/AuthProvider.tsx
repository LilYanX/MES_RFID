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
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || triedFetch) return;
    setTriedFetch(true);
    // Appelle le backend pour récupérer l'utilisateur courant
    axios.get("/auth/users/me")
      .then(res => {
        console.log("[AuthProvider] Utilisateur courant récupéré:", res.data);
        dispatch(setUser(res.data));
      })
      .catch(err => {
        console.warn("[AuthProvider] Aucun utilisateur courant (non authentifié)");
        dispatch(setUser(null));
      })
      .finally(() => setLoading(false));
  }, [isClient, dispatch, triedFetch]);

  useEffect(() => {
    if (!loading && (!user || Object.keys(user).length === 0) && isClient && !isLoginPage) {
      console.log("[AuthProvider] Redirection vers /login car user absent ou vide");
      router.replace("/login");
    }
  }, [loading, user, router, isClient, isLoginPage]);

  if (isLoginPage) return <>{children}</>;
  if (!isClient || loading) return null;
  if (!user || Object.keys(user).length === 0) return null;
  return <>{children}</>;
} 