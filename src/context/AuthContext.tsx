import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionUser, getSession, clearSession, seedAdmin } from "../utils/auth";

interface AuthContextType {
  user: SessionUser | null;
  isLoading: boolean;
  setUser: (user: SessionUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedAdmin();
    const session = getSession();
    setUserState(session);
    setIsLoading(false);
  }, []);

  const setUser = (u: SessionUser | null) => setUserState(u);

  const logout = () => {
    clearSession();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}