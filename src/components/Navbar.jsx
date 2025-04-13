import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
import WorkoutForm from "./WorkoutForm";

export default function Navbar({ setWorkout, exercises, setExercises }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {showForm && (
        <WorkoutForm
          onSubmit={(newExercise) => {
            setWorkout((prev) => [...prev, newExercise]);
            setShowForm(false);
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
                className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/Stats"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
              >
                Progression
              </Link>
              {/* <Link
              to="/AddWorkout"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            > */}
              {/* Add Workout
            </Link> */}

              <button
                variant="primary"
                onClick={() => setShowForm(!showForm)}
                className="mb-4"
              >
                Add Workout
              </button>
              <Link
                to="/Profile"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
