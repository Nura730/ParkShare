import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

const login = async (email, password) => {
  const data = await authService.login(email, password);

  // ✅ PERSIST USER FOR RELOADS
  localStorage.setItem("user", JSON.stringify(data.data.user));

  setUser(data.data.user);
  return data;
};


  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.data.user);
    return data;
  };

const logout = () => {
  authService.logout();
  localStorage.removeItem("user");
  setUser(null);
};


  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
