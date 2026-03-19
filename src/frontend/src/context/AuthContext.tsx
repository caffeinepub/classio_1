import {
  type ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import type { UserRole, backendInterface } from "../backend";

export interface AuthUser {
  userId: string;
  role: UserRole;
  username: string;
  grade?: bigint;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  sessionActor: backendInterface | null;
  setSessionActor: (actor: backendInterface | null) => void;
  credentials: AuthCredentials | null;
  setCredentials: (creds: AuthCredentials | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [credentials, setCredentials] = useState<AuthCredentials | null>(null);
  const sessionActorRef = useRef<backendInterface | null>(null);
  const [, forceUpdate] = useState(0);

  const setSessionActor = (actor: backendInterface | null) => {
    sessionActorRef.current = actor;
    forceUpdate((n) => n + 1);
  };

  const logout = () => {
    setUser(null);
    setSessionActor(null);
    setCredentials(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        sessionActor: sessionActorRef.current,
        setSessionActor,
        credentials,
        setCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
