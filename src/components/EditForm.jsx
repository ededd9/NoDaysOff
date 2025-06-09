import React from "react";
import { useState } from "react";
import axios from "axios";
export default function EditForm({ exercise, id, onClose }) {
  console.log("passed through exercise: ", exercise, "workout id:", id);
  const [newExercise, setNewExercise] = useState({
    name: exercise.name,
    sets: exercise.sets.map((set) => ({
      setNumber: set.setNumber,
      reps: set.reps,
      weight: set.weight,
    })),
  });
  console.log(exercise.sets.length);
  console.log("new exercise:", newExercise);
  const handleChange = (e) => {
    //seperate the target into name of element and its value
    const { name, value, dataset } = e.target;
    const index = parseInt(dataset.index);
    //update current exercise with its new value(e.g. name, weight, reps , set,date)
    if (name === "name") {
      console.log("just name");
      setNewExercise((prev) => ({ ...prev, [name]: value }));
    } else {
      //update the set based on the index given

      setNewExercise((prev) => {
        const updatedSets = [...prev.sets];
        updatedSets[index] = {
          ...updatedSets[index],
          [name]: value,
        };
        return {
          ...prev,
          sets: updatedSets,
        };
      });
    }
    // console.log("some value changed", newExercise);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newExercise);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      //grab original workout id first
      const originalWorkoutReponse = await axios.get(
        `http://localhost:5050/api/workouts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const originalWorkout = originalWorkoutReponse.data;

      //edit workout through the exercises id
      const exerciseIndex = originalWorkout.exercises.findIndex(
        (ex) => ex._id === exercise._id
      );
      if (exerciseIndex !== -1) {
        originalWorkout.exercises[exerciseIndex] = {
          ...originalWorkout.exercises[exerciseIndex],
          ...newExercise,
        };
      }
      await axios.put(
        `http://localhost:5050/api/workouts/${id}`,
        originalWorkout,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("success");
      onClose();
    } catch (error) {
      console.log("Error updating workout", error);
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {exercise[0]?.date?.split("T")[0]}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 border-b pb-2">
              <h3 className="font-semibold flex justify-between items-center">
                <input
                  name="name"
                  placeholder={exercise.name}
                  value={newExercise.name}
                  onChange={handleChange}
                ></input>
              </h3>
              {exercise.sets.map((set, setIndex) => (
                <p key={setIndex}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Set {setIndex + 1}
                  </label>
                  {/* <select
                    placeholder={exercise.sets}
                    required
                    name="sets"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    value={newExercise.sets}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select> */}

                  <label className="block text-gray-700 text-sm font-bold mb-2"></label>
                  <>Reps</>
                  <select
                    placeholder={exercise.reps}
                    required
                    data-index={setIndex}
                    name="reps"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    value={newExercise.sets[setIndex].reps}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                      (num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      )
                    )}
                  </select>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Weight:
                    <input
                      name="weight"
                      data-index={setIndex}
                      placeholder={set.weight}
                      value={newExercise.sets[setIndex].weight}
                      onChange={handleChange}
                    ></input>
                  </label>
                </p>
              ))}
            </div>

            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
