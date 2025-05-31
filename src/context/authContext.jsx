import React from "react";
import { useContext, createContext, useState, useEffect } from "react";
export const userContext = createContext();

export default function AuthContext({ children }) {
  //user is logged out so user is null
  const [user, setUser] = useState(null);
  //check if user has already been logged in, if so, then when page refreshes, keep user state logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  //login user state
  const login = (userData) => {
    setUser(userData);
    //storing data info in local storage
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    //clear localstorage when logging out
    localStorage.removeItem("user");
  };

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error("useAUth must be used within a authContext");
  }
  return context;
}
