import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Sync from localStorage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ LOGIN
  const login = (userData, token) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  // ✅ DERIVED STATE
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ HOOK
export const useAuth = () => useContext(AuthContext);