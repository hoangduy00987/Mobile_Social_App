"use client";

import React, { createContext, useContext, useState } from "react";
import { AuthState } from "../types/auth.types";

interface AuthContextType {
  authUser: AuthState | null;
  setAuthUser: (user: AuthState | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUserState] = useState<AuthState | null>(null);

  const setAuthUser = (user: AuthState | null) => {
    setAuthUserState(user);
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
};
