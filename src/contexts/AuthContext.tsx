import React, { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "../components/group/types";
import { USERS } from "../mock";          

type AuthUser = User | null;

type AuthContextValue = {
  user: AuthUser;
  isLoggedIn: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);

  const loginWithEmail = async (email: string, password: string) => {
    const found = USERS.find((u) => u.email === email) ?? null;
    setUser(found);
  };

  const logout = () => {
    // 필요하면 여기서 Firebase signOut 같은 것도 호출 가능
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
