"use client";

import { getCurrentUserApi, loginApi, logoutApi } from "@/lib/api/auth";
import { LoginFormData } from "@/lib/validations/auth";
import { mockDb } from "@/mock/mock-db";
import { User } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUserApi();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to load user session", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  // Protected route checking
  useEffect(() => {
    if (isLoading) return;

    const isAuthRoute = pathname === "/login";
    if (!user && !isAuthRoute) {
      router.replace("/login");
    } else if (user && isAuthRoute) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  const login = async (data: LoginFormData) => {
    try {
      const loggedInUser = await loginApi(data);
      setUser(loggedInUser);
      toast.success("Welcome back!", {
        description: `Signed in as ${loggedInUser.name}`,
      });
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error("Sign In Failed", { description: msg });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      toast.info("Signed Out", {
        description: "You have been securely signed out.",
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const resetDemoData = () => {
    mockDb.resetToInitial();
    toast.success("Demo Data Reset", {
      description: "Default clinical records and statistics have been restored.",
    });
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

