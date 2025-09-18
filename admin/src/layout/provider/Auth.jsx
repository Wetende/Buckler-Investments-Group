import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { axiosPrivate } from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadMe = async () => {
      try {
        setLoading(true);
        const { data } = await axiosPrivate.get("/auth/me");
        if (!mounted) return;
        setUser(data);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setUser(null);
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadMe();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ user, role: user?.role, loading, error, setUser }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const ProtectedRoute = ({ children, allow = [] }) => {
  const { loading, user, role } = useAuth();
  if (loading) return null; // could render a spinner if desired
  if (!user) {
    window.location.href = "/dashboard/auth-login";
    return null;
  }
  if (allow.length > 0 && !allow.includes(role)) {
    window.location.href = "/dashboard/";
    return null;
  }
  return children;
};

export const RoleHome = () => {
  const { loading, user, role } = useAuth();
  if (loading) return null;
  if (!user) {
    window.location.href = "/dashboard/auth-login";
    return null;
  }
  // Map roles to default landing route in the admin shell
  const roleToPath = {
    HOST: "/bnb-dashboard",
    TOUR_OPERATOR: "/tours-dashboard",
    VEHICLE_OWNER: "/cars-dashboard",
    AGENT: "/properties-dashboard",
    ADMIN: "/analytics",
    SUPER_ADMIN: "/analytics",
    USER: "/", // main
    GUEST: "/", // fallback
  };
  const path = roleToPath[role] || "/";
  window.location.href = `/dashboard${path === "/" ? "" : path}`;
  return null;
};


