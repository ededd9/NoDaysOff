import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkoutSplit from "./pages/WorkoutSplit";
import Feed from "./pages/Feed";
import Progress from "./pages/Progress";
import { useAuth } from "./context/authContext";
import Profile from "./pages/Profile";
import axios from "axios";
import ProtectedRoutes from "./components/ProtectedRoutes";

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
    const token = localStorage.getItem("token");
    //try to load user workouts
    if (!token || !user) {
      setFullUser([]); // Clear data if no token
      setWorkout([]);
      setExercises({
        name: "",
        weight: 0,
        reps: 0,
        sets: 0,
        date: "",
      });
      return;
    }
    try {
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
          localStorage.removeItem("token");
          window.location.href = "/login";
          setFullUser([]);
          setWorkout([]);
          setExercises({
            name: "",
            weight: 0,
            reps: 0,
            sets: 0,
            date: "",
          });
        }
      }
    }
  };
  //check if a user is logged in(check if there is a "user" and that user has a token), if not,
  //set state to null and everything is an empty state
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Always call fetchUser to either fetch data or clear it
    if (user === null) {
      // User is explicitly logged out
      setFullUser([]);
      setWorkout([]);
      setExercises({
        name: "",
        weight: 0,
        reps: 0,
        sets: 0,
        date: "",
      });
    } else if (user && user._id && token) {
      // User is logged in and has token
      fetchUser();
    } else if (!token) {
      // No token available
      setFullUser([]);
      setWorkout([]);
      setExercises({
        name: "",
        weight: 0,
        reps: 0,
        sets: 0,
        date: "",
      });
    }
  }, [user]); // Only depend on user changes
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
          path="/"
          element={
            <ProtectedRoutes>
              <Dashboard fullUser={fullUser} fetchUser={fetchUser} />{" "}
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/home"
          element={
            <ProtectedRoutes>
              <Dashboard fullUser={fullUser} fetchUser={fetchUser} />{" "}
            </ProtectedRoutes>
          }
        />

        <Route
          path="/Profile/:userId"
          element={
            <ProtectedRoutes>
              <div>
                <Profile />
              </div>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/Feed"
          element={
            <ProtectedRoutes>
              <div>
                <Feed />
              </div>
            </ProtectedRoutes>
          }
        />
        {/* <Route
          path="/WorkoutSplit"
          element={
            <div>
              <WorkoutSplit split={split} setSplit={setSplit} />
            </div>
          }
        /> */}
        <Route
          path="/Progression"
          element={
            <ProtectedRoutes>
              <div>
                <Progress fullUser={fullUser} />
              </div>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
