import { createContext, useContext, useState, useCallback } from "react";
import { AuthApi, setSession, clearSession, getStoredUser, getToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());

  const login = useCallback(async (email, password) => {
    const res = await AuthApi.login({ email, password });
    const loggedInUser = {
      id: res.userId,
      name: res.name,
      email: res.email,
      role: res.role,
    };
    setSession(res.token, loggedInUser);
    setToken(res.token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    // Registration always creates a STUDENT account (see
    // AuthService.register on the backend - there's no way to self-serve
    // register as a club/campus admin, by design). We log the user in right
    // after so they land straight in the app instead of re-typing creds.
    await AuthApi.register(payload);
    return login(payload.email, payload.password);
  }, [login]);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
