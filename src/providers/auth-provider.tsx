"use client";

import api from "@/lib/axios";
import { useEffect, useState, createContext } from "react";

export const AuthContext = createContext({
  loading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  setUser: (user: any) => {},
  setLoading: (loading: boolean) => {},
  setAccessToken: (accessToken: any) => {},
  setRefreshToken: (refreshToken: any) => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("accessToken");
    const token = raw ? JSON.parse(raw) : null;
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (accessToken) {
      setLoading(true);

      api
        .get("/auth/profile")
        .then((res) => console.log(res.data))
        .then((data) => {
          console.log(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        loading,
        setAccessToken,
        setRefreshToken,
        setLoading,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
