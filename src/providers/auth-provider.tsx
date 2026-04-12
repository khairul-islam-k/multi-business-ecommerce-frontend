"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "@/lib/axios";
import { setUser, logout } from "@/store/auth-slice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get("/auth/profile");
        dispatch(setUser(res.data));
      } catch {
        dispatch(logout());
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
