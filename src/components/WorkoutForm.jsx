import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
export default function WorkoutForm({ onSubmit, onClose }) {
  const { user } = useAuth();
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
  //states used for searching,filtering a name from exercises names db
  const [exerciseNamesList, setExerciseNamesList] = useState([]);
  const [filteredExerciseNames, setFilteredExerciseNames] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(true);

  useEffect(() => {
    const getExercisesFromDB = async () => {
      try {
        //first grab only the names of the exercises, should be around 800ish unfiltered names
        const response = await fetch(
          "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json",
        );
        const data = await response.json();
        const names = data.map((exercise) => exercise.name);
        setExerciseNamesList(names);
        setLoadingExercises(false);
      } catch (err) {
        console.log("Some error occured fetching exercises:", err);
        setLoadingExercises(false);
      }
    };
    getExercisesFromDB();
  }, []);

  useEffect(() => {
    //dont do nothing if user is not searching anything(not typing in name input field)
    if (exercises.name.trim() === "") {
      setFilteredExerciseNames([]);
      setShowDropDown(false);
      return;
    }
    //console.log(exerciseNamesList);
    //filter the results as the field changes
    const filtered = exerciseNamesList.filter((exercise) =>
      exercise.toLowerCase().includes(exercises.name.toLowerCase()),
    );
    setFilteredExerciseNames(filtered.slice(0, 10));
    setShowDropDown(filtered.length > 0);
    //console.log(filteredExerciseNames);
  }, [exercises.name, exerciseNamesList]);
  if (!user) {
    return null;
  }
  //handle exercise selection from dropdown
  const handleExerciseSelect = (exerciseName) => {
    setExercises((prev) => ({ ...prev, name: exerciseName }));
  };
  //show dropdown if there is a match in users exercise name request
  const handleExerciseInputFocus = () => {
    if (filteredExerciseNames.length > 0) {
      setShowDropDown(true);
    }
  };
  //input blur to hide dropdown when an exercise is selected
  const handleExerciseInputBlur = () => {
    setTimeout(() => setShowDropDown(false), 200);
  };
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
        },
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
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-lg border border-gray-100 p-5 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium">Log workout</p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs bg-gray-50 text-gray-500 border border-gray-100 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>

        <hr className="border-gray-100 mb-4" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Exercise name */}
          <div className="relative">
            <label className="text-xs text-gray-400 block mb-1">
              Exercise name
            </label>
            <input
              id="name"
              required
              name="name"
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs bg-gray-50"
              placeholder={
                loadingExercises ? "Loading..." : "Search exercises DB"
              }
              value={exercises.name}
              onChange={handleChange}
              onFocus={handleExerciseInputFocus}
              onBlur={handleExerciseInputBlur}
              disabled={loadingExercises}
              autoComplete="off"
            />
            {showDropDown && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-sm max-h-40 overflow-y-auto">
                {filteredExerciseNames.map((exercise, index) => (
                  <div
                    key={index}
                    onClick={() => handleExerciseSelect(exercise)}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 border-b border-gray-50 last:border-b-0 text-xs"
                  >
                    {exercise}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Weight (lbs)
            </label>
            <input
              id="weight"
              required
              type="number"
              name="weight"
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs bg-gray-50"
              placeholder="e.g. 135"
              value={exercises.weight}
              onChange={handleChange}
            />
          </div>

          {/* Sets and Reps */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Sets</label>
              <select
                id="sets"
                required
                name="sets"
                className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs bg-gray-50"
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
            <div>
              <label className="text-xs text-gray-400 block mb-1">Reps</label>
              <select
                id="reps"
                required
                name="reps"
                className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs bg-gray-50"
                value={exercises.reps}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                  (num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Date</label>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs bg-gray-50"
            />
          </div>

          <hr className="border-gray-100" />

          {/* Save button */}
          <button
            type="submit"
            className="w-full py-2 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
          >
            Save workout
          </button>
        </form>
      </div>
    </div>
  );
}
