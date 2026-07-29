"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ── Types ──────────────────────────────────────────────────────── */
export type UserRole = "CUSTOMER" | "TECHNICIAN" | "TECHNICIAN_PENDING" | "COORDINATOR" | "ADMIN";

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  // Onboarding fields
  ageCategory?: string;
  gender?: string;
  address?: UserAddress;
  // Role & status
  role?: UserRole | string;
  onboardingCompleted?: boolean;
}

export interface ProfileData {
  name: string;
  phone: string;
  age: string;
  gender: string;
  address: UserAddress;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getToken: () => string | null;
  setUserProfile: (data: ProfileData) => void;
  setRole: (role: UserRole) => void;
  completeOnboarding: () => void;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Helpers ────────────────────────────────────────────────────── */
const STORAGE_SESSION_KEY = "homefixpro_session";
const STORAGE_TOKEN_KEY = "homefixpro_token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getStoredSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: User, token: string) {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
  if (token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

/* ── Provider ───────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hydrate session on mount
  useEffect(() => {
    const session = getStoredSession();
    if (session) setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail || !password) {
        return { success: false, error: "Please fill in all fields." };
      }

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: trimmedEmail, password }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          return { success: false, error: data.message || "Invalid email or password." };
        }

        const sessionUser: User = data.data.user;
        const token = data.data.access_token;
        
        setUser(sessionUser);
        saveSession(sessionUser, token);

        // Route based on onboarding status
        if (!sessionUser.onboardingCompleted) {
          router.push("/onboarding/details");
        } else {
          router.push("/dashboard");
        }
        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [router],
  );

  const signup = useCallback(
    async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
      const { name, email, phone, password, confirmPassword } = data;
      const trimmedEmail = email.trim().toLowerCase();

      if (!name.trim() || !trimmedEmail || !phone.trim() || !password) {
        return { success: false, error: "Please fill in all fields." };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return { success: false, error: "Please enter a valid email address." };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }

      if (password !== confirmPassword) {
        return { success: false, error: "Passwords do not match." };
      }

      try {
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name.trim(), email: trimmedEmail, phone: phone.trim(), password }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          return { success: false, error: resData.message || "Failed to create account." };
        }

        const sessionUser: User = resData.data.user;
        const token = resData.data.access_token;
        
        setUser(sessionUser);
        saveSession(sessionUser, token);

        if (!sessionUser.onboardingCompleted) {
          router.push("/onboarding/details");
        } else {
          router.push("/dashboard");
        }
        return { success: true };
      } catch (error) {
        console.error("Signup error:", error);
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      clearSession();
      router.push("/login");
    }
  }, [router]);

  /** Save profile details from Step 1 onboarding */
  const setUserProfile = useCallback((data: ProfileData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = {
        ...prev,
        name: data.name,
        phone: data.phone || prev.phone,
        ageCategory: data.age,
        gender: data.gender,
        address: data.address,
      };
      saveSession(updated, getToken() || "");
      return updated;
    });
  }, []);

  /** Set user role (Step 2 onboarding) */
  const setRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, role };
      saveSession(updated, getToken() || "");
      return updated;
    });
  }, []);

  /** Mark onboarding as complete */
  const completeOnboarding = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, onboardingCompleted: true };
      saveSession(updated, getToken() || "");
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        getToken,
        setUserProfile,
        setRole,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────────────── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
