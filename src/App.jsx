import { useState } from "react";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkoutStats from "./pages/WorkoutStats";
import WorkoutSplit from "./pages/WorkoutSplit";
function App() {
  //hierarchy of prop drilling
  const [exercises, setExercises] = useState({
    name: "",
    weight: 0,
    reps: 0,
    sets: 0,
    date: "",
  });
  const [workout, setWorkout] = useState([]);
  const [split, setSplit] = useState("");
  return (
    <BrowserRouter>
      <Navbar
        setWorkout={setWorkout}
        exercises={exercises}
        setExercises={setExercises}
      />
      <Routes>
        <Route path="/home" element={<Dashboard workout={workout} />} />
        <Route
          path="/statistics"
          element={
            <div>
              <WorkoutStats />
            </div>
          }
        />
        <Route
          path="/WorkoutSplit"
          element={
            <div>
              <WorkoutSplit split={split} setSplit={setSplit} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
