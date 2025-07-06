import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
import WorkoutForm from "./WorkoutForm";
import SignUpForm from "./auth/SignUpForm";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "../context/authContext";
export default function Navbar({
  setWorkout,
  exercises,
  setExercises,
  fetchUser,
}) {
  const [showForm, setShowForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormType, setAuthFormType] = useState("signup");
  const { user, logout } = useAuth();
  //console.log("YOO", user);
  return (
    <>
      {showForm && (
        <WorkoutForm
          onSubmit={(newExercise) => {
            setWorkout((prev) => [...prev, newExercise]);
            setShowForm(false);
            fetchUser();
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <div className="flex space-x-8">
              <Link
                to="/home"
                style={{ textDecoration: "none" }}
                className="text-white hover:text-white font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/Feed"
                style={{ textDecoration: "none" }}
                className="text-white visited:text-white-300 no-underline hover:text-white font-medium transition-colors duration-200"
              >
                Feed
              </Link>
              <Link style={{ textDecoration: "none" }}>
                <button
                  variant="primary"
                  onClick={() => setShowForm(!showForm)}
                  className="mb-4 text-white"
                >
                  Add Workout
                </button>
              </Link>
              <Link
                to="/Progression"
                style={{ textDecoration: "none" }}
                className="text-white visited:text-gray-300 no-underline hover:text-white font-medium transition-colors duration-200"
              >
                Progress
              </Link>

              <Link
                to={`/Profile/${user?._id}`}
                style={{ textDecoration: "none" }}
                className="text-white visited:text-gray-300 no-underline hover:text-white font-medium transition-colors duration-200"
              >
                Profile
              </Link>
              {/* <Link
                to="/WorkoutSplit"
                className="text-white hover:text-white font-medium transition-colors duration-200"
              >
                Workout Split
              </Link> */}
              <Link style={{ textDecoration: "none" }}>
                {user ? (
                  <button
                    className="text-white hover:text-white font-medium transition-colors duration-200"
                    onClick={logout}
                  >
                    Log out
                  </button>
                ) : (
                  <button
                    className="text-white"
                    onClick={() => {
                      setShowAuthModal(true);
                    }}
                  >
                    Sign Up
                  </button>
                )}
              </Link>

              {showAuthModal && (
                <AuthModal
                  // initialForm={authFormType}
                  onClose={() => setShowAuthModal(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
