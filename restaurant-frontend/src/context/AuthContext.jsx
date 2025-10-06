// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { loginAdminAPI, checkAuthAPI, logoutAdminAPI } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const data = await checkAuthAPI();
      if (data.success) {
        setIsAdmin(true);
        setCurrentUser(data.user);
      } else {
        setIsAdmin(false);
        setCurrentUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginAdminAPI(email, password);
    if (res.success) {
      setIsAdmin(true);
      setCurrentUser(res.user);
      return { success: true, dashboard: res.dashboard || "/dashboard" };
    }
    return { success: false, message: res.message || "Login failed" };
  };

  const logout = async () => {
    await logoutAdminAPI();
    setIsAdmin(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;