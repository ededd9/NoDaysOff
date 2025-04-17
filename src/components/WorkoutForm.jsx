import { useState } from "react";
export default function WorkoutForm({ onSubmit }) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const [day, setDay] = useState("");
  const year = date.getFullYear();
  const [exercises, setExercises] = useState({
    name: "",
    weight: 0,
    reps: 1,
    sets: 1,
    date: "",
  });
  const [dateOfWorkout, setDateOfWorkout] = useState("");
  const handleChange = (e) => {
    setExercises((prev) => ({ ...prev, date: e.target.value }));
    setDay(exercises.date);
    console.log(exercises.date);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(exercises); // Send data back to parent
    setExercises({ name: "", weight: 0, reps: 0, sets: 0, date: "" }); // Reset form
    setDay("");
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. Bench Press"
              value={exercises.name}
              onChange={(e) =>
                setExercises((prev) => ({ ...prev, name: e.target.value }))
              }
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. 135"
              value={exercises.weight}
              onChange={(e) =>
                setExercises((prev) => ({ ...prev, weight: e.target.value }))
              }
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={exercises.sets}
                onChange={(e) =>
                  setExercises((prev) => ({
                    ...prev,
                    sets: parseInt(e.target.value),
                  }))
                }
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={exercises.reps}
                onChange={(e) =>
                  setExercises((prev) => ({
                    ...prev,
                    reps: parseInt(e.target.value),
                  }))
                }
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
            <input
              type="date"
              onChange={(e) =>
                setExercises((prev) => ({ ...prev, date: e.target.value }))
              }
            ></input>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Save Workout
          </button>
        </form>
      </div>
    </div>
  );
}
