import React from "react";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const userContext = createContext();

export default function AuthContext({ children }) {
  //user is logged out so user is null
  const [user, setUser] = useState(null);
  //check if user has already been logged in, if so, then when page refreshes, keep user state logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  //const navigate = useNavigate();
  //login user state
  const login = (userData, token) => {
    setUser(userData);
    //storing data info in local storage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    // Navigate("/home");
    // navigate("/home");
  };
  const logout = () => {
    console.log("User logging out - clearing all data");
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
