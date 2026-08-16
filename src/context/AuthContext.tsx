"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ── Types ──────────────────────────────────────────────────────── */
export type UserRole = "CUSTOMER" | "TECHNICIAN" | "TECHNICIAN_PENDING" | "TECHNICIAN_REJECTED" | "REJECTED" | "COORDINATOR" | "ADMIN";

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  streetAddress?: string;
  zipCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;

  street?: string;
  city?: string;
  postalCode?: string;

  avatar?: string;
  avatarUrl?: string;

  age?: number | string;
  ageCategory?: string;
  gender?: string;
  address?: UserAddress;

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

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getToken: () => string | null;
  setSession: (user: User, token: string) => void;
  fetchProfile: () => Promise<User | null>; // <--- Added fetchProfile here
  setUserProfile: (data: ProfileData) => Promise<{ success: boolean; error?: string }>;
  setRole: (role: UserRole) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Helpers ────────────────────────────────────────────────────── */
const STORAGE_SESSION_KEY = "homefixpro_session";
const STORAGE_TOKEN_KEY = "homefixpro_token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function getRoleBasedRoute(role?: string, onboardingCompleted?: boolean): string {
  const roleUpper = role?.toUpperCase().trim();
  switch (roleUpper) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin/dashboard";
    case "COORDINATOR":
      return "/coordinator/dashboard";
    case "CUSTOMER":
      return onboardingCompleted === false ? "/onboarding/details" : "/customer";
    case "TECHNICIAN":
      return "/technician";
    case "TECHNICIAN_PENDING":
      return "/technician/pending";
    case "TECHNICIAN_REJECTED":
    case "REJECTED":
      return "/technician/rejected";
    default:
      return onboardingCompleted === false ? "/onboarding/details" : "/customer";
  }
}

function getStoredSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user") || localStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: User, token: string, notifySync = true) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
  if (token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem("token", token);
  }
  if (notifySync && typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage_sync"));
  }
}

function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem("token");
    Object.keys(localStorage).forEach((key) => {
      if (key.includes("supabase") || key.includes("sb-") || key.includes("auth")) {
        localStorage.removeItem(key);
      }
    });
    window.dispatchEvent(new Event("storage_sync"));
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem(STORAGE_TOKEN_KEY);
}

