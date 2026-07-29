"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ── Types ──────────────────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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
const STORAGE_USERS_KEY = "homefixpro_users";
const STORAGE_SESSION_KEY = "homefixpro_session";

function getStoredUsers(): Array<{ id: string; name: string; email: string; phone: string; password: string }> {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: Array<{ id: string; name: string; email: string; phone: string; password: string }>) {
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

      const sessionUser: User = { id: found.id, name: found.name, email: found.email };
      setUser(sessionUser);
      saveSession(sessionUser);
      router.push("/customer");
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
      const newUser = { id, name: name.trim(), email: trimmedEmail, phone: phone.trim(), password };
      users.push(newUser);
      saveUsers(users);

      const sessionUser: User = { id, name: newUser.name, email: newUser.email };
      setUser(sessionUser);
      saveSession(sessionUser);
      router.push("/customer");
      return { success: true };
    },
    [router],
  );

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
