import React, { useTransition } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import EditForm from "./EditForm";
export default function WorkoutModal({ workouts, onClose, fetchUser }) {
  console.log("Sending token:", `Bearer ${localStorage.getItem("token")}`);
  console.log("Props:", { workouts, onClose, fetchUser });
  console.log("workouts for this day:", workouts);
  const token = localStorage.getItem("token");
  const user = useAuth();
  const [id, setId] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState(null);
  const handleEdit = (exercise, id) => {
    setExerciseToEdit(exercise);
    setId(id);
    setShowEditForm(true);
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
        }
      );
      if (res.status === 401 || res.status === 403) {
        console.warn("Token expired, trying to refresh...");
        // Attempt to refresh token
        const refreshRes = await fetch(
          "http://localhost:5050/api/auth/refresh",
          {
            method: "POST",
            credentials: "include",
          }
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
            }
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
      />
    );
  }
  return (
    <>
      {workouts && workouts.length > 0 ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {workouts[0]?.date?.split("T")[0]}
            </h2>

            {workouts.map((workout, workoutIndex) => (
              <div key={workoutIndex} className="mb-4 border-b pb-2">
                {workout.exercises.map((exercise, exerciseIndex) => {
                  console.log(`Inside WorkoutModal: exercise:`, exercise);
                  return (
                    <div key={exerciseIndex}>
                      <h3 className="font-semibold flex justify-between items-center">
                        {exercise.name}
                        <button
                          className="text-sm text-blue-500 hover:underline ml-4"
                          onClick={() => handleEdit(exercise, workout._id)}
                        >
                          Edit
                        </button>

                        <button
                          className="text-sm text-blue-500 hover:underline ml-4"
                          onClick={() =>
                            handleDeleteExercise(workout._id, exerciseIndex)
                          }
                        >
                          Delete
                        </button>
                      </h3>
                      {exercise.sets.map((set, setIndex) => (
                        <p key={setIndex}>
                          Set: {set.setNumber} | Reps: {set.reps} | Weight:{" "}
                          {set.weight}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}

            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-2">No workouts yet</h2>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {console.log("Inside WorkoutModal: No workouts yet")}
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
