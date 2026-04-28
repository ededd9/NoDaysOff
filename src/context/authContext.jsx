import React from "react";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const userContext = createContext();

export default function AuthContext({ children }) {
  //user is logged out so user is null
  const [user, setUser] = useState(null);
  //const navigate = useNavigate();
  //check if user has already been logged in, if so, then when page refreshes, keep user state logged in

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  //axios interceptor - catches any 401 across the whole app
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status == 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        }
        return Promise.reject(error);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
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

    if (navigate) {
      console.log("attempting to navigate to login");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 0);
      console.log("navigate called");
    } else {
      console.log("no navigate provided");
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <userContext.Provider value={{ user, login, logout, updateUser }}>
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