/* ── Provider ───────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /** Fetch latest profile directly from Backend (GET /users/profile) */
  const fetchProfile = useCallback(async (): Promise<User | null> => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return null;
    }

    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        const fetchedUser: User = resData.data.user || resData.data;
        setUser(fetchedUser);
        saveSession(fetchedUser, token, false);
        return fetchedUser;
      }

      if (res.status === 401) {
        clearSession();
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user profile from server:", err);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    const handleSync = () => {
      const session = getStoredSession();
      setUser(session);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleSync);
      window.addEventListener("storage_sync", handleSync);
    }

    const session = getStoredSession();
    if (session) {
      setUser(session);
    }
    // Pull fresh data from backend on mount
    fetchProfile();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleSync);
        window.removeEventListener("storage_sync", handleSync);
      }
    };
  }, [fetchProfile]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail || !password) {
        return { success: false, error: "Please fill in all fields." };
      }

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

        const targetRoute = getRoleBasedRoute(sessionUser.role, sessionUser.onboardingCompleted);
        router.replace(targetRoute);
        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Network error. Please try again." };
      }
    },
    [router],
  );

  const setSession = useCallback((sessionUser: User, token: string) => {
    setUser(sessionUser);
    saveSession(sessionUser, token);
  }, []);

  const loginWithGoogle = useCallback(
    async (param?: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const dest = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";
        const redirectTarget = param && (param.startsWith("http") || param.includes("/")) ? param : dest;

        // If the parameter is a Google ID token or token string (POST flow)
        if (param && !param.startsWith("http") && !param.includes("/")) {
          const res = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: param }),
          }).catch((err) => {
            throw new Error(err.message || "Unable to connect to authentication server. Please verify backend server is running.");
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Google authentication failed");
          }

          const resData = await res.json();
          const token = resData.token || resData.data?.access_token || resData.data?.token;
          const sessionUser = resData.user || resData.data?.user;

          if (token && sessionUser) {
            setUser(sessionUser);
            saveSession(sessionUser, token);
          }
          return { success: true };
        } else {
          // Standard GET Redirect Flow
          const response = await fetch(`${API_URL}/auth/google?redirectTo=${encodeURIComponent(redirectTarget)}`).catch((err) => {
            throw new Error(err.message || "Unable to connect to authentication server. Please verify backend server is running.");
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to initiate Google sign in");
          }

          const data = await response.json();

          if (!data.success || !data.data?.url) {
            return { success: false, error: data.message || "Failed to initiate Google sign in." };
          }

          if (typeof window !== "undefined") {
            window.location.href = data.data.url;
          }
          return { success: true };
        }
      } catch (err: any) {
        console.error("Google login fetch error:", err);
        return {
          success: false,
          error: err.message || "Unable to connect to authentication server. Please verify backend server is running."
        };
      }
    },
    []
  );

  const signup = useCallback(
    async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
      const { name, email, phone, password, confirmPassword, gender, street, city, postalCode } = data;
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: trimmedEmail,
            phone: phone.trim(),
            password,
            gender: gender || null,
            street: street || null,
            city: city || null,
            postalCode: postalCode || null,
          }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          return { success: false, error: resData.message || "Failed to create account." };
        }

        const sessionUser: User = resData.data.user;
        const token = resData.data.access_token;

        setUser(sessionUser);
        saveSession(sessionUser, token);

        const isSpecialRole = sessionUser.role === "COORDINATOR" || sessionUser.role === "ADMIN";
        if (!sessionUser.onboardingCompleted && !isSpecialRole) {
          router.push("/onboarding/details");
        } else {
          router.push(getRoleBasedRoute(sessionUser.role));
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

  /** Save profile details to Backend */
  const setUserProfile = useCallback(async (data: ProfileData): Promise<{ success: boolean; error?: string }> => {
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          age: data.age,
          gender: data.gender,
          street: data.address?.street,
          city: data.address?.city,
          postalCode: data.address?.postalCode,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.message || "Failed to save profile." };
      }

      setUser((prev) => {
  if (!prev) return prev;

  const updated: User = {
    ...prev,
    name: data.name,
    phone: data.phone || prev.phone,
    ageCategory: data.age,
    age: data.age,
    gender: data.gender,

    street: data.address.street,
    city: data.address.city,
    postalCode: data.address.postalCode,

    address: data.address,
  };

  saveSession(updated, token || "");
  return updated;
});

      return { success: true };
    } catch (err: any) {
      console.error("Error updating user profile on server:", err);
      return { success: false, error: err.message || "Network error" };
    }
  }, []);

  /** Save user role step to Backend */
  const setRole = useCallback(async (role: UserRole): Promise<{ success: boolean; error?: string }> => {
    const token = getToken();

    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, role };
      saveSession(updated, token || "");
      return updated;
    });

    try {
      await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ role }),
      });
    } catch (err) {
      console.error("Error setting user role on server:", err);
    }

    return { success: true };
  }, []);

  /** Complete onboarding step in Backend */
  const completeOnboarding = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    const token = getToken();

    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, onboardingCompleted: true };
      saveSession(updated, token || "");
      return updated;
    });

    try {
      await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ onboardingCompleted: true }),
      });
    } catch (err) {
      console.error("Error marking onboarding complete on server:", err);
    }

    return { success: true };
  }, []);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage_sync"));
      }
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loading: isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        getToken,
        setSession,
        fetchProfile,
        setUserProfile,
        setRole,
        completeOnboarding,
        updateUser,
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