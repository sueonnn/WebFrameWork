// // src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "../components/group/types";
import { USERS } from "../mock";

type AuthUser = User | null;

type AuthContextValue = {
  user: AuthUser;
  isLoggedIn: boolean;
  initializing: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "auth_user_id";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedId = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedId) {
        const found = USERS.find((u) => u.id === storedId) ?? null;
        setUser(found);
      }
    } catch (e) {
      console.error("Failed to read auth from storage", e);
    } finally {
      setInitializing(false);
    }
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    const found =
      USERS.find((u) => u.email === email && u.password === password) ?? null;

    if (!found) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    setUser(found);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, found.id);
    } catch (e) {
      console.error("Failed to save auth to storage", e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove auth from storage", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        initializing,
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
