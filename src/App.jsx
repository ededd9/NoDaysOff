import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkoutStats from "./pages/WorkoutStats";
import WorkoutSplit from "./pages/WorkoutSplit";
import { useAuth } from "./context/authContext";
import axios from "axios";

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
  const { user } = useAuth();
  const [fullUser, setFullUser] = useState([]);
  const fetchUser = async () => {
    //try to load user workouts
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5050/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setFullUser(response.data.data);
      }
    } catch (err) {
      //some sort of error occured, access token might need to be refreshed
      console.log("Access token might be expired:", err.response?.status);
      if (err.response?.status === 401 || err.response?.status === 403) {
        try {
          const refreshResponse = await axios.post(
            `http://localhost:5050/api/auth/refresh`,
            {},
            { withCredentials: true }
          );
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem("token", newAccessToken);
          const retryResponse = await axios.get(
            `http://localhost:5050/api/workouts`,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
              withCredentials: true,
            }
          );

          if (retryResponse.data.status === "success") {
            setFullUser(retryResponse.data.data);
          }
        } catch (err) {
          console.error("Refresh failed:", err);
        }
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && user.id && token) {
      fetchUser();
    }
  }, [user]);
  return (
    <BrowserRouter>
      <Navbar
        setWorkout={setWorkout}
        exercises={exercises}
        setExercises={setExercises}
        fetchUser={fetchUser}
      />
      <Routes>
        <Route
          path="/home"
          element={<Dashboard fullUser={fullUser} fetchUser={fetchUser} />}
        />
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
