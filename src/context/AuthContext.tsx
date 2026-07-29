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
  avatarUrl?: string;
  // Onboarding fields
  ageCategory?: string;
  gender?: string;
  address?: UserAddress;
  // Role & status
  role?: UserRole;
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
  logout: () => void;
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

/* ── Storage Keys ───────────────────────────────────────────────── */
const STORAGE_USERS_KEY = "fieldflow_users";
const STORAGE_SESSION_KEY = "fieldflow_session";

/* ── Helpers ────────────────────────────────────────────────────── */
type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: User) {
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ── Provider ───────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hydrate session on mount
  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail || !password) {
        return { success: false, error: "Please fill in all fields." };
      }

      const users = getStoredUsers();
      const found = users.find((u) => u.email === trimmedEmail && u.password === password);

      if (!found) {
        return { success: false, error: "Invalid email or password." };
      }

      // Restore full session (may have profile/role persisted)
      const existing = getSession();
      const sessionUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        // Restore persisted role/onboarding info if email matches
        ...(existing?.email === found.email
          ? {
              role: existing.role,
              onboardingCompleted: existing.onboardingCompleted,
              ageCategory: existing.ageCategory,
              gender: existing.gender,
              address: existing.address,
            }
          : {}),
      };
      setUser(sessionUser);
      saveSession(sessionUser);

      // Route based on onboarding status
      if (!sessionUser.onboardingCompleted) {
        router.push("/onboarding/details");
      } else {
        router.push("/dashboard");
      }
      return { success: true };
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

      const users = getStoredUsers();
      if (users.some((u) => u.email === trimmedEmail)) {
        return { success: false, error: "An account with this email already exists." };
      }

      const id = generateId();
      const newUser: StoredUser = { id, name: name.trim(), email: trimmedEmail, phone: phone.trim(), password };
      users.push(newUser);
      saveUsers(users);

      const sessionUser: User = {
        id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        onboardingCompleted: false,
      };
      setUser(sessionUser);
      saveSession(sessionUser);
      router.push("/onboarding/details");
      return { success: true };
    },
    [router],
  );

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
    router.push("/login");
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
      saveSession(updated);
      return updated;
    });
  }, []);

  /** Set user role (Step 2 onboarding) */
  const setRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, role };
      saveSession(updated);
      return updated;
    });
  }, []);

  /** Mark onboarding as complete */
  const completeOnboarding = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, onboardingCompleted: true };
      saveSession(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, setUserProfile, setRole, completeOnboarding }}
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
