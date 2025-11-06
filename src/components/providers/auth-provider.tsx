"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Parse and load user from localStorage
 * Returns null if no user found or parsing fails
 */
function loadUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  
  const storedUser = localStorage.getItem("leadmanager_user");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    return {
      ...parsedUser,
      createdAt: new Date(parsedUser.createdAt),
    };
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    localStorage.removeItem("leadmanager_user");
    return null;
  }
}

/**
 * Mock authentication provider using localStorage
 * Simulates user login/logout for development
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUserFromStorage);

  const login = (role: UserRole) => {
    // Create a mock user based on the selected role
    const mockUsers: Record<UserRole, User> = {
      SELLER: {
        id: "seller-1",
        email: "seller@leadmanager.com",
        name: "John Seller",
        role: "SELLER",
        createdAt: new Date(),
      },
      LEAD_MANAGER: {
        id: "lead-manager-1",
        email: "manager@leadmanager.com",
        name: "Jane Manager",
        role: "LEAD_MANAGER",
        createdAt: new Date(),
      },
      ADMIN: {
        id: "admin-1",
        email: "admin@leadmanager.com",
        name: "Admin User",
        role: "ADMIN",
        createdAt: new Date(),
      },
    };

    const newUser = mockUsers[role];
    setUser(newUser);
    localStorage.setItem("leadmanager_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("leadmanager_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * @returns Authentication context with user, login, logout, and isAuthenticated
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
