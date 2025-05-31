import React from "react";
import { useState, useContext } from "react";
import { userContext } from "../../context/authContext";
export default function SignUpForm({ onClose, onSwitchToLogin }) {
  const { login } = useContext(userContext);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    //handle any errors when user signs up
    try {
      const response = await fetch("http://localhost:5050/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed");

      console.log("Signed up", data);
      onClose();
    } catch (error) {
      console.error("Signup error", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Create Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                type="text"
                placeholder="Name"
                value={signUpData.name}
                onChange={handleChange}
              ></input>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              ></input>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleChange}
              ></input>
            </div>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>
          <div className="px-6 pb-6 text-center border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none"
                onClick={() => {
                  onSwitchToLogin();
                  console.log("SIGN IN CLICK");
                }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
