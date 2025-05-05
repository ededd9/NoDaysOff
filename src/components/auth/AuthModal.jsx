import { useState, useEffect } from "react";
import SignUpForm from "./SignUpForm";
import { useAuth } from "../../context/authContext";
import LoginForm from "./LoginForm";
import React from "react";

export default function AuthModal({ initialForm = "signup", onClose }) {
  const [currentForm, setCurrentForm] = useState(initialForm);
  const { user } = useAuth();
  const switchToLogin = () => setCurrentForm("login");
  const switchToSignup = () => setCurrentForm("signup");
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);
  return (
    <>
      {currentForm === "signup" ? (
        <SignUpForm onClose={onClose} onSwitchToLogin={switchToLogin} />
      ) : (
        <LoginForm onClose={onClose} onSwitchToSignup={switchToSignup} />
      )}
    </>
  );
}
