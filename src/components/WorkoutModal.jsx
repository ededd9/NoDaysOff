import React, { useTransition } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import EditForm from "./EditForm";
export default function WorkoutModal({ workouts, onClose, fetchUser }) {
  // console.log("Props:", { workouts, onClose, fetchUser });
  // console.log("workouts for this day:", workouts);
  const token = localStorage.getItem("token");
  const user = useAuth();
  const [id, setId] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState(null);
  const handleEdit = (exercise, id) => {
    setExerciseToEdit(exercise);
    setId(id);
    setShowEditForm(true);
    console.log("OWRKOUT ID", id);
  };
  const handleDeleteExercise = async (workoutId, exerciseIndex) => {
    let token = localStorage.getItem("token");
    try {
      let res = await axios.delete(
        `http://localhost:5050/api/workouts/${workoutId}/exercises/${exerciseIndex}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: "true",
        },
      );
      if (res.status === 401 || res.status === 403) {
        console.warn("Token expired, trying to refresh...");
        // Attempt to refresh token
        const refreshRes = await fetch(
          "http://localhost:5050/api/auth/refresh",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.accessToken;
          localStorage.setItem("token", newToken);

          // Retry DELETE with new token
          res = await axios.delete(
            `http://localhost:5050/api/workouts/${workoutId}/exercises/${exerciseIndex}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${newToken}` },
              credentials: "include",
            },
          );
          console.log("Deleted successfully.");
        } else {
          throw new Error("Failed to refresh token");
        }
      }
      console.log("Deleted successfully.");
    } catch (err) {
      console.error("Error deleting exercise:", err.message);
    }
    onClose();
    fetchUser();
  };
  if (showEditForm && exerciseToEdit) {
    return (
      <EditForm
        exercise={exerciseToEdit}
        id={id}
        onClose={() => setShowEditForm(false)}
        fetchUser={fetchUser}
      />
    );
  }
  return (
    <>
      {workouts && workouts.length > 0 ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white border border-gray-100 rounded-lg p-5 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">
                  {workouts[0]?.date?.split("T")[0]}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {workouts.reduce((acc, w) => acc + w.exercises.length, 0)}{" "}
                  exercises
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-xs bg-gray-50 text-gray-500 border border-gray-100 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>

            <hr className="border-gray-100 mb-3" />

            {/* Exercises */}
            <div className="flex flex-col gap-3">
              {workouts.map((workout, workoutIndex) =>
                workout.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={`${workoutIndex}-${exerciseIndex}`}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{exercise.name}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(exercise, workout._id)}
                          className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-md hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteExercise(workout._id, exerciseIndex)
                          }
                          className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-md hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {exercise.sets.map((set, setIndex) => (
                        <span
                          key={setIndex}
                          className="text-xs bg-white border border-gray-100 rounded px-2 py-0.5 text-gray-500"
                        >
                          Set {set.setNumber} · {set.reps} reps · {set.weight}{" "}
                          lbs
                        </span>
                      ))}
                    </div>
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white border border-gray-100 rounded-lg p-5 w-full max-w-sm mx-4 pointer-events-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                {workouts[0]?.date?.split("T")[0]}
              </p>
              <button
                onClick={onClose}
                className="text-xs bg-gray-50 text-gray-500 border border-gray-100 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">No workouts logged</p>
              <p className="text-xs text-gray-400 mt-1">
                Click add workout to log one!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
  v;
}
