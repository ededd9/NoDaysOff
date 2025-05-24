import { useState } from "react";
import axios from "axios";
export default function WorkoutForm({ onSubmit, onClose }) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const [day, setDay] = useState("");
  const year = date.getFullYear();
  const [exercises, setExercises] = useState({
    name: "",
    weight: 0,
    reps: 1,
    sets: 1,
    date: new Date().toISOString().split("T")[0],
  });
  const [dateOfWorkout, setDateOfWorkout] = useState("");

  const handleChange = (e) => {
    //seperate the target into name of element and its value
    const { name, value } = e.target;
    //update current exercise with its new value(e.g. name, weight, reps , set,date)
    setExercises((prev) => ({ ...prev, [name]: value }));
  };
  //when form is submitted, send new workout exercise for the day to API endpoint, log
  //if saved, if error occured log error
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      await axios.post(
        "http://localhost:5050/api/workouts",
        {
          date: new Date(exercises.date).toISOString(),
          name: exercises.name,
          sets: exercises.sets,
          reps: exercises.reps,
          weight: exercises.weight,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Workout saved:", exercises);
      setExercises({ name: "", weight: 0, reps: 0, sets: 0, date: "" }); // Reset form
      setDay("");
    } catch (error) {
      console.log("error saving workout", error);
    }

    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Exercise Name
            </label>
            <input
              required
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. Bench Press"
              value={exercises.name}
              onChange={handleChange}
            />
          </div>

          {/* Weight */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Weight (lbs/kg)
            </label>
            <input
              required
              type="number"
              name="weight"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. 135"
              value={exercises.weight}
              onChange={handleChange}
            />
          </div>

          {/* Sets and Reps */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Sets Dropdown */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sets
              </label>
              <select
                required
                name="sets"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={exercises.sets}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Reps Dropdown */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Reps
              </label>
              <select
                required
                name="reps"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={exercises.reps}
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
            </div>
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date of Workout :{" "}
            <input type="date" name="date" onChange={handleChange}></input>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Save Workout
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
}
