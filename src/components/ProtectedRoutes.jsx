import { React, useState } from "react";
import { useAuth } from "../context/authContext";
import AuthModal from "./auth/AuthModal";
export default function ProtectedRoutes({ children }) {
  //auth checking - valid user w token
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [showAuthModal, setShowAuthModal] = useState(false);
  //show access restricted screen instead of the targetted page
  if (!user || !token) {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Access Restricted
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in or sign up to unluck full access
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Login / Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }
  //if user is authenticated, show the protected page
  return children;
}
