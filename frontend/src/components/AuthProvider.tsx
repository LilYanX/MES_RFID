"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/utils/redux/hooks";
import { setUser } from "@/utils/services/authSlice";
import axios from "@/utils/config/axiosConfig";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    axios.get("/auth/users/me")
      .then(res => {
        dispatch(setUser(res.data));
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [dispatch, isLoginPage, router]);

  if (loading) return null;
  return <>{children}</>;
} 